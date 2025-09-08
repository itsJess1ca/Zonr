import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import stringWidth from 'string-width';
import type { Zone as ZoneType } from '../types.js';
import { globalEventEmitter, type LogMessage } from '../events.js';
import { LayoutCalculator } from '../layout/calculator.js';

interface LayoutContextProps {
  availableHeight: number;
  rowIndex: number;
  totalRows: number;
}

interface ZoneComponentProps {
  zone: ZoneType;
  width: string | number;
  innerWidth: number;
  height: string | number | 'auto';
  layoutContext: LayoutContextProps;
}

export const ZoneComponent: React.FC<ZoneComponentProps> = ({ zone, width, height, layoutContext }) => {
  const [messages, setMessages] = useState<LogMessage[]>([]);

  // Work around Ink's wide character layout bug by using generous padding
  const padTextToWidth = (text: string, maxWidth: number) => {
    // If text is too long, truncate it first
    if (stringWidth(text) > maxWidth) {
      // Simple truncation - keep removing characters until it fits
      let truncated = text;
      while (stringWidth(truncated + '...') > maxWidth && stringWidth(truncated) > 0) {
        truncated = truncated.slice(0, -1);
      }
      text = truncated + '...';
    }
    
    // Ink has a bug with wide character layout - use generous padding to force consistency
    // This ensures all lines fill the zone completely, preventing border misalignment
    const baseWidth = stringWidth(text);
    const generousPadding = Math.max(0, maxWidth - baseWidth + 8); // Extra padding to fill completely
    
    return text + ' '.repeat(generousPadding);
  };

  useEffect(() => {
    const handleMessage = (logMessage: LogMessage) => {
      if (logMessage.zoneName === zone.name) {
        if (logMessage.level === 'clear') {
          setMessages([]);
        } else {
          setMessages(prev => [...prev, logMessage]);
        }
      }
    };

    globalEventEmitter.on(handleMessage);
    
    return () => {
      globalEventEmitter.off(handleMessage);
    };
  }, [zone.name]);

  const getColorForLevel = (level: string) => {
    switch (level) {
      case 'error': return 'red';
      case 'warn': return 'yellow';
      case 'debug': return 'gray';
      default: return 'white';
    }
  };

  const calculateOptimalHeight = () => {
    if (height !== 'auto') return height;
    
    // Use the new layout calculator
    const zoneInfo = {
      zone,
      width,
      height,
      rowIndex: layoutContext.rowIndex,
      isAutoHeight: true
    };

    const result = LayoutCalculator.calculateZoneAutoHeight(
      zoneInfo,
      messages.length,
      layoutContext.availableHeight
    );

    return result.calculatedHeight;
  };

  const getMaxDisplayableMessages = () => {
    if (height !== 'auto') {
      // For fixed height, still calculate overhead properly
      const zoneInfo = {
        zone,
        width,
        height,
        rowIndex: layoutContext.rowIndex,
        isAutoHeight: false
      };
      const result = LayoutCalculator.calculateZoneAutoHeight(
        zoneInfo,
        messages.length,
        layoutContext.availableHeight
      );
      return result.maxDisplayableMessages;
    }
    
    // For auto height, use the calculated maximum
    const zoneInfo = {
      zone,
      width,
      height,
      rowIndex: layoutContext.rowIndex,
      isAutoHeight: true
    };

    const result = LayoutCalculator.calculateZoneAutoHeight(
      zoneInfo,
      messages.length,
      layoutContext.availableHeight
    );

    return result.maxDisplayableMessages;
  };

  const actualHeight = calculateOptimalHeight();
  const maxMessages = getMaxDisplayableMessages();
  const messagesToShow = messages.slice(-maxMessages);
  
  return (
    <Box width={width} height={actualHeight} position="relative">
      {/* Main bordered content area */}
      <Box
        width="100%"
        height="100%"
        borderStyle="round"
        borderColor={zone.borderColor}
        paddingLeft={1}
        paddingRight={1}
        paddingBottom={1}
        paddingTop={zone.showHeader ? 0 : 1}
      >
        <Box flexDirection="column" marginTop={zone.showHeader ? 1 : 0}>
          {messagesToShow.map((msg, index) => (
            <Text key={index} color={getColorForLevel(msg.level)}>
              {padTextToWidth(msg.message, zone.innerWidth)}
            </Text>
          ))}
        </Box>
      </Box>

      {/* Overlapping header positioned absolutely */}
      {zone.showHeader && (
        <Box position="absolute">
          <Text bold color="cyan">
            {` ${zone.name} `}
          </Text>
        </Box>
      )}
    </Box>
  );
};