import React, { useState } from 'react';
import { TreatmentType, ScheduledTreatment } from '@/types/farm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Bug, Leaf, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TreatmentSchedulerProps {
  currentDay: number;
  onSchedule: (day: number, type: TreatmentType) => void;
  scheduledTreatments: ScheduledTreatment[];
}

const TREATMENT_INFO = {
  pesticide: {
    name: 'Pesticide',
    icon: Bug,
    description: 'Protects crops from pest damage',
    color: 'bg-destructive/20 text-destructive'
  },
  fertilizer: {
    name: 'Fertilizer',
    icon: Leaf,
    description: 'Boosts crop growth and soil health',
    color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
  }
};

export function TreatmentScheduler({ currentDay, onSchedule, scheduledTreatments }: TreatmentSchedulerProps) {
  const [selectedDay, setSelectedDay] = useState(currentDay + 1);
  const [selectedType, setSelectedType] = useState<TreatmentType>('pesticide');
  
  const handleSchedule = () => {
    onSchedule(selectedDay, selectedType);
    setSelectedDay(currentDay + 1);
  };
  
  const upcomingTreatments = scheduledTreatments
    .filter(s => s.day > currentDay)
    .sort((a, b) => a.day - b.day)
    .slice(0, 3);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5" />
          Treatment Scheduler
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <Label>Treatment Type</Label>
            <Select value={selectedType} onValueChange={(v) => setSelectedType(v as TreatmentType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TREATMENT_INFO).map(([type, info]) => (
                  <SelectItem key={type} value={type}>
                    <div className="flex items-center gap-2">
                      <info.icon className="h-4 w-4" />
                      <span>{info.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {TREATMENT_INFO[selectedType].description}
            </p>
          </div>
          
          <div>
            <Label>Schedule for Day</Label>
            <Select value={selectedDay.toString()} onValueChange={(v) => setSelectedDay(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[...Array(7)].map((_, i) => {
                  const day = currentDay + i + 1;
                  return (
                    <SelectItem key={day} value={day.toString()}>
                      Day {day}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleSchedule} 
            className="w-full"
            variant="default"
          >
            Schedule Treatment
          </Button>
        </div>
        
        {upcomingTreatments.length > 0 && (
          <div className="pt-3 border-t">
            <p className="text-sm font-medium mb-2">Upcoming Treatments</p>
            <div className="space-y-1">
              {upcomingTreatments.map((treatment, index) => {
                const info = TREATMENT_INFO[treatment.type];
                const Icon = info.icon;
                return (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span>Day {treatment.day}</span>
                    <Badge variant="outline" className={info.color}>
                      <Icon className="h-3 w-3 mr-1" />
                      {info.name}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}