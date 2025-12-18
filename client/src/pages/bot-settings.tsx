import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  Bell, 
  Globe, 
  Shield, 
  Key,
  Save,
  Info
} from "lucide-react";
import { Redirect } from "wouter";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function BotSettingsPage() {
  const { isAuthenticated, isLoading } = useAuth();

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

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-light tracking-tight text-foreground">
            <span className="font-semibold">𝙂𝙚𝙤𝙇𝙞𝙫𝙚</span> Bot Settings
          </h1>
          <p className="mt-1 text-muted-foreground">
            Configure global settings for your GeoLive bot
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-white/10 bg-white/5 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-medium">
                <Bell className="h-5 w-5 text-primary" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <Label className="text-base font-medium">Dashboard Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts in the dashboard</p>
                  </div>
                </div>
                <Switch defaultChecked data-testid="switch-dashboard-notifications" />
              </div>

              <div className="flex items-center justify-between rounded-lg bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-400 to-indigo-500">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <Label className="text-base font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get important updates via email</p>
                  </div>
                </div>
                <Switch data-testid="switch-email-notifications" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-medium">
                <Shield className="h-5 w-5 text-accent" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-emerald-500">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <Label className="text-base font-medium">Share Location</Label>
                    <p className="text-sm text-muted-foreground">Enable location-based features</p>
                  </div>
                </div>
                <Switch defaultChecked data-testid="switch-share-location" />
              </div>

              <div className="flex items-center justify-between rounded-lg bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-red-500">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <Label className="text-base font-medium">Data Analytics</Label>
                    <p className="text-sm text-muted-foreground">Help improve GeoLive with usage data</p>
                  </div>
                </div>
                <Switch defaultChecked data-testid="switch-analytics" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur-lg lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-medium">
                <Key className="h-5 w-5 text-secondary" />
                API Keys (Advanced)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-white/10 bg-white/5">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  These API keys are pre-configured for GeoLive. Only change them if you want to use your own API keys.
                </AlertDescription>
              </Alert>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="weather-api">WeatherAPI Key</Label>
                  <Input
                    id="weather-api"
                    type="password"
                    placeholder="••••••••••••••••"
                    className="bg-white/5"
                    disabled
                    data-testid="input-weather-api-key"
                  />
                  <p className="text-xs text-muted-foreground">Used for weather data feeds</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nasa-api">NASA API Key</Label>
                  <Input
                    id="nasa-api"
                    type="password"
                    placeholder="••••••••••••••••"
                    className="bg-white/5"
                    disabled
                    data-testid="input-nasa-api-key"
                  />
                  <p className="text-xs text-muted-foreground">Used for ISS tracking</p>
                </div>
              </div>

              <Button 
                className="gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                disabled
                data-testid="button-save-api-keys"
              >
                <Save className="h-4 w-4" />
                Save API Keys
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
