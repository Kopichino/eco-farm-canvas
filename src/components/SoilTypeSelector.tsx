import React from 'react';
import { SoilType } from '@/types/farm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mountain } from 'lucide-react';

interface SoilTypeSelectorProps {
  selectedSoilType: SoilType | null;
  onSoilTypeSelect: (soilType: SoilType | null) => void;
}

const SOIL_TYPES = {
  clay: { name: 'Clay', color: 'bg-soil-dark', bestFor: 'Rice, Wheat' },
  loam: { name: 'Loam', color: 'bg-soil-medium', bestFor: 'Corn, Wheat' },
  sandy: { name: 'Sandy', color: 'bg-soil-light', bestFor: 'Coconut' },
  silt: { name: 'Silt', color: 'bg-soil-medium', bestFor: 'Corn, Rice' }
};

export function SoilTypeSelector({ selectedSoilType, onSoilTypeSelect }: SoilTypeSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Mountain className="h-5 w-5" />
          Change Soil Type
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {Object.entries(SOIL_TYPES).map(([type, info]) => (
          <Button
            key={type}
            onClick={() => onSoilTypeSelect(selectedSoilType === type ? null : type as SoilType)}
            variant={selectedSoilType === type ? 'default' : 'outline'}
            className="w-full justify-start"
          >
            <div className={`w-4 h-4 rounded mr-2 ${info.color}`} />
            <div className="text-left">
              <div>{info.name}</div>
              <div className="text-xs opacity-70">Best for: {info.bestFor}</div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}