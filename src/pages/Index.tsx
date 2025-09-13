import React, { useState } from 'react';
import { GridSizeSelector } from '@/components/GridSizeSelector';
import { FarmCanvas } from '@/components/FarmCanvas';
import { WeatherWidget } from '@/components/WeatherWidget';
import { EcoScoreCard } from '@/components/EcoScoreCard';
import { CropSelector } from '@/components/CropSelector';
import { IrrigationScheduler } from '@/components/IrrigationScheduler';
import { SoilInfo } from '@/components/SoilInfo';
import { Calendar } from '@/components/Calendar';
import { TipsDisplay } from '@/components/TipsDisplay';
import { useFarmGame } from '@/hooks/useFarmGame';
import { CropType, SoilType } from '@/types/farm';

const Index = () => {
  const [gridSize, setGridSize] = useState<number | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<CropType | null>(null);
  const game = gridSize ? useFarmGame(gridSize) : null;
  
  if (!gridSize || !game) {
    return <GridSizeSelector onStart={setGridSize} />;
  }
  
  const { gameState, handlePlotClick, scheduleIrrigation, processDay } = game;
  
  // Get recommended soil for the day
  const soilTypes: SoilType[] = ['clay', 'loam', 'sandy', 'silt'];
  const recommendedSoil = soilTypes[gameState.currentDay % 4];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 via-background to-muted/20">
      {/* Top Bar */}
      <header className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <span className="text-2xl">🌾</span>
                EcoFarm Simulator
              </h1>
              <Calendar 
                currentDay={gameState.currentDay}
                onNextDay={processDay}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-muted-foreground">Total Harvest:</span>
                <span className="ml-2 font-semibold">{gameState.totalCropsHarvested} units</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Water Used:</span>
                <span className="ml-2 font-semibold">{gameState.totalWaterUsed}L</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <aside className="col-span-3 space-y-4">
            <CropSelector 
              selectedCrop={selectedCrop}
              onCropSelect={setSelectedCrop}
            />
            <IrrigationScheduler
              currentDay={gameState.currentDay}
              onSchedule={scheduleIrrigation}
              scheduledIrrigations={gameState.scheduledIrrigations}
            />
          </aside>
          
          {/* Center - Canvas */}
          <main className="col-span-6 flex items-center justify-center">
            <FarmCanvas
              plots={gameState.plots}
              onPlotClick={(x, y) => handlePlotClick(x, y, selectedCrop)}
              selectedCrop={selectedCrop}
            />
          </main>
          
          {/* Right Sidebar */}
          <aside className="col-span-3 space-y-4">
            <EcoScoreCard ecoScore={gameState.ecoScore} />
            <WeatherWidget weather={gameState.weather} />
            <SoilInfo recommendedSoil={recommendedSoil} />
            <TipsDisplay tips={gameState.tips} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Index;