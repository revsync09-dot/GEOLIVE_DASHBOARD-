import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { DiscordUser, DiscordGuild, UserLocation } from "@shared/schema";

interface AuthContextType {
  user: DiscordUser | null;
  guilds: DiscordGuild[];
  location: UserLocation | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  setLocation: (location: UserLocation) => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [guilds, setGuilds] = useState<DiscordGuild[]>([]);
  const [location, setLocationState] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setGuilds(data.guilds || []);
        if (data.location) {
          setLocationState(data.location);
        }
      } else {
        setUser(null);
        setGuilds([]);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
      setGuilds([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Load location from localStorage on mount, then try geolocation
  useEffect(() => {
    if (user && !location) {
      // First, try to load from localStorage as immediate fallback
      const savedLocation = localStorage.getItem("geolive_location");
      if (savedLocation) {
        try {
          const parsed = JSON.parse(savedLocation);
          // Use proper numeric validation (0 is a valid lat/lon value)
          if (typeof parsed.lat === "number" && !Number.isNaN(parsed.lat) &&
              typeof parsed.lon === "number" && !Number.isNaN(parsed.lon)) {
            setLocationState(parsed);
            fetch("/api/location/update", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: savedLocation,
            }).catch(console.error);
          }
        } catch (e) {
          console.error("Failed to parse saved location:", e);
        }
      }
      
      // Then try geolocation for fresh coordinates
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const newLocation = {
              lat: pos.coords.latitude,
              lon: pos.coords.longitude,
            };
            setLocationState(newLocation);
            localStorage.setItem("geolive_location", JSON.stringify(newLocation));
            try {
              await fetch("/api/location/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(newLocation),
              });
            } catch (error) {
              console.error("Failed to update location:", error);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            // Location denied - localStorage fallback already loaded above
          }
        );
      }
    }
  }, [user]);

  const login = () => {
    window.location.href = "/api/auth/discord";
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      setGuilds([]);
      setLocationState(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const setLocation = async (newLocation: UserLocation) => {
    setLocationState(newLocation);
    localStorage.setItem("geolive_location", JSON.stringify(newLocation));
    try {
      await fetch("/api/location/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newLocation),
      });
    } catch (error) {
      console.error("Failed to update location:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        guilds,
        location,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        setLocation,
        refetchUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
