import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, ArrowRight } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { Redirect } from "wouter";

export default function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-purple-500/30 to-indigo-500/30 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 blur-3xl" />
      </div>

      <Card className="relative z-10 w-full max-w-md border-white/10 bg-white/5 backdrop-blur-xl">
        <CardContent className="flex flex-col items-center p-8 pt-12">
          <div className="relative mb-8">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-purple-500/50 to-indigo-500/50 blur-xl" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-2xl">
              <Globe className="h-12 w-12 text-white" />
            </div>
          </div>

          <h1 className="mb-2 text-center text-3xl font-bold tracking-tight text-foreground">
            <span className="font-light">𝙂𝙚𝙤𝙇𝙞𝙫𝙚</span> Dashboard
          </h1>
          <p className="mb-8 text-center text-muted-foreground">
            Manage your Discord bot with real-time geo data feeds
          </p>

          <Button
            onClick={login}
            size="lg"
            className="group w-full gap-3 rounded-full bg-[#5865F2] py-6 text-base font-medium shadow-lg transition-all hover:bg-[#4752C4] hover:shadow-xl"
            data-testid="button-login-discord"
          >
            <SiDiscord className="h-5 w-5" />
            Login with Discord
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5" data-testid="feature-earthquake">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Earthquake Alerts</span>
            </div>
            <div className="flex items-center gap-1.5" data-testid="feature-weather">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span>Weather Updates</span>
            </div>
            <div className="flex items-center gap-1.5" data-testid="feature-iss">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
              <span>ISS Tracking</span>
            </div>
            <div className="flex items-center gap-1.5" data-testid="feature-aurora">
              <div className="h-2 w-2 rounded-full bg-teal-500" />
              <span>Aurora Forecasts</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
