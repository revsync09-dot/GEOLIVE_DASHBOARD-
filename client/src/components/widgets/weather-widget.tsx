import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Cloud, Droplets, Wind, Thermometer } from "lucide-react";
import type { WeatherData } from "@shared/schema";

export function WeatherWidget() {
  const { data: weather, isLoading, error } = useQuery<WeatherData>({
    queryKey: ["/api/local/weather"],
    refetchInterval: 300000,
  });

  if (isLoading) {
    return (
      <Card className="border-white/10 bg-white/5 backdrop-blur-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className="border-white/10 bg-white/5 backdrop-blur-lg">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <Cloud className="mb-2 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Enable location to see weather
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-lg" data-testid="widget-weather">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 shadow-lg">
            {weather.icon ? (
              <img
                src={weather.icon}
                alt={weather.condition}
                className="h-10 w-10"
                data-testid="img-weather-icon"
              />
            ) : (
              <Cloud className="h-8 w-8 text-white" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground" data-testid="text-weather-location">{weather.location}</p>
            <p className="text-3xl font-bold text-foreground" data-testid="text-weather-temp">{weather.temperature}°C</p>
            <p className="text-sm text-muted-foreground" data-testid="text-weather-condition">{weather.condition}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-white/5 p-2">
            <Thermometer className="h-4 w-4 text-orange-400" />
            <div>
              <p className="text-xs text-muted-foreground">Feels</p>
              <p className="text-sm font-medium">{weather.feelsLike}°C</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/5 p-2">
            <Droplets className="h-4 w-4 text-blue-400" />
            <div>
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="text-sm font-medium">{weather.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/5 p-2">
            <Wind className="h-4 w-4 text-teal-400" />
            <div>
              <p className="text-xs text-muted-foreground">Wind</p>
              <p className="text-sm font-medium">{weather.windSpeed} km/h</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
