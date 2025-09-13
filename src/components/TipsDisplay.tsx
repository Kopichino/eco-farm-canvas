import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface TipsDisplayProps {
  tips: string[];
}

export function TipsDisplay({ tips }: TipsDisplayProps) {
  const recentTips = tips.slice(-3).reverse();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-sun" />
          Sustainability Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recentTips.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Tips will appear as you play!
            </p>
          ) : (
            recentTips.map((tip, idx) => (
              <div 
                key={idx} 
                className="text-sm p-2 bg-secondary/50 rounded-lg animate-grow"
              >
                {tip}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}