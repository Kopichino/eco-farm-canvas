export type CropType = 'corn' | 'wheat' | 'rice' | 'coconut';
export type SoilType = 'clay' | 'loam' | 'sandy' | 'silt';
export type IrrigationType = 'drip' | 'rainwater' | 'flood';
export type WeatherCondition = 'sunny' | 'rainy' | 'cloudy' | 'stormy';
export type TreatmentType = 'pesticide' | 'fertilizer';

export interface CropInfo {
  type: CropType;
  name: string;
  growthDays: number;
  waterNeeds: number; // 1-5 scale
  optimalTemp: { min: number; max: number };
  optimalHumidity: { min: number; max: number };
  preferredSoil: SoilType[];
  yieldPerPlot: number;
  carbonFootprint: number;
}

export interface Plot {
  id: string;
  x: number;
  y: number;
  crop: CropType | null;
  plantedDay: number | null;
  growthStage: number;
  waterLevel: number; // 0-100
  soilType: SoilType;
  health: number; // 0-100
  harvestReady: boolean;
  hasProtection: boolean; // pesticide protection
  fertilized: boolean;
  pestDamage: number; // 0-100
}

export interface Weather {
  day: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  condition: WeatherCondition;
}

export interface ScheduledIrrigation {
  day: number;
  type: IrrigationType;
  plotIds: string[];
}

export interface ScheduledTreatment {
  day: number;
  type: TreatmentType;
  plotIds: string[];
}

export interface EcoScore {
  soilHealth: number;
  waterUsage: number;
  cropYield: number;
  carbonFootprint: number;
  overall: number;
}

export interface GameState {
  gridSize: number;
  plots: Plot[][];
  currentDay: number;
  weather: Weather;
  scheduledIrrigations: ScheduledIrrigation[];
  scheduledTreatments: ScheduledTreatment[];
  ecoScore: EcoScore;
  totalWaterUsed: number;
  totalCropsHarvested: number;
  tips: string[];
}