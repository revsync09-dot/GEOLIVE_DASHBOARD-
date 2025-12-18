import { randomUUID } from "crypto";
import type { 
  DiscordUser, 
  DiscordGuild, 
  GuildConfig, 
  UserLocation,
  InsertGuildConfig
} from "@shared/schema";

export interface IStorage {
  // User sessions
  getSession(sessionId: string): Promise<SessionData | undefined>;
  createSession(sessionId: string, data: SessionData): Promise<void>;
  updateSession(sessionId: string, data: Partial<SessionData>): Promise<void>;
  deleteSession(sessionId: string): Promise<void>;

  // Guild configs
  getGuildConfig(guildId: string): Promise<GuildConfig | undefined>;
  saveGuildConfig(guildId: string, config: InsertGuildConfig): Promise<GuildConfig>;
}

export interface SessionData {
  user: DiscordUser | null;
  guilds: DiscordGuild[];
  location: UserLocation | null;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiry: number | null;
}

export class MemStorage implements IStorage {
  private sessions: Map<string, SessionData>;
  private guildConfigs: Map<string, GuildConfig>;

  constructor() {
    this.sessions = new Map();
    this.guildConfigs = new Map();
  }

  async getSession(sessionId: string): Promise<SessionData | undefined> {
    return this.sessions.get(sessionId);
  }

  async createSession(sessionId: string, data: SessionData): Promise<void> {
    this.sessions.set(sessionId, data);
  }

  async updateSession(sessionId: string, data: Partial<SessionData>): Promise<void> {
    const existing = this.sessions.get(sessionId);
    if (existing) {
      this.sessions.set(sessionId, { ...existing, ...data });
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId);
  }

  async getGuildConfig(guildId: string): Promise<GuildConfig | undefined> {
    return this.guildConfigs.get(guildId);
  }

  async saveGuildConfig(guildId: string, config: InsertGuildConfig): Promise<GuildConfig> {
    const fullConfig: GuildConfig = {
      guildId,
      earthquakeFeedEnabled: config.earthquakeFeedEnabled ?? true,
      weatherFeedEnabled: config.weatherFeedEnabled ?? true,
      issFeedEnabled: config.issFeedEnabled ?? false,
      auroraFeedEnabled: config.auroraFeedEnabled ?? false,
      intervalMinutes: config.intervalMinutes ?? 15,
      primaryColor: config.primaryColor ?? "#00AEEF",
      iconUrl: config.iconUrl ?? "",
      bannerUrl: config.bannerUrl ?? "",
    };
    this.guildConfigs.set(guildId, fullConfig);
    return fullConfig;
  }
}

export const storage = new MemStorage();
