import { useState, useCallback, useEffect } from 'react';
import { GameState, Plot, CropType, IrrigationType, SoilType } from '@/types/farm';
import { generateWeather } from '@/utils/weather';
import { CROP_DATA, IRRIGATION_WATER_AMOUNT, IRRIGATION_CARBON_FOOTPRINT } from '@/data/crops';
import { SUSTAINABILITY_TIPS, getRandomDailyTip } from '@/utils/tips';
import { toast } from 'sonner';

const INITIAL_ECO_SCORE = {
  soilHealth: 75,
  waterUsage: 100,
  cropYield: 0,
  carbonFootprint: 100,
  overall: 68.75
};

export function useFarmGame(gridSize: number) {
  const [gameState, setGameState] = useState<GameState>(() => {
    const plots: Plot[][] = [];
    const soilTypes: SoilType[] = ['clay', 'loam', 'sandy', 'silt'];
    
    for (let y = 0; y < gridSize; y++) {
      const row: Plot[] = [];
      for (let x = 0; x < gridSize; x++) {
        row.push({
          id: `${x}-${y}`,
          x,
          y,
          crop: null,
          plantedDay: null,
          growthStage: 0,
          waterLevel: 50,
          soilType: soilTypes[Math.floor(Math.random() * soilTypes.length)],
          health: 100,
          harvestReady: false
        });
      }
      plots.push(row);
    }
    
    return {
      gridSize,
      plots,
      currentDay: 1,
      weather: generateWeather(1),
      scheduledIrrigations: [],
      ecoScore: INITIAL_ECO_SCORE,
      totalWaterUsed: 0,
      totalCropsHarvested: 0,
      tips: [getRandomDailyTip()]
    };
  });
  
  const addTip = useCallback((trigger: string) => {
    const tip = SUSTAINABILITY_TIPS.find(t => t.trigger === trigger);
    if (tip) {
      setGameState(prev => ({
        ...prev,
        tips: [...prev.tips, tip.message]
      }));
      toast(tip.message);
    }
  }, []);
  
  const calculateEcoScore = useCallback((state: GameState) => {
    let soilHealth = 0;
    let totalPlots = 0;
    
    state.plots.forEach(row => {
      row.forEach(plot => {
        soilHealth += plot.health;
        totalPlots++;
      });
    });
    
    soilHealth = soilHealth / totalPlots;
    
    const waterEfficiency = Math.max(0, 100 - (state.totalWaterUsed / (state.currentDay * 50)));
    const yieldScore = Math.min(100, (state.totalCropsHarvested * 20));
    const carbonScore = Math.max(0, 100 - (state.totalWaterUsed * 0.01));
    
    return {
      soilHealth,
      waterUsage: waterEfficiency,
      cropYield: yieldScore,
      carbonFootprint: carbonScore,
      overall: (soilHealth + waterEfficiency + yieldScore + carbonScore) / 4
    };
  }, []);
  
  const plantCrop = useCallback((x: number, y: number, cropType: CropType | null) => {
    if (!cropType) return;
    
    setGameState(prev => {
      const newPlots = [...prev.plots];
      const plot = newPlots[y][x];
      
      if (plot.crop) {
        toast.error('This plot already has a crop!');
        return prev;
      }
      
      plot.crop = cropType;
      plot.plantedDay = prev.currentDay;
      plot.growthStage = 0;
      plot.harvestReady = false;
      
      const newState = { ...prev, plots: newPlots };
      return newState;
    });
    
    addTip(`plant_${cropType}`);
  }, [addTip]);
  
  const harvestCrop = useCallback((x: number, y: number) => {
    setGameState(prev => {
      const newPlots = [...prev.plots];
      const plot = newPlots[y][x];
      
      if (!plot.harvestReady) {
        toast.error('This crop is not ready for harvest!');
        return prev;
      }
      
      const cropData = CROP_DATA[plot.crop!];
      const newCropsHarvested = prev.totalCropsHarvested + cropData.yieldPerPlot;
      
      plot.crop = null;
      plot.plantedDay = null;
      plot.growthStage = 0;
      plot.harvestReady = false;
      plot.health = Math.max(20, plot.health - 10); // Soil depletes after harvest
      
      toast.success(`Harvested ${cropData.yieldPerPlot} ${cropData.name}!`);
      
      const newState = {
        ...prev,
        plots: newPlots,
        totalCropsHarvested: newCropsHarvested
      };
      
      newState.ecoScore = calculateEcoScore(newState);
      return newState;
    });
    
    addTip('harvest_ready');
  }, [addTip, calculateEcoScore]);
  
  const handlePlotClick = useCallback((x: number, y: number, selectedCrop: CropType | null) => {
    const plot = gameState.plots[y][x];
    
    if (plot.harvestReady) {
      harvestCrop(x, y);
    } else if (selectedCrop && !plot.crop) {
      plantCrop(x, y, selectedCrop);
    }
  }, [gameState.plots, harvestCrop, plantCrop]);
  
  const scheduleIrrigation = useCallback((day: number, type: IrrigationType) => {
    setGameState(prev => ({
      ...prev,
      scheduledIrrigations: [
        ...prev.scheduledIrrigations,
        {
          day,
          type,
          plotIds: prev.plots.flat().map(p => p.id)
        }
      ]
    }));
    
    toast.success(`Scheduled ${type} irrigation for day ${day}`);
    addTip(`irrigation_${type}`);
  }, [addTip]);
  
  const processDay = useCallback(() => {
    setGameState(prev => {
      const newDay = prev.currentDay + 1;
      const newWeather = generateWeather(newDay);
      let newPlots = [...prev.plots];
      let waterUsed = 0;
      
      // Process scheduled irrigations
      const todaysIrrigations = prev.scheduledIrrigations.filter(s => s.day === newDay);
      todaysIrrigations.forEach(irrigation => {
        const waterAmount = IRRIGATION_WATER_AMOUNT[irrigation.type];
        waterUsed += waterAmount * prev.gridSize * prev.gridSize;
        
        newPlots.forEach(row => {
          row.forEach(plot => {
            plot.waterLevel = Math.min(100, plot.waterLevel + waterAmount);
          });
        });
      });
      
      // Add rainfall
      newPlots.forEach(row => {
        row.forEach(plot => {
          plot.waterLevel = Math.min(100, plot.waterLevel + newWeather.rainfall);
        });
      });
      
      // Process crop growth
      newPlots.forEach(row => {
        row.forEach(plot => {
          if (plot.crop && plot.plantedDay !== null) {
            const cropData = CROP_DATA[plot.crop];
            
            // Check growing conditions
            const tempOk = newWeather.temperature >= cropData.optimalTemp.min && 
                          newWeather.temperature <= cropData.optimalTemp.max;
            const humidityOk = newWeather.humidity >= cropData.optimalHumidity.min && 
                              newWeather.humidity <= cropData.optimalHumidity.max;
            const waterOk = plot.waterLevel >= cropData.waterNeeds * 15;
            const soilOk = cropData.preferredSoil.includes(plot.soilType);
            
            // Calculate growth rate
            let growthRate = 1;
            if (!tempOk) growthRate *= 0.5;
            if (!humidityOk) growthRate *= 0.7;
            if (!waterOk) growthRate *= 0.3;
            if (!soilOk) growthRate *= 0.8;
            
            plot.growthStage = Math.min(
              cropData.growthDays,
              plot.growthStage + growthRate
            );
            
            // Check if ready to harvest
            if (plot.growthStage >= cropData.growthDays) {
              plot.harvestReady = true;
            }
            
            // Update plot health
            if (!waterOk) {
              plot.health = Math.max(0, plot.health - 5);
            } else {
              plot.health = Math.min(100, plot.health + 1);
            }
            
            // Consume water
            plot.waterLevel = Math.max(0, plot.waterLevel - cropData.waterNeeds * 5);
          }
        });
      });
      
      const newState = {
        ...prev,
        currentDay: newDay,
        weather: newWeather,
        plots: newPlots,
        totalWaterUsed: prev.totalWaterUsed + waterUsed,
        scheduledIrrigations: prev.scheduledIrrigations.filter(s => s.day > newDay),
        tips: [...prev.tips, getRandomDailyTip()]
      };
      
      newState.ecoScore = calculateEcoScore(newState);
      
      // Check for low soil health
      const avgHealth = newPlots.flat().reduce((sum, p) => sum + p.health, 0) / (prev.gridSize * prev.gridSize);
      if (avgHealth < 50) {
        addTip('low_soil_health');
      }
      
      return newState;
    });
  }, [calculateEcoScore, addTip]);
  
  return {
    gameState,
    plantCrop,
    harvestCrop,
    handlePlotClick,
    scheduleIrrigation,
    processDay
  };
}