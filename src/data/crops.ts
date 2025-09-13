import { CropInfo } from '@/types/farm';

export const CROP_DATA: Record<string, CropInfo> = {
  corn: {
    type: 'corn',
    name: 'Corn',
    growthDays: 5,
    waterNeeds: 3,
    optimalTemp: { min: 20, max: 30 },
    optimalHumidity: { min: 50, max: 70 },
    preferredSoil: ['loam', 'silt'],
    yieldPerPlot: 8,
    carbonFootprint: 2
  },
  wheat: {
    type: 'wheat',
    name: 'Wheat',
    growthDays: 4,
    waterNeeds: 2,
    optimalTemp: { min: 15, max: 25 },
    optimalHumidity: { min: 40, max: 60 },
    preferredSoil: ['loam', 'clay'],
    yieldPerPlot: 6,
    carbonFootprint: 1.5
  },
  rice: {
    type: 'rice',
    name: 'Rice',
    growthDays: 6,
    waterNeeds: 5,
    optimalTemp: { min: 25, max: 35 },
    optimalHumidity: { min: 70, max: 90 },
    preferredSoil: ['clay', 'silt'],
    yieldPerPlot: 10,
    carbonFootprint: 3
  },
  coconut: {
    type: 'coconut',
    name: 'Coconut',
    growthDays: 8,
    waterNeeds: 4,
    optimalTemp: { min: 25, max: 35 },
    optimalHumidity: { min: 60, max: 80 },
    preferredSoil: ['sandy', 'loam'],
    yieldPerPlot: 4,
    carbonFootprint: 1
  }
};

export const IRRIGATION_WATER_AMOUNT = {
  drip: 20,
  rainwater: 30,
  flood: 50
};

export const IRRIGATION_CARBON_FOOTPRINT = {
  drip: 0.5,
  rainwater: 0.1,
  flood: 1.5
};