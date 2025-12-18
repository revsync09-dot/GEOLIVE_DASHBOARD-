import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Rocket, Clock, Navigation, Gauge } from "lucide-react";
import type { ISSData } from "@shared/schema";

export function ISSWidget() {
  const { data: issData, isLoading, error } = useQuery<ISSData>({
    queryKey: ["/api/local/iss"],
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <Card className="border-white/10 bg-white/5 backdrop-blur-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !issData) {
    return (
      <Card className="border-white/10 bg-white/5 backdrop-blur-lg">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <Rocket className="mb-2 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Unable to track ISS position
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-lg" data-testid="widget-iss">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg">
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground" data-testid="text-iss-label">International Space Station</p>
            <p className="text-lg font-semibold text-foreground" data-testid="text-iss-visibility">{issData.visibility}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-white/5 p-3" data-testid="card-iss-position">
            <Navigation className="h-4 w-4 text-indigo-400" />
            <div>
              <p className="text-xs text-muted-foreground">Position</p>
              <p className="text-xs font-medium" data-testid="text-iss-position">
                {issData.latitude.toFixed(2)}°, {issData.longitude.toFixed(2)}°
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/5 p-3" data-testid="card-iss-velocity">
            <Gauge className="h-4 w-4 text-cyan-400" />
            <div>
              <p className="text-xs text-muted-foreground">Velocity</p>
              <p className="text-sm font-medium" data-testid="text-iss-velocity">{Math.round(issData.velocity)} km/h</p>
            </div>
          </div>
        </div>
        
        {issData.nextPass && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-indigo-500/20 p-3">
            <Clock className="h-4 w-4 text-purple-400" />
            <div>
              <p className="text-xs text-muted-foreground">Next Visible Pass</p>
              <p className="text-sm font-medium">{issData.nextPass}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
