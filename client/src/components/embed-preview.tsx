import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Globe, Activity } from "lucide-react";
import type { GuildConfig } from "@shared/schema";

interface EmbedPreviewProps {
  config: Partial<GuildConfig>;
  guildName?: string;
}

export function EmbedPreview({ config, guildName = "Your Server" }: EmbedPreviewProps) {
  const primaryColor = config.primaryColor || "#00AEEF";

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-lg" data-testid="card-embed-preview">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium" data-testid="text-embed-preview-title">
          <Globe className="h-5 w-5 text-secondary" />
          Embed Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="overflow-hidden rounded-lg border border-white/10 bg-[#2f3136]"
          style={{ borderLeftWidth: "4px", borderLeftColor: primaryColor }}
          data-testid="container-discord-embed"
        >
          <div className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <Avatar className="h-6 w-6">
                {config.iconUrl ? (
                  <AvatarImage src={config.iconUrl} alt="Bot" />
                ) : null}
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-xs text-white">
                  G
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold text-white">GeoLive Bot</span>
            </div>

            <div className="mb-3">
              <h3 
                className="mb-1 text-base font-semibold"
                style={{ color: primaryColor }}
              >
                Earthquake Alert
              </h3>
              <p className="text-sm text-gray-300">
                A magnitude 5.2 earthquake was detected 120km from your location.
              </p>
            </div>

            <div className="mb-3 space-y-1.5">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-orange-400" />
                <span className="text-xs text-gray-400">Magnitude:</span>
                <span className="text-xs font-medium text-white">5.2</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-gray-400">Location:</span>
                <span className="text-xs font-medium text-white">Pacific Ocean</span>
              </div>
            </div>

            {config.bannerUrl && (
              <div className="mb-3 overflow-hidden rounded-lg">
                <img
                  src={config.bannerUrl}
                  alt="Banner"
                  className="h-32 w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{guildName}</span>
              <span>•</span>
              <span>Today at 12:00 PM</span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          This is how your embed will appear in Discord
        </p>
      </CardContent>
    </Card>
  );
}
