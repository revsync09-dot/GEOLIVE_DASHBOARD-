import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Discord User stored in session
export const discordUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  discriminator: z.string(),
  avatar: z.string().nullable(),
  email: z.string().optional(),
  verified: z.boolean().optional(),
});

export type DiscordUser = z.infer<typeof discordUserSchema>;

// Discord Guild from API
export const discordGuildSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().nullable(),
  owner: z.boolean().optional(),
  permissions: z.string().optional(),
  features: z.array(z.string()).optional(),
});

export type DiscordGuild = z.infer<typeof discordGuildSchema>;

// Guild Configuration stored per guild
export const guildConfigSchema = z.object({
  guildId: z.string(),
  earthquakeFeedEnabled: z.boolean().default(true),
  weatherFeedEnabled: z.boolean().default(true),
  issFeedEnabled: z.boolean().default(false),
  auroraFeedEnabled: z.boolean().default(false),
  intervalMinutes: z.number().min(5).max(60).default(15),
  primaryColor: z.string().default("#00AEEF"),
  iconUrl: z.string().default(""),
  bannerUrl: z.string().default(""),
});

export type GuildConfig = z.infer<typeof guildConfigSchema>;

export const insertGuildConfigSchema = guildConfigSchema.omit({ guildId: true });
export type InsertGuildConfig = z.infer<typeof insertGuildConfigSchema>;

// User Location for geo widgets
export const userLocationSchema = z.object({
  lat: z.number(),
  lon: z.number(),
});

export type UserLocation = z.infer<typeof userLocationSchema>;

// Weather API Response
export const weatherDataSchema = z.object({
  location: z.string(),
  temperature: z.number(),
  condition: z.string(),
  icon: z.string(),
  humidity: z.number(),
  windSpeed: z.number(),
  feelsLike: z.number(),
});

export type WeatherData = z.infer<typeof weatherDataSchema>;

// Earthquake Data from USGS
export const earthquakeSchema = z.object({
  id: z.string(),
  magnitude: z.number(),
  place: z.string(),
  time: z.number(),
  distance: z.number(),
  lat: z.number(),
  lon: z.number(),
});

export type Earthquake = z.infer<typeof earthquakeSchema>;

// ISS Data
export const issDataSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  altitude: z.number(),
  velocity: z.number(),
  visibility: z.string(),
  nextPass: z.string().optional(),
});

export type ISSData = z.infer<typeof issDataSchema>;

// Aurora Data
export const auroraDataSchema = z.object({
  kpIndex: z.number(),
  probability: z.number(),
  forecast: z.string(),
});

export type AuroraData = z.infer<typeof auroraDataSchema>;

// Database tables (for future PostgreSQL integration)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  discordId: text("discord_id").notNull().unique(),
  username: text("username").notNull(),
  avatar: text("avatar"),
  email: text("email"),
});

export const guildConfigs = pgTable("guild_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  guildId: text("guild_id").notNull().unique(),
  earthquakeFeedEnabled: boolean("earthquake_feed_enabled").default(true),
  weatherFeedEnabled: boolean("weather_feed_enabled").default(true),
  issFeedEnabled: boolean("iss_feed_enabled").default(false),
  auroraFeedEnabled: boolean("aurora_feed_enabled").default(false),
  intervalMinutes: integer("interval_minutes").default(15),
  primaryColor: text("primary_color").default("#00AEEF"),
  iconUrl: text("icon_url").default(""),
  bannerUrl: text("banner_url").default(""),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const insertGuildConfigDbSchema = createInsertSchema(guildConfigs).omit({ id: true });
export type InsertGuildConfigDb = z.infer<typeof insertGuildConfigDbSchema>;
export type GuildConfigDb = typeof guildConfigs.$inferSelect;
