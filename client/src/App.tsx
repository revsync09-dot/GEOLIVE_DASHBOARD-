import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import ServersPage from "@/pages/servers";
import GuildSettingsPage from "@/pages/guild-settings";
import SupportPage from "@/pages/support";
import PremiumPage from "@/pages/premium";
import BotSettingsPage from "@/pages/bot-settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LoginPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/servers" component={ServersPage} />
      <Route path="/guild/:guildId" component={GuildSettingsPage} />
      <Route path="/settings" component={BotSettingsPage} />
      <Route path="/support" component={SupportPage} />
      <Route path="/premium" component={PremiumPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
