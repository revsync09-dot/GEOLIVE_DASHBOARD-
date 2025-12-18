import { Link, useLocation } from "wouter";
import { Home, Server, Settings, HelpCircle, Crown, Globe } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Servers", url: "/servers", icon: Server },
  { title: "Bot Settings", url: "/settings", icon: Settings },
  { title: "Support", url: "/support", icon: HelpCircle },
  { title: "Premium", url: "/premium", icon: Crown },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3" data-testid="link-logo">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tight text-foreground" data-testid="text-brand-name">
              GeoLive
            </span>
            <span className="text-xs text-muted-foreground">Dashboard</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = location === item.url || 
                  (item.url === "/servers" && location.startsWith("/guild/"));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="h-11 gap-3 rounded-lg px-3 transition-all duration-200"
                    >
                      <Link href={item.url} data-testid={`nav-link-${item.title.toLowerCase().replace(" ", "-")}`}>
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 p-4 backdrop-blur-sm" data-testid="card-premium-promo">
          <div className="flex items-center gap-3">
            <Crown className="h-5 w-5 text-amber-400" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground" data-testid="text-premium-title">Go Premium</span>
              <span className="text-xs text-muted-foreground">Unlock all features</span>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
