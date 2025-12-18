import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GuildCard } from "@/components/guild-card";
import { Input } from "@/components/ui/input";
import { Search, Server as ServerIcon } from "lucide-react";
import { Redirect } from "wouter";

export default function ServersPage() {
  const { guilds, isAuthenticated, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredGuilds = managedGuilds.filter((guild) =>
    guild.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-light tracking-tight text-foreground" data-testid="text-servers-title">
              <span className="font-semibold">𝙂𝙚𝙤𝙇𝙞𝙫𝙚</span> Servers
            </h1>
            <p className="mt-1 text-muted-foreground" data-testid="text-servers-subtitle">
              Select a server to configure GeoLive feeds
            </p>
          </div>
          
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search servers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 pl-9"
              data-testid="input-search-servers"
            />
          </div>
        </div>

        {filteredGuilds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center" data-testid="container-empty-state">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
              <ServerIcon className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-xl font-medium text-foreground" data-testid="text-empty-title">
              {searchQuery ? "No servers found" : "No servers available"}
            </h2>
            <p className="max-w-md text-muted-foreground" data-testid="text-empty-message">
              {searchQuery
                ? `No servers match "${searchQuery}". Try a different search.`
                : "You need to have Manage Server permission in at least one Discord server to configure GeoLive."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" data-testid="container-servers-grid">
            {filteredGuilds.map((guild) => (
              <GuildCard key={guild.id} guild={guild} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
