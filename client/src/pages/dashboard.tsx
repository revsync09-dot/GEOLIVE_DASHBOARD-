import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherWidget } from "@/components/widgets/weather-widget";
import { EarthquakeWidget } from "@/components/widgets/earthquake-widget";
import { ISSWidget } from "@/components/widgets/iss-widget";
import { AuroraWidget } from "@/components/widgets/aurora-widget";
import { Server, Activity, Globe, Sparkles } from "lucide-react";
import { Redirect, Link } from "wouter";

export default function DashboardPage() {
  const { user, guilds, isAuthenticated, isLoading } = useAuth();

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

  const managedGuilds = guilds.filter((g) => {
    if (!g.permissions) return false;
    const perms = BigInt(g.permissions);
    const MANAGE_GUILD = BigInt(0x20);
    return (perms & MANAGE_GUILD) === MANAGE_GUILD;
  });

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-light tracking-tight text-foreground" data-testid="text-welcome">
            Welcome back, <span className="font-semibold" data-testid="text-username">{user?.username}</span>
          </h1>
          <p className="mt-1 text-muted-foreground" data-testid="text-subtitle">
            Here's an overview of your GeoLive dashboard
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-white/10 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 backdrop-blur-lg" data-testid="card-stat-servers">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 shadow-lg">
                <Server className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground" data-testid="text-server-count">{managedGuilds.length}</p>
                <p className="text-sm text-muted-foreground">Managed Servers</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-lg" data-testid="card-stat-earthquake">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">Live</p>
                <p className="text-sm text-muted-foreground">Earthquake Feed</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-sky-500/20 to-blue-500/20 backdrop-blur-lg" data-testid="card-stat-weather">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 shadow-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">Active</p>
                <p className="text-sm text-muted-foreground">Weather Updates</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-lg" data-testid="card-stat-aurora">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-teal-500 shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">Tracking</p>
                <p className="text-sm text-muted-foreground">Aurora & ISS</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-medium text-foreground" data-testid="text-widgets-title">Live Geo Widgets</h2>
            <p className="text-sm text-muted-foreground">Based on your location</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2" data-testid="container-widgets">
            <WeatherWidget />
            <EarthquakeWidget />
            <ISSWidget />
            <AuroraWidget />
          </div>
        </div>

        {managedGuilds.length > 0 && (
          <div>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-lg font-medium text-foreground" data-testid="text-quick-access">Quick Access</h2>
              <Link href="/servers" className="text-sm text-primary hover:underline" data-testid="link-view-all-servers">
                View all servers
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="container-quick-access">
              {managedGuilds.slice(0, 3).map((guild) => (
                <Link key={guild.id} href={`/guild/${guild.id}`} data-testid={`link-quick-guild-${guild.id}`}>
                  <Card className="border-white/10 bg-white/5 backdrop-blur-lg transition-all hover:scale-[1.02] hover:border-primary/30 hover:shadow-lg" data-testid={`card-quick-guild-${guild.id}`}>
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/50 to-accent/50">
                        {guild.icon ? (
                          <img
                            src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                            alt={guild.name}
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                        ) : (
                          <span className="text-lg font-bold text-white">
                            {guild.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 truncate">
                        <p className="font-medium text-foreground truncate" data-testid={`text-guild-name-${guild.id}`}>{guild.name}</p>
                        <p className="text-sm text-muted-foreground">Click to configure</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
