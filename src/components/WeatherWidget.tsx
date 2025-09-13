import React from 'react';
import { Weather } from '@/types/farm';
import { WEATHER_ICONS } from '@/utils/weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Droplets, Wind } from 'lucide-react';

interface WeatherWidgetProps {
  weather: Weather;
}

export function WeatherWidget({ weather }: WeatherWidgetProps) {
  return (
    <Card className="bg-gradient-sky text-primary-foreground">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-2xl">{WEATHER_ICONS[weather.condition]}</span>
          Day {weather.day} Weather
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Thermometer className="h-4 w-4" />
          <span className="text-sm font-medium">
            {weather.temperature}°C
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4" />
          <span className="text-sm font-medium">
            {weather.humidity}% Humidity
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Wind className="h-4 w-4" />
          <span className="text-sm font-medium">
            {weather.rainfall}mm Rain
          </span>
        </div>
        
        <div className="pt-2 border-t border-primary-foreground/20">
          <p className="text-xs opacity-90">
            {weather.condition === 'sunny' && 'Perfect for planting!'}
            {weather.condition === 'rainy' && 'Natural irrigation day'}
            {weather.condition === 'cloudy' && 'Mild conditions'}
            {weather.condition === 'stormy' && 'Heavy rain warning'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}