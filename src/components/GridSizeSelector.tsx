import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid, PlayCircle } from 'lucide-react';

interface GridSizeSelectorProps {
  onStart: (size: number) => void;
}

export function GridSizeSelector({ onStart }: GridSizeSelectorProps) {
  const [selectedSize, setSelectedSize] = React.useState(5);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/20 via-background to-muted/30">
      <Card className="w-full max-w-md shadow-card-soft">
        <CardHeader>
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-3">
            <span className="text-4xl">🌾</span>
            EcoFarm Simulator
            <span className="text-4xl">🌱</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              Learn sustainable farming practices through interactive simulation!
            </p>
            <p className="text-sm text-primary font-medium">
              Plant crops • Manage irrigation • Track eco-score
            </p>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="grid-size" className="flex items-center gap-2">
              <Grid className="h-4 w-4" />
              Select Farm Grid Size
            </Label>
            <Select 
              value={selectedSize.toString()} 
              onValueChange={(v) => setSelectedSize(parseInt(v))}
            >
              <SelectTrigger id="grid-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3×3 (Small Farm)</SelectItem>
                <SelectItem value="4">4×4 (Medium Farm)</SelectItem>
                <SelectItem value="5">5×5 (Standard Farm)</SelectItem>
                <SelectItem value="6">6×6 (Large Farm)</SelectItem>
                <SelectItem value="8">8×8 (Extra Large Farm)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {selectedSize * selectedSize} plots total
            </p>
          </div>
          
          <Button 
            onClick={() => onStart(selectedSize)} 
            className="w-full"
            size="lg"
          >
            <PlayCircle className="h-5 w-5 mr-2" />
            Start Farming
          </Button>
          
          <div className="pt-4 border-t space-y-2">
            <p className="text-xs text-center text-muted-foreground">
              🌍 Learn about water conservation
            </p>
            <p className="text-xs text-center text-muted-foreground">
              📊 Track your environmental impact
            </p>
            <p className="text-xs text-center text-muted-foreground">
              🌱 Discover sustainable farming techniques
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}