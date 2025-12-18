import { useState } from "react";
import { useRoute, Redirect, Link } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GuildSettingsForm } from "@/components/guild-settings-form";
import { EmbedPreview } from "@/components/embed-preview";
import { WeatherWidget } from "@/components/widgets/weather-widget";
import { EarthquakeWidget } from "@/components/widgets/earthquake-widget";
import { ISSWidget } from "@/components/widgets/iss-widget";
import { AuroraWidget } from "@/components/widgets/aurora-widget";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Settings } from "lucide-react";
import type { GuildConfig } from "@shared/schema";

export default function GuildSettingsPage() {
  const [, params] = useRoute("/guild/:guildId");
  const { guilds, isAuthenticated, isLoading } = useAuth();
  const [previewConfig, setPreviewConfig] = useState<Partial<GuildConfig>>({});

  const guildId = params?.guildId;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }

  const guild = guilds.find((g) => g.id === guildId);

  if (!guild) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Settings className="mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-medium text-foreground">Server not found</h2>
          <p className="mb-4 text-muted-foreground">
            The server you're looking for doesn't exist or you don't have access.
          </p>
          <Link href="/servers">
            <Button variant="outline">Back to Servers</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <Link href="/servers">
            <Button variant="ghost" size="sm" className="mb-4 gap-2" data-testid="button-back-to-servers">
              <ChevronLeft className="h-4 w-4" />
              Back to Servers
            </Button>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/50 to-accent/50" data-testid="avatar-guild">
              {guild.icon ? (
                <img
                  src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`}
                  alt={guild.name}
                  className="h-16 w-16 object-cover"
                  data-testid="img-guild-icon"
                />
              ) : (
                <span className="text-2xl font-bold text-white" data-testid="text-guild-initial">
                  {guild.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-light tracking-tight text-foreground" data-testid="text-settings-title">
                <span className="font-semibold">𝙂𝙚𝙤𝙇𝙞𝙫𝙚</span> Settings
              </h1>
              <p className="mt-1 text-muted-foreground" data-testid="text-guild-name">{guild.name}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <GuildSettingsForm
              guildId={guildId!}
              onConfigChange={setPreviewConfig}
            />
          </div>

          <div className="space-y-6">
            <EmbedPreview config={previewConfig} guildName={guild.name} />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground" data-testid="text-live-preview-title">Live Data Preview</h3>
              <div className="grid gap-4" data-testid="container-live-preview">
                {previewConfig.weatherFeedEnabled !== false && <WeatherWidget />}
                {previewConfig.earthquakeFeedEnabled !== false && <EarthquakeWidget />}
                {previewConfig.issFeedEnabled && <ISSWidget />}
                {previewConfig.auroraFeedEnabled && <AuroraWidget />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
