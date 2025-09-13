import React from 'react';
import { CropType } from '@/types/farm';
import { CROP_DATA } from '@/data/crops';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wheat, Droplets, Thermometer, Timer } from 'lucide-react';

interface CropSelectorProps {
  selectedCrop: CropType | null;
  onCropSelect: (crop: CropType | null) => void;
}

const CROP_EMOJIS = {
  corn: '🌽',
  wheat: '🌾',
  rice: '🌾',
  coconut: '🥥'
};

export function CropSelector({ selectedCrop, onCropSelect }: CropSelectorProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wheat className="h-5 w-5" />
          Crop Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.values(CROP_DATA).map((crop) => (
          <Button
            key={crop.type}
            variant={selectedCrop === crop.type ? 'default' : 'outline'}
            className="w-full justify-start text-left"
            onClick={() => onCropSelect(selectedCrop === crop.type ? null : crop.type)}
          >
            <div className="flex flex-col gap-1 w-full">
              <div className="flex items-center gap-2 font-semibold">
                <span className="text-xl">{CROP_EMOJIS[crop.type]}</span>
                {crop.name}
              </div>
              <div className="flex gap-3 text-xs opacity-70">
                <span className="flex items-center gap-1">
                  <Timer className="h-3 w-3" />
                  {crop.growthDays}d
                </span>
                <span className="flex items-center gap-1">
                  <Droplets className="h-3 w-3" />
                  {crop.waterNeeds}/5
                </span>
                <span className="flex items-center gap-1">
                  <Thermometer className="h-3 w-3" />
                  {crop.optimalTemp.min}-{crop.optimalTemp.max}°C
                </span>
              </div>
            </div>
          </Button>
        ))}
        
        <div className="pt-3 border-t">
          <p className="text-xs text-muted-foreground">
            Click on a farm plot to plant the selected crop
          </p>
        </div>
      </CardContent>
    </Card>
  );
}