import React, { useRef, useEffect, useCallback } from 'react';
import { Plot, CropType } from '@/types/farm';
import { CROP_DATA } from '@/data/crops';

interface FarmCanvasProps {
  plots: Plot[][];
  onPlotClick: (x: number, y: number) => void;
  selectedCrop: CropType | null;
}

const PLOT_SIZE = 60;
const PLOT_PADDING = 8;

export function FarmCanvas({ plots, onPlotClick, selectedCrop }: FarmCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const drawPlot = useCallback((ctx: CanvasRenderingContext2D, plot: Plot, offsetX: number, offsetY: number) => {
    const x = offsetX + plot.x * (PLOT_SIZE + PLOT_PADDING) + PLOT_PADDING;
    const y = offsetY + plot.y * (PLOT_SIZE + PLOT_PADDING) + PLOT_PADDING;
    
    // Draw soil base
    const soilColors = {
      clay: '#8B4513',
      loam: '#654321',
      sandy: '#C19A6B',
      silt: '#704214'
    };
    
    ctx.fillStyle = soilColors[plot.soilType];
    ctx.fillRect(x, y, PLOT_SIZE, PLOT_SIZE);
    
    // Draw water level indicator
    if (plot.waterLevel > 0) {
      ctx.fillStyle = `rgba(30, 144, 255, ${plot.waterLevel / 200})`;
      ctx.fillRect(x, y, PLOT_SIZE, PLOT_SIZE);
    }
    
    // Draw crop if planted
    if (plot.crop) {
      const cropColors = {
        corn: '#FFD700',
        wheat: '#DAA520',
        rice: '#90EE90',
        coconut: '#8B4513'
      };
      
      const growthRatio = plot.growthStage / CROP_DATA[plot.crop].growthDays;
      const cropSize = PLOT_SIZE * 0.6 * growthRatio;
      
      ctx.fillStyle = cropColors[plot.crop];
      ctx.beginPath();
      ctx.arc(
        x + PLOT_SIZE / 2,
        y + PLOT_SIZE / 2,
        cropSize / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      // Draw harvest indicator
      if (plot.harvestReady) {
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 3;
        ctx.strokeRect(x + 2, y + 2, PLOT_SIZE - 4, PLOT_SIZE - 4);
      }
      
      // Draw pest damage
      if (plot.pestDamage > 0) {
        ctx.fillStyle = `rgba(239, 68, 68, ${plot.pestDamage / 200})`;
        ctx.fillRect(x, y, PLOT_SIZE, PLOT_SIZE);
        if (plot.pestDamage > 50) {
          ctx.fillStyle = '#dc2626';
          ctx.font = '16px sans-serif';
          ctx.fillText('🐛', x + 5, y + 20);
        }
      }
      
      // Draw protection/fertilizer indicators
      if (plot.hasProtection) {
        ctx.fillStyle = '#22c55e';
        ctx.font = '12px sans-serif';
        ctx.fillText('🛡️', x + PLOT_SIZE - 20, y + 20);
      }
      if (plot.fertilized) {
        ctx.fillStyle = '#84cc16';
        ctx.font = '12px sans-serif';
        ctx.fillText('✨', x + PLOT_SIZE - 20, y + PLOT_SIZE - 10);
      }
    }
    
    // Draw plot border
    ctx.strokeStyle = '#4A4A4A';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, PLOT_SIZE, PLOT_SIZE);
    
    // Draw health indicator
    if (plot.health < 50) {
      ctx.fillStyle = `rgba(255, 0, 0, ${(50 - plot.health) / 100})`;
      ctx.fillRect(x, y, PLOT_SIZE, 3);
    }
  }, []);
  
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#F5E6D3';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Calculate centering offset
    const totalWidth = plots[0].length * (PLOT_SIZE + PLOT_PADDING) + PLOT_PADDING;
    const totalHeight = plots.length * (PLOT_SIZE + PLOT_PADDING) + PLOT_PADDING;
    const offsetX = (canvas.width - totalWidth) / 2;
    const offsetY = (canvas.height - totalHeight) / 2;
    
    // Draw all plots
    plots.forEach(row => {
      row.forEach(plot => {
        drawPlot(ctx, plot, offsetX, offsetY);
      });
    });
    
    // Draw cursor indicator for selected crop
    if (selectedCrop) {
      ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
      ctx.fillRect(0, 0, canvas.width, 30);
      ctx.fillStyle = '#000';
      ctx.font = '16px Arial';
      ctx.fillText(`Ready to plant: ${CROP_DATA[selectedCrop].name}`, 10, 20);
    }
  }, [plots, selectedCrop, drawPlot]);
  
  useEffect(() => {
    draw();
  }, [draw]);
  
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    const totalWidth = plots[0].length * (PLOT_SIZE + PLOT_PADDING) + PLOT_PADDING;
    const totalHeight = plots.length * (PLOT_SIZE + PLOT_PADDING) + PLOT_PADDING;
    const offsetX = (canvas.width - totalWidth) / 2;
    const offsetY = (canvas.height - totalHeight) / 2;
    
    const plotX = Math.floor((clickX - offsetX - PLOT_PADDING) / (PLOT_SIZE + PLOT_PADDING));
    const plotY = Math.floor((clickY - offsetY - PLOT_PADDING) / (PLOT_SIZE + PLOT_PADDING));
    
    if (plotX >= 0 && plotX < plots[0].length && plotY >= 0 && plotY < plots.length) {
      onPlotClick(plotX, plotY);
    }
  };
  
  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={600}
      onClick={handleClick}
      className="bg-gradient-to-br from-secondary/20 to-muted/30 rounded-lg shadow-plot cursor-pointer"
    />
  );
}