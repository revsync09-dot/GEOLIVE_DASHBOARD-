import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Check, 
  Zap, 
  Shield, 
  Clock, 
  Palette,
  Infinity,
  Sparkles
} from "lucide-react";
import { Redirect } from "wouter";

export default function PremiumPage() {
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

  const features = [
    { icon: Infinity, text: "Unlimited server connections" },
    { icon: Clock, text: "1-minute update intervals" },
    { icon: Palette, text: "Custom embed themes" },
    { icon: Shield, text: "Priority support" },
    { icon: Zap, text: "Early access to new features" },
    { icon: Sparkles, text: "Premium badge on embeds" },
  ];

  const plans = [
    {
      name: "Monthly",
      price: "$4.99",
      period: "/month",
      popular: false,
    },
    {
      name: "Yearly",
      price: "$49.99",
      period: "/year",
      popular: true,
      savings: "Save 17%",
    },
    {
      name: "Lifetime",
      price: "$99.99",
      period: "one-time",
      popular: false,
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-4 py-2" data-testid="badge-premium">
            <Crown className="h-5 w-5 text-amber-400" />
            <span className="font-medium text-amber-400">Premium</span>
          </div>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground lg:text-4xl" data-testid="text-premium-title">
            Unlock the Full Power of{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              GeoLive
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground" data-testid="text-premium-subtitle">
            Get faster updates, unlimited servers, and exclusive features with GeoLive Premium
          </p>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-3" data-testid="container-pricing-plans">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={`relative border-white/10 bg-white/5 backdrop-blur-lg transition-all hover:scale-[1.02] ${
                plan.popular ? "ring-2 ring-amber-400" : ""
              }`}
              data-testid={`card-plan-${plan.name.toLowerCase()}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white" data-testid="badge-most-popular">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-lg font-medium text-foreground" data-testid={`text-plan-name-${plan.name.toLowerCase()}`}>
                  {plan.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground" data-testid={`text-plan-price-${plan.name.toLowerCase()}`}>{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                {plan.savings && (
                  <Badge variant="secondary" className="mt-2" data-testid="badge-savings">
                    {plan.savings}
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <Button 
                  className={`w-full rounded-full ${
                    plan.popular 
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600" 
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  data-testid={`button-subscribe-${plan.name.toLowerCase()}`}
                >
                  Subscribe
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-white/10 bg-white/5 backdrop-blur-lg" data-testid="card-features">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-xl font-medium" data-testid="text-features-title">
              <Sparkles className="h-5 w-5 text-amber-400" />
              Premium Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="container-features">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 rounded-lg bg-white/5 p-4"
                  data-testid={`card-feature-${index}`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400/20 to-orange-500/20">
                    <feature.icon className="h-5 w-5 text-amber-400" />
                  </div>
                  <span className="font-medium text-foreground" data-testid={`text-feature-${index}`}>{feature.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            All payments are processed securely. Cancel anytime.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
