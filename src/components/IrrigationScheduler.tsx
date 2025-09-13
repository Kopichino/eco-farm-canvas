import React, { useState } from 'react';
import { IrrigationType, ScheduledIrrigation } from '@/types/farm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Droplets, Calendar } from 'lucide-react';
import { IRRIGATION_WATER_AMOUNT, IRRIGATION_CARBON_FOOTPRINT } from '@/data/crops';

interface IrrigationSchedulerProps {
  currentDay: number;
  onSchedule: (day: number, type: IrrigationType) => void;
  scheduledIrrigations: ScheduledIrrigation[];
}

export function IrrigationScheduler({ currentDay, onSchedule, scheduledIrrigations }: IrrigationSchedulerProps) {
  const [selectedType, setSelectedType] = useState<IrrigationType>('drip');
  const [selectedDay, setSelectedDay] = useState(currentDay + 1);
  
  const handleSchedule = () => {
    if (selectedDay > currentDay) {
      onSchedule(selectedDay, selectedType);
      setSelectedDay(currentDay + 1);
    }
  };
  
  const upcomingIrrigations = scheduledIrrigations
    .filter(s => s.day > currentDay)
    .sort((a, b) => a.day - b.day)
    .slice(0, 3);
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5" />
          Irrigation System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <Label htmlFor="irrigation-type">Irrigation Method</Label>
            <Select value={selectedType} onValueChange={(v) => setSelectedType(v as IrrigationType)}>
              <SelectTrigger id="irrigation-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="drip">
                  <div className="flex flex-col">
                    <span>💧 Drip Irrigation</span>
                    <span className="text-xs text-muted-foreground">
                      Water: {IRRIGATION_WATER_AMOUNT.drip}L, CO₂: {IRRIGATION_CARBON_FOOTPRINT.drip}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="rainwater">
                  <div className="flex flex-col">
                    <span>🌧️ Rainwater Harvesting</span>
                    <span className="text-xs text-muted-foreground">
                      Water: {IRRIGATION_WATER_AMOUNT.rainwater}L, CO₂: {IRRIGATION_CARBON_FOOTPRINT.rainwater}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="flood">
                  <div className="flex flex-col">
                    <span>💦 Flood Irrigation</span>
                    <span className="text-xs text-muted-foreground">
                      Water: {IRRIGATION_WATER_AMOUNT.flood}L, CO₂: {IRRIGATION_CARBON_FOOTPRINT.flood}
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="irrigation-day">Schedule for Day</Label>
            <Input
              id="irrigation-day"
              type="number"
              min={currentDay + 1}
              value={selectedDay}
              onChange={(e) => setSelectedDay(parseInt(e.target.value))}
            />
          </div>
          
          <Button onClick={handleSchedule} className="w-full">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Irrigation
          </Button>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold mb-2">Upcoming Irrigations</h4>
          {upcomingIrrigations.length === 0 ? (
            <p className="text-xs text-muted-foreground">No irrigations scheduled</p>
          ) : (
            <div className="space-y-2">
              {upcomingIrrigations.map((irrigation, idx) => (
                <div key={idx} className="text-xs bg-muted p-2 rounded">
                  <span className="font-medium">Day {irrigation.day}:</span> {irrigation.type}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}