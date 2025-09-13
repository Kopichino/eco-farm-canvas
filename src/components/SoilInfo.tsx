import React from 'react';
import { SoilType } from '@/types/farm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mountain } from 'lucide-react';

interface SoilInfoProps {
  recommendedSoil: SoilType;
}

const SOIL_INFO = {
  clay: {
    name: 'Clay Soil',
    description: 'High water retention, good for rice',
    color: 'bg-soil-dark'
  },
  loam: {
    name: 'Loam Soil',
    description: 'Balanced nutrients, ideal for most crops',
    color: 'bg-soil-medium'
  },
  sandy: {
    name: 'Sandy Soil',
    description: 'Good drainage, perfect for coconuts',
    color: 'bg-soil-light'
  },
  silt: {
    name: 'Silt Soil',
    description: 'Fertile and moisture-retentive',
    color: 'bg-soil-medium'
  }
};

export function SoilInfo({ recommendedSoil }: SoilInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Mountain className="h-5 w-5" />
          Soil Recommendation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg ${SOIL_INFO[recommendedSoil].color}`} />
            <div>
              <p className="font-semibold">{SOIL_INFO[recommendedSoil].name}</p>
              <p className="text-xs text-muted-foreground">
                {SOIL_INFO[recommendedSoil].description}
              </p>
            </div>
          </div>
          
          <div className="text-xs space-y-1 pt-2 border-t">
            <p className="font-medium">All Soil Types:</p>
            {Object.entries(SOIL_INFO).map(([type, info]) => (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${info.color}`} />
                <span>{info.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}