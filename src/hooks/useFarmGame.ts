import { useState, useCallback, useEffect } from 'react';
import { GameState, Plot, CropType, IrrigationType, SoilType, TreatmentType } from '@/types/farm';
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
          harvestReady: false,
          hasProtection: false,
          fertilized: false,
          pestDamage: 0
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
      scheduledTreatments: [],
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
  
  const scheduleTreatment = useCallback((day: number, type: TreatmentType) => {
    setGameState(prev => ({
      ...prev,
      scheduledTreatments: [
        ...prev.scheduledTreatments,
        {
          day,
          type,
          plotIds: prev.plots.flat().map(p => p.id)
        }
      ]
    }));
    
    toast.success(`Scheduled ${type} treatment for day ${day}`);
    if (type === 'pesticide') {
      addTip('pesticide_scheduled');
    } else {
      addTip('fertilizer_scheduled');
    }
  }, [addTip]);
  
  const changePlotSoilType = useCallback((x: number, y: number, soilType: SoilType) => {
    setGameState(prev => {
      const newPlots = [...prev.plots];
      newPlots[y][x].soilType = soilType;
      
      toast.success(`Changed soil type to ${soilType}`);
      return { ...prev, plots: newPlots };
    });
  }, []);
  
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
      
      // Process scheduled treatments
      const todaysTreatments = prev.scheduledTreatments.filter(s => s.day === newDay);
      todaysTreatments.forEach(treatment => {
        newPlots.forEach(row => {
          row.forEach(plot => {
            if (treatment.type === 'pesticide') {
              plot.hasProtection = true;
              plot.pestDamage = Math.max(0, plot.pestDamage - 30);
            } else if (treatment.type === 'fertilizer') {
              plot.fertilized = true;
              plot.health = Math.min(100, plot.health + 20);
            }
          });
        });
      });
      
      // Random pest attacks (30% chance if not protected)
      const pestAttackChance = Math.random();
      if (pestAttackChance < 0.3) {
        newPlots.forEach(row => {
          row.forEach(plot => {
            if (plot.crop && !plot.hasProtection && Math.random() < 0.5) {
              plot.pestDamage = Math.min(100, plot.pestDamage + 25);
              plot.health = Math.max(0, plot.health - 15);
            }
          });
        });
        toast.warning('Pest attack detected! Crops without protection are damaged.');
      }
      
      // Reduce protection over time
      newPlots.forEach(row => {
        row.forEach(plot => {
          if (plot.hasProtection && Math.random() < 0.3) {
            plot.hasProtection = false;
          }
          if (plot.fertilized && Math.random() < 0.2) {
            plot.fertilized = false;
          }
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
            
            // Calculate growth rate with bonuses/penalties
            let growthRate = 1;
            if (!tempOk) growthRate *= 0.5;
            if (!humidityOk) growthRate *= 0.7;
            if (!waterOk) growthRate *= 0.3;
            if (!soilOk) growthRate *= 0.8;
            if (plot.fertilized) growthRate *= 1.3; // Fertilizer bonus
            if (plot.pestDamage > 50) growthRate *= 0.5; // Pest damage penalty
            
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
            } else if (!plot.pestDamage) {
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
        scheduledTreatments: prev.scheduledTreatments.filter(s => s.day > newDay),
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
    scheduleTreatment,
    changePlotSoilType,
    processDay
  };
}