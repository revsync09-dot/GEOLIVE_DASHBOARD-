import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings } from "lucide-react";
import type { DiscordGuild } from "@shared/schema";

interface GuildCardProps {
  guild: DiscordGuild;
}

export function GuildCard({ guild }: GuildCardProps) {
  const getGuildIconUrl = () => {
    if (guild.icon) {
      return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=256`;
    }
    return null;
  };

  const getInitials = () => {
    return guild.name
      .split(" ")
      .map((word) => word.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div
      className="group relative flex h-56 w-full flex-col items-center justify-between overflow-visible rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-indigo-500/20 p-6 backdrop-blur-lg transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/20"
      data-testid={`card-guild-${guild.id}`}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/50 to-accent/50 opacity-0 blur transition-opacity duration-300 group-hover:opacity-30" />
      
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-4">
        <Avatar className="h-20 w-20 ring-2 ring-white/20 ring-offset-2 ring-offset-transparent transition-transform duration-300 group-hover:scale-105">
          <AvatarImage
            src={getGuildIconUrl() || undefined}
            alt={guild.name}
            className="object-cover"
          />
          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-xl font-bold text-white">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        
        <h3 className="max-w-full truncate text-center text-base font-medium text-foreground">
          {guild.name}
        </h3>
      </div>
      
      <div className="relative z-10 w-full">
        <Link href={`/guild/${guild.id}`}>
          <Button
            className="w-full gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 font-medium text-white shadow-lg transition-all duration-200 hover:from-indigo-600 hover:to-purple-600 hover:shadow-xl"
            data-testid={`button-setup-guild-${guild.id}`}
          >
            <Settings className="h-4 w-4" />
            Setup
          </Button>
        </Link>
      </div>
    </div>
  );
}
