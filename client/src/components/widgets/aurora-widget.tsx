import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { AuroraData } from "@shared/schema";

export function AuroraWidget() {
  const { data: auroraData, isLoading, error } = useQuery<AuroraData>({
    queryKey: ["/api/local/aurora"],
    refetchInterval: 600000,
  });

  if (isLoading) {
    return (
      <Card className="border-white/10 bg-white/5 backdrop-blur-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !auroraData) {
    return (
      <Card className="border-white/10 bg-white/5 backdrop-blur-lg">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <Sparkles className="mb-2 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Aurora data unavailable
          </p>
        </CardContent>
      </Card>
    );
  }

  const getKpColor = (kp: number) => {
    if (kp >= 7) return "from-red-400 to-pink-500";
    if (kp >= 5) return "from-orange-400 to-amber-500";
    if (kp >= 3) return "from-green-400 to-emerald-500";
    return "from-blue-400 to-cyan-500";
  };

  const getKpLabel = (kp: number) => {
    if (kp >= 7) return "Severe Storm";
    if (kp >= 5) return "Moderate Storm";
    if (kp >= 3) return "Active";
    return "Quiet";
  };

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-lg" data-testid="widget-aurora">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-4">
          <div className={`flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${getKpColor(auroraData.kpIndex)} shadow-lg`}>
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground" data-testid="text-aurora-label">Aurora Forecast</p>
            <p className="text-2xl font-bold text-foreground" data-testid="text-aurora-kp">Kp {auroraData.kpIndex}</p>
            <p className="text-sm text-muted-foreground" data-testid="text-aurora-status">{getKpLabel(auroraData.kpIndex)}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Visibility Probability</span>
            <span className="text-sm font-medium" data-testid="text-aurora-probability">{auroraData.probability}%</span>
          </div>
          <Progress value={auroraData.probability} className="h-2" data-testid="progress-aurora" />
          
          <div className="flex items-center gap-2 rounded-lg bg-white/5 p-3" data-testid="card-aurora-forecast">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <div>
              <p className="text-xs text-muted-foreground">Forecast</p>
              <p className="text-sm font-medium" data-testid="text-aurora-forecast">{auroraData.forecast}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
