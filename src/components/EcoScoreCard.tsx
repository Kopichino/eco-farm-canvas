import React from 'react';
import { EcoScore } from '@/types/farm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Droplets, Sprout, Cloud } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface EcoScoreCardProps {
  ecoScore: EcoScore;
}

export function EcoScoreCard({ ecoScore }: EcoScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-primary';
    if (score >= 60) return 'text-sun';
    if (score >= 40) return 'text-crop-wheat';
    return 'text-destructive';
  };
  
  return (
    <Card className="bg-gradient-grass text-primary-foreground">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Leaf className="h-5 w-5" />
          Eco Score: <span className={`text-2xl font-bold ${getScoreColor(ecoScore.overall)}`}>
            {Math.round(ecoScore.overall)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Sprout className="h-3 w-3" />
              Soil Health
            </span>
            <span>{Math.round(ecoScore.soilHealth)}%</span>
          </div>
          <Progress value={ecoScore.soilHealth} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Droplets className="h-3 w-3" />
              Water Efficiency
            </span>
            <span>{Math.round(ecoScore.waterUsage)}%</span>
          </div>
          <Progress value={ecoScore.waterUsage} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Leaf className="h-3 w-3" />
              Crop Yield
            </span>
            <span>{Math.round(ecoScore.cropYield)}%</span>
          </div>
          <Progress value={ecoScore.cropYield} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Cloud className="h-3 w-3" />
              Carbon Impact
            </span>
            <span>{Math.round(ecoScore.carbonFootprint)}%</span>
          </div>
          <Progress value={ecoScore.carbonFootprint} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}