import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { guildConfigSchema, type GuildConfig, type InsertGuildConfig } from "@shared/schema";
import {
  Activity,
  Cloud,
  Rocket,
  Sparkles,
  Palette,
  Image,
  Clock,
  Save,
  Loader2,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

interface GuildSettingsFormProps {
  guildId: string;
  onConfigChange?: (config: Partial<GuildConfig>) => void;
}

export function GuildSettingsForm({ guildId, onConfigChange }: GuildSettingsFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: config, isLoading } = useQuery<GuildConfig>({
    queryKey: ["/api/guild", guildId, "config"],
  });

  const form = useForm<InsertGuildConfig>({
    resolver: zodResolver(guildConfigSchema.omit({ guildId: true })),
    defaultValues: {
      earthquakeFeedEnabled: true,
      weatherFeedEnabled: true,
      issFeedEnabled: false,
      auroraFeedEnabled: false,
      intervalMinutes: 15,
      primaryColor: "#00AEEF",
      iconUrl: "",
      bannerUrl: "",
    },
  });

  useEffect(() => {
    if (config) {
      form.reset({
        earthquakeFeedEnabled: config.earthquakeFeedEnabled,
        weatherFeedEnabled: config.weatherFeedEnabled,
        issFeedEnabled: config.issFeedEnabled,
        auroraFeedEnabled: config.auroraFeedEnabled,
        intervalMinutes: config.intervalMinutes,
        primaryColor: config.primaryColor,
        iconUrl: config.iconUrl,
        bannerUrl: config.bannerUrl,
      });
    }
  }, [config, form]);

  const watchedValues = form.watch();
  useEffect(() => {
    onConfigChange?.({
      guildId,
      ...watchedValues,
    });
  }, [watchedValues, guildId, onConfigChange]);

  const saveMutation = useMutation({
    mutationFn: async (data: InsertGuildConfig) => {
      const response = await apiRequest("POST", `/api/guild/${guildId}/save`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings Saved",
        description: "Your guild configuration has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/guild", guildId, "config"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertGuildConfig) => {
    saveMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-white/10 bg-white/5 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <Activity className="h-5 w-5 text-primary" />
              Feed Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="earthquakeFeedEnabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-red-500">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <FormLabel className="text-base font-medium">Earthquake Feed</FormLabel>
                      <FormDescription>Receive alerts for nearby seismic activity</FormDescription>
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="switch-earthquake-feed"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weatherFeedEnabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-500">
                      <Cloud className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <FormLabel className="text-base font-medium">Weather Feed</FormLabel>
                      <FormDescription>Get weather updates for your location</FormDescription>
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="switch-weather-feed"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issFeedEnabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-400 to-indigo-500">
                      <Rocket className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <FormLabel className="text-base font-medium">ISS Tracker</FormLabel>
                      <FormDescription>Track the International Space Station</FormDescription>
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="switch-iss-feed"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="auroraFeedEnabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-teal-500">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <FormLabel className="text-base font-medium">Aurora Alerts</FormLabel>
                      <FormDescription>Northern/Southern lights visibility forecasts</FormDescription>
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="switch-aurora-feed"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="intervalMinutes"
              render={({ field }) => (
                <FormItem className="rounded-lg bg-white/5 p-4">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <FormLabel className="text-base font-medium">Update Interval</FormLabel>
                      <FormDescription>How often to send feed updates</FormDescription>
                    </div>
                    <span className="rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary">
                      {field.value} min
                    </span>
                  </div>
                  <FormControl>
                    <Slider
                      min={5}
                      max={60}
                      step={5}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="w-full"
                      data-testid="slider-interval"
                    />
                  </FormControl>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>5 min</span>
                    <span>60 min</span>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <Palette className="h-5 w-5 text-accent" />
              Embed Customization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="primaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Color</FormLabel>
                  <FormControl>
                    <div className="flex gap-3">
                      <div
                        className="h-10 w-10 rounded-lg border border-white/20"
                        style={{ backgroundColor: field.value }}
                      />
                      <Input
                        type="color"
                        {...field}
                        className="h-10 w-20 cursor-pointer p-1"
                        data-testid="input-primary-color"
                      />
                      <Input
                        type="text"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="#00AEEF"
                        className="flex-1 bg-white/5"
                        data-testid="input-primary-color-text"
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="iconUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Icon URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://example.com/icon.png"
                      className="bg-white/5"
                      data-testid="input-icon-url"
                    />
                  </FormControl>
                  <FormDescription>Custom icon for embed messages</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bannerUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Banner URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://example.com/banner.png"
                      className="bg-white/5"
                      data-testid="input-banner-url"
                    />
                  </FormControl>
                  <FormDescription>Custom banner image for embeds</FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button
          type="submit"
          disabled={saveMutation.isPending}
          className="w-full gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 py-6 text-base font-medium shadow-lg transition-all hover:from-indigo-600 hover:to-purple-600 hover:shadow-xl"
          data-testid="button-save-settings"
        >
          {saveMutation.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          Save Settings
        </Button>
      </form>
    </Form>
  );
}
