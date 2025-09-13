import React, { useState } from 'react';
import { GridSizeSelector } from '@/components/GridSizeSelector';
import { FarmGame } from '@/components/FarmGame';

const Index = () => {
  const [gridSize, setGridSize] = useState<number | null>(null);
  
  if (!gridSize) {
    return <GridSizeSelector onStart={setGridSize} />;
  }
  
  return <FarmGame gridSize={gridSize} />;
};

export default Index;