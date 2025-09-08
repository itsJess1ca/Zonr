import React from 'react';
import { Box } from 'ink';
import { ZoneComponent } from './zone-component.js';
import { LayoutCalculator } from '../layout/calculator.js';
import type { Zone } from '../types.js';

interface AppProps {
  zones: Zone[];
}

export const App: React.FC<AppProps> = ({ zones }) => {
  const calculateLayout = () => {
    const totalWidth = process.stdout.columns || 80;
    const totalHeight = (process.stdout.rows || 24) - 1; // Reserve 1 line for terminal/cursor
    
    // Use the new layout calculator
    let context = LayoutCalculator.createLayoutContext(zones, totalWidth, totalHeight);
    context = LayoutCalculator.distributeHeights(context);
    
    return context;
  };

  const layoutContext = calculateLayout();

  return (
    <Box flexDirection="column" width="100%" height="100%">
      {layoutContext.rows.map((row, rowIndex) => (
        <Box key={rowIndex} flexDirection="row" width="100%">
          {row.zones.map((zoneInfo) => (
            <ZoneComponent
              key={zoneInfo.zone.name}
              zone={zoneInfo.zone}
              width={zoneInfo.width}
              height={zoneInfo.height}
              innerWidth={zoneInfo.zone.innerWidth}
              layoutContext={{
                availableHeight: row.availableHeight || row.calculatedHeight || 4,
                rowIndex: zoneInfo.rowIndex,
                totalRows: layoutContext.rows.length
              }}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};