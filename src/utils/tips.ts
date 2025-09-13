export const SUSTAINABILITY_TIPS = [
  {
    trigger: 'plant_corn',
    message: '🌽 Corn requires moderate water. Consider drip irrigation for efficiency!'
  },
  {
    trigger: 'plant_wheat',
    message: '🌾 Wheat is drought-tolerant! It uses less water than most crops.'
  },
  {
    trigger: 'plant_rice',
    message: '🌾 Rice needs lots of water. Try rainwater harvesting to reduce environmental impact!'
  },
  {
    trigger: 'plant_coconut',
    message: '🥥 Coconuts are carbon-efficient! They absorb CO2 while growing.'
  },
  {
    trigger: 'irrigation_drip',
    message: '💧 Drip irrigation saves 30-50% water compared to flood irrigation!'
  },
  {
    trigger: 'irrigation_rainwater',
    message: '🌧️ Rainwater harvesting is the most eco-friendly irrigation method!'
  },
  {
    trigger: 'irrigation_flood',
    message: '💦 Flood irrigation uses more water but can enrich soil nutrients.'
  },
  {
    trigger: 'low_soil_health',
    message: '🌱 Rotate crops to improve soil health naturally!'
  },
  {
    trigger: 'optimal_conditions',
    message: '✨ Perfect conditions! Your crops will grow faster and healthier.'
  },
  {
    trigger: 'water_stress',
    message: '⚠️ Crops are thirsty! Schedule irrigation to prevent yield loss.'
  },
  {
    trigger: 'harvest_ready',
    message: '🎉 Time to harvest! Well-maintained crops yield more produce.'
  },
  {
    trigger: 'daily_tip_1',
    message: '🌍 Sustainable farming preserves soil for future generations!'
  },
  {
    trigger: 'daily_tip_2',
    message: '📊 Monitor your eco-score to track environmental impact.'
  },
  {
    trigger: 'daily_tip_3',
    message: '🔄 Crop rotation prevents soil depletion and pest buildup.'
  },
  {
    trigger: 'daily_tip_4',
    message: '☀️ Plant according to weather forecasts for optimal growth.'
  }
];

export function getRandomDailyTip(): string {
  const dailyTips = SUSTAINABILITY_TIPS.filter(tip => tip.trigger.startsWith('daily_tip'));
  return dailyTips[Math.floor(Math.random() * dailyTips.length)].message;
}