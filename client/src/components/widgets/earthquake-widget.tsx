import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Activity, MapPin } from "lucide-react";
import type { Earthquake } from "@shared/schema";

export function EarthquakeWidget() {
  const { data: earthquakes, isLoading, error } = useQuery<Earthquake[]>({
    queryKey: ["/api/local/earthquakes"],
    refetchInterval: 300000,
  });

  if (isLoading) {
    return (
      <Card className="border-white/10 bg-white/5 backdrop-blur-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !earthquakes) {
    return (
      <Card className="border-white/10 bg-white/5 backdrop-blur-lg">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <Activity className="mb-2 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Enable location to see nearby earthquakes
          </p>
        </CardContent>
      </Card>
    );
  }

  const getMagnitudeColor = (mag: number) => {
    if (mag >= 6) return "bg-red-500 text-white";
    if (mag >= 5) return "bg-orange-500 text-white";
    if (mag >= 4) return "bg-amber-500 text-white";
    return "bg-green-500 text-white";
  };

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-lg" data-testid="widget-earthquakes">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-red-500">
            <Activity className="h-4 w-4 text-white" />
          </div>
          Nearby Earthquakes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {earthquakes.length === 0 ? (
          <p className="text-sm text-muted-foreground" data-testid="text-no-earthquakes">No recent earthquakes nearby</p>
        ) : (
          earthquakes.slice(0, 3).map((quake) => (
            <div
              key={quake.id}
              className="flex items-center justify-between rounded-lg bg-white/5 p-3"
              data-testid={`card-earthquake-${quake.id}`}
            >
              <div className="flex items-center gap-3">
                <Badge
                  className={`${getMagnitudeColor(quake.magnitude)} font-bold`}
                  data-testid={`badge-magnitude-${quake.id}`}
                >
                  M{quake.magnitude.toFixed(1)}
                </Badge>
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-foreground line-clamp-1" data-testid={`text-quake-place-${quake.id}`}>
                    {quake.place}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span data-testid={`text-quake-distance-${quake.id}`}>{Math.round(quake.distance)} km away</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
