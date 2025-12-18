import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage, type SessionData } from "./storage";
import { randomUUID } from "crypto";
import { guildConfigSchema } from "@shared/schema";

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

const DISCORD_API_BASE = "https://discord.com/api/v10";
const DISCORD_OAUTH_SCOPES = ["identify", "guilds"];

declare module "express-serve-static-core" {
  interface Request {
    sessionId?: string;
    session?: SessionData;
  }
}

function getRedirectUri(req: Request): string {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.headers.host || "localhost:5000";
  return `${protocol}://${host}/api/auth/discord/callback`;
}

async function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
  const sessionId = req.cookies?.sessionId;
  if (sessionId) {
    const session = await storage.getSession(sessionId);
    if (session) {
      req.sessionId = sessionId;
      req.session = session;
    }
  }
  next();
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const cookieParser = (await import("cookie-parser")).default;
  app.use(cookieParser());
  app.use(sessionMiddleware);

  // Discord OAuth: Start login
  app.get("/api/auth/discord", (req, res) => {
    if (!DISCORD_CLIENT_ID) {
      return res.status(500).json({ error: "Discord OAuth not configured" });
    }

    const redirectUri = getRedirectUri(req);
    const state = randomUUID();
    const params = new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: DISCORD_OAUTH_SCOPES.join(" "),
      state,
    });

    res.cookie("oauth_state", state, { httpOnly: true, maxAge: 600000 });
    res.redirect(`${DISCORD_API_BASE}/oauth2/authorize?${params}`);
  });

  // Discord OAuth: Callback
  app.get("/api/auth/discord/callback", async (req, res) => {
    const { code, state } = req.query;
    const savedState = req.cookies?.oauth_state;

    // Clear state cookie immediately to prevent replay attacks
    res.clearCookie("oauth_state");

    if (!code || !state || !savedState || state !== savedState) {
      return res.redirect("/?error=invalid_state");
    }

    if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) {
      return res.redirect("/?error=not_configured");
    }

    try {
      const redirectUri = getRedirectUri(req);
      
      // Exchange code for tokens
      const tokenResponse = await fetch(`${DISCORD_API_BASE}/oauth2/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: DISCORD_CLIENT_ID,
          client_secret: DISCORD_CLIENT_SECRET,
          grant_type: "authorization_code",
          code: code as string,
          redirect_uri: redirectUri,
        }),
      });

      if (!tokenResponse.ok) {
        console.error("Token exchange failed:", await tokenResponse.text());
        return res.redirect("/?error=token_exchange_failed");
      }

      const tokens = await tokenResponse.json();

      // Fetch user info
      const userResponse = await fetch(`${DISCORD_API_BASE}/users/@me`, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });

      if (!userResponse.ok) {
        return res.redirect("/?error=user_fetch_failed");
      }

      const user = await userResponse.json();

      // Fetch user guilds
      const guildsResponse = await fetch(`${DISCORD_API_BASE}/users/@me/guilds`, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });

      let guilds = [];
      if (guildsResponse.ok) {
        guilds = await guildsResponse.json();
      }

      // Create session
      const sessionId = randomUUID();
      await storage.createSession(sessionId, {
        user: {
          id: user.id,
          username: user.username,
          discriminator: user.discriminator || "0",
          avatar: user.avatar,
          email: user.email,
          verified: user.verified,
        },
        guilds,
        location: null,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiry: Date.now() + tokens.expires_in * 1000,
      });

      res.clearCookie("oauth_state");
      res.cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: "lax",
      });

      res.redirect("/dashboard");
    } catch (error) {
      console.error("OAuth callback error:", error);
      res.redirect("/?error=oauth_failed");
    }
  });

  // Get current user
  app.get("/api/auth/me", async (req, res) => {
    if (!req.session?.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    res.json({
      user: req.session.user,
      guilds: req.session.guilds,
      location: req.session.location,
    });
  });

  // Logout
  app.post("/api/auth/logout", async (req, res) => {
    if (req.sessionId) {
      await storage.deleteSession(req.sessionId);
    }
    res.clearCookie("sessionId");
    res.json({ success: true });
  });

  // Update user location
  app.post("/api/location/update", requireAuth, async (req, res) => {
    const { lat, lon } = req.body;
    
    if (typeof lat !== "number" || typeof lon !== "number") {
      return res.status(400).json({ error: "Invalid location data" });
    }

    if (req.sessionId) {
      await storage.updateSession(req.sessionId, {
        location: { lat, lon },
      });
    }

    res.json({ success: true });
  });

  // Get guild config
  app.get("/api/guild/:guildId/config", requireAuth, async (req, res) => {
    const { guildId } = req.params;
    
    // Verify user has access to this guild
    const hasAccess = req.session?.guilds.some((g) => {
      if (g.id !== guildId) return false;
      if (!g.permissions) return false;
      const perms = BigInt(g.permissions);
      const MANAGE_GUILD = BigInt(0x20);
      return (perms & MANAGE_GUILD) === MANAGE_GUILD;
    });

    if (!hasAccess) {
      return res.status(403).json({ error: "Access denied" });
    }

    let config = await storage.getGuildConfig(guildId);
    
    if (!config) {
      config = await storage.saveGuildConfig(guildId, {
        earthquakeFeedEnabled: true,
        weatherFeedEnabled: true,
        issFeedEnabled: false,
        auroraFeedEnabled: false,
        intervalMinutes: 15,
        primaryColor: "#00AEEF",
        iconUrl: "",
        bannerUrl: "",
      });
    }

    res.json(config);
  });

  // Save guild config
  app.post("/api/guild/:guildId/save", requireAuth, async (req, res) => {
    const { guildId } = req.params;
    
    // Verify user has access to this guild
    const hasAccess = req.session?.guilds.some((g) => {
      if (g.id !== guildId) return false;
      if (!g.permissions) return false;
      const perms = BigInt(g.permissions);
      const MANAGE_GUILD = BigInt(0x20);
      return (perms & MANAGE_GUILD) === MANAGE_GUILD;
    });

    if (!hasAccess) {
      return res.status(403).json({ error: "Access denied" });
    }

    try {
      const validatedData = guildConfigSchema.omit({ guildId: true }).parse(req.body);
      const config = await storage.saveGuildConfig(guildId, validatedData);
      res.json({ success: true, config });
    } catch (error) {
      console.error("Config validation error:", error);
      res.status(400).json({ error: "Invalid configuration data" });
    }
  });

  // Weather API endpoint
  app.get("/api/local/weather", requireAuth, async (req, res) => {
    const location = req.session?.location;
    
    if (!location) {
      return res.status(400).json({ error: "Location not set" });
    }

    if (!WEATHER_API_KEY) {
      return res.status(500).json({ error: "Weather API not configured" });
    }

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${location.lat},${location.lon}&aqi=no`
      );

      if (!response.ok) {
        throw new Error("Weather API request failed");
      }

      const data = await response.json();
      
      res.json({
        location: data.location?.name || "Unknown",
        temperature: data.current?.temp_c || 0,
        condition: data.current?.condition?.text || "Unknown",
        icon: data.current?.condition?.icon ? `https:${data.current.condition.icon}` : null,
        humidity: data.current?.humidity || 0,
        windSpeed: data.current?.wind_kph || 0,
        feelsLike: data.current?.feelslike_c || 0,
      });
    } catch (error) {
      console.error("Weather API error:", error);
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  });

  // Earthquake API endpoint (USGS)
  app.get("/api/local/earthquakes", requireAuth, async (req, res) => {
    const location = req.session?.location;
    
    if (!location) {
      return res.status(400).json({ error: "Location not set" });
    }

    try {
      // Fetch earthquakes from USGS within 500km radius
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const params = new URLSearchParams({
        format: "geojson",
        starttime: weekAgo.toISOString().split("T")[0],
        endtime: now.toISOString().split("T")[0],
        latitude: location.lat.toString(),
        longitude: location.lon.toString(),
        maxradiuskm: "500",
        minmagnitude: "2.5",
        orderby: "time",
        limit: "10",
      });

      const response = await fetch(
        `https://earthquake.usgs.gov/fdsnws/event/1/query?${params}`
      );

      if (!response.ok) {
        throw new Error("USGS API request failed");
      }

      const data = await response.json();
      
      const earthquakes = (data.features || []).map((feature: any) => {
        const coords = feature.geometry.coordinates;
        const distance = calculateDistance(
          location.lat,
          location.lon,
          coords[1],
          coords[0]
        );
        
        return {
          id: feature.id,
          magnitude: feature.properties.mag,
          place: feature.properties.place,
          time: feature.properties.time,
          distance: Math.round(distance),
          lat: coords[1],
          lon: coords[0],
        };
      });

      res.json(earthquakes);
    } catch (error) {
      console.error("Earthquake API error:", error);
      res.status(500).json({ error: "Failed to fetch earthquake data" });
    }
  });

  // ISS API endpoint
  app.get("/api/local/iss", requireAuth, async (req, res) => {
    try {
      const response = await fetch("http://api.open-notify.org/iss-now.json");
      
      if (!response.ok) {
        throw new Error("ISS API request failed");
      }

      const data = await response.json();
      const position = data.iss_position;
      
      res.json({
        latitude: parseFloat(position.latitude),
        longitude: parseFloat(position.longitude),
        altitude: 408, // Average ISS altitude in km
        velocity: 27600, // Average ISS velocity in km/h
        visibility: "Overhead",
        nextPass: null, // Would need more complex calculation
      });
    } catch (error) {
      console.error("ISS API error:", error);
      res.status(500).json({ error: "Failed to fetch ISS data" });
    }
  });

  // Aurora API endpoint (NOAA)
  app.get("/api/local/aurora", requireAuth, async (req, res) => {
    const location = req.session?.location;
    
    try {
      // Fetch NOAA space weather data
      const response = await fetch(
        "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json"
      );

      if (!response.ok) {
        throw new Error("NOAA API request failed");
      }

      const data = await response.json();
      
      // Get the most recent Kp index (skip header row)
      const latestEntry = data[data.length - 1];
      const kpIndex = parseFloat(latestEntry[1]) || 0;
      
      // Calculate probability based on Kp index and latitude
      let probability = 0;
      if (location) {
        const absLat = Math.abs(location.lat);
        if (absLat > 60) {
          probability = Math.min(kpIndex * 15, 100);
        } else if (absLat > 50) {
          probability = Math.min(kpIndex * 10, 80);
        } else if (absLat > 40) {
          probability = Math.min(kpIndex * 5, 50);
        } else {
          probability = Math.min(kpIndex * 2, 20);
        }
      }

      const forecast = kpIndex >= 5 
        ? "Geomagnetic storm in progress" 
        : kpIndex >= 3 
          ? "Minor geomagnetic activity" 
          : "Quiet geomagnetic conditions";

      res.json({
        kpIndex: Math.round(kpIndex * 10) / 10,
        probability: Math.round(probability),
        forecast,
      });
    } catch (error) {
      console.error("Aurora API error:", error);
      res.status(500).json({ error: "Failed to fetch aurora data" });
    }
  });

  return httpServer;
}

// Haversine formula to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
