import { Weather, WeatherCondition } from '@/types/farm';

export function generateWeather(day: number): Weather {
  // Simulate seasonal patterns
  const seasonOffset = Math.sin((day / 30) * Math.PI * 2) * 0.3;
  
  const baseTemp = 22 + seasonOffset * 10;
  const temperature = Math.round(baseTemp + (Math.random() - 0.5) * 8);
  
  const baseHumidity = 60 + seasonOffset * 20;
  const humidity = Math.round(baseHumidity + (Math.random() - 0.5) * 30);
  
  let condition: WeatherCondition;
  let rainfall = 0;
  
  const rand = Math.random();
  if (rand < 0.4) {
    condition = 'sunny';
    rainfall = 0;
  } else if (rand < 0.6) {
    condition = 'cloudy';
    rainfall = 0;
  } else if (rand < 0.85) {
    condition = 'rainy';
    rainfall = Math.round(10 + Math.random() * 20);
  } else {
    condition = 'stormy';
    rainfall = Math.round(30 + Math.random() * 30);
  }
  
  return {
    day,
    temperature,
    humidity,
    rainfall,
    condition
  };
}

export const WEATHER_ICONS = {
  sunny: '☀️',
  cloudy: '☁️',
  rainy: '🌧️',
  stormy: '⛈️'
};

export const WEATHER_COLORS = {
  sunny: '#FFD700',
  cloudy: '#B0C4DE',
  rainy: '#4682B4',
  stormy: '#2F4F4F'
};