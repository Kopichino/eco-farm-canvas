import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, ChevronRight } from 'lucide-react';

interface CalendarProps {
  currentDay: number;
  onNextDay: () => void;
}

export function Calendar({ currentDay, onNextDay }: CalendarProps) {
  const season = currentDay <= 30 ? 'Spring' : 
                 currentDay <= 60 ? 'Summer' :
                 currentDay <= 90 ? 'Fall' : 'Winter';
  
  return (
    <Card className="bg-gradient-sunset">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Day {currentDay}
          </span>
          <span className="text-sm font-normal opacity-80">{season}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={onNextDay}
          className="w-full"
          variant="default"
        >
          <ChevronRight className="h-4 w-4 mr-1" />
          Next Day
        </Button>
      </CardContent>
    </Card>
  );
}