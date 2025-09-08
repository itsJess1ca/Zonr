import { describe, it, expect } from 'vitest';
import { LayoutCalculator } from '../src/layout/calculator.js';
import { ZoneImpl } from '../src/zone.js';
import type { Zone } from '../src/types.js';

// Mock zone factory
function createMockZone(config: {
  name: string;
  width?: string | number;
  height?: string | number | 'auto';
  showHeader?: boolean;
}): Zone {
  return new ZoneImpl({
    name: config.name,
    width: config.width,
    height: config.height,
    showHeader: config.showHeader
  });
}

describe('LayoutCalculator', () => {
  describe('createLayoutContext', () => {
    it('should create layout context for single zone', () => {
      const zones = [createMockZone({ name: 'Test', width: '100%', height: 'auto' })];
      const context = LayoutCalculator.createLayoutContext(zones, 80, 24);
      
      expect(context.totalTerminalHeight).toBe(24);
      expect(context.totalTerminalWidth).toBe(80);
      expect(context.rows).toHaveLength(1);
      expect(context.rows[0].zones).toHaveLength(1);
      expect(context.rows[0].hasAutoZones).toBe(true);
    });

    it('should group zones into correct rows', () => {
      const zones = [
        createMockZone({ name: 'Logs', width: '50', height: 'auto' }),
        createMockZone({ name: 'Metadata', width: '50', height: 'auto' }),
        createMockZone({ name: 'Progress', width: '100%', height: 'auto' })
      ];
      
      const context = LayoutCalculator.createLayoutContext(zones, 80, 24);
      
      expect(context.rows).toHaveLength(2);
      expect(context.rows[0].zones).toHaveLength(2); // 50% + 50%
      expect(context.rows[1].zones).toHaveLength(1); // 100%
    });

    it('should identify auto height zones correctly', () => {
      const zones = [
        createMockZone({ name: 'Auto', width: '50', height: 'auto' }),
        createMockZone({ name: 'Fixed', width: '50', height: 10 })
      ];
      
      const context = LayoutCalculator.createLayoutContext(zones, 80, 24);
      
      expect(context.rows[0].hasAutoZones).toBe(true);
      expect(context.rows[0].zones[0].isAutoHeight).toBe(true);
      expect(context.rows[0].zones[1].isAutoHeight).toBe(false);
    });
  });

  describe('distributeHeights', () => {
    it('should distribute height evenly among auto rows', () => {
      const zones = [
        createMockZone({ name: 'Row1', width: '100%', height: 'auto' }),
        createMockZone({ name: 'Row2', width: '100%', height: 'auto' })
      ];
      
      let context = LayoutCalculator.createLayoutContext(zones, 80, 24);
      context = LayoutCalculator.distributeHeights(context);
      
      expect(context.rows[0].calculatedHeight).toBe(12);
      expect(context.rows[1].calculatedHeight).toBe(12);
      expect(context.rows[0].availableHeight).toBe(12);
      expect(context.rows[1].availableHeight).toBe(12);
    });

    it('should handle mixed auto and fixed heights', () => {
      const zones = [
        createMockZone({ name: 'Fixed', width: '100%', height: 8 }),
        createMockZone({ name: 'Auto', width: '100%', height: 'auto' })
      ];
      
      let context = LayoutCalculator.createLayoutContext(zones, 80, 24);
      context = LayoutCalculator.distributeHeights(context);
      
      expect(context.rows[0].calculatedHeight).toBe(8);
      expect(context.rows[0].fixedHeight).toBe(8);
      expect(context.rows[1].calculatedHeight).toBe(16); // 24 - 8
      expect(context.rows[1].availableHeight).toBe(16);
    });
  });

  describe('calculateZoneAutoHeight', () => {
    it('should calculate correct height for auto zone with header', () => {
      const zone = createMockZone({ 
        name: 'Test', 
        width: '100%', 
        height: 'auto', 
        showHeader: true 
      });
      
      const zoneInfo = {
        zone,
        width: zone.width,
        height: zone.height,
        rowIndex: 0,
        isAutoHeight: true
      };
      
      const result = LayoutCalculator.calculateZoneAutoHeight(zoneInfo, 50, 20);
      
      // Available height: 20
      // With overlapping header: 0 top + 1 bottom + 2 borders + 1 margin = 4
      // Available for content: 20 - 4 = 16
      expect(result.overhead).toBe(4);
      expect(result.availableForContent).toBe(16);
      expect(result.maxDisplayableMessages).toBe(16);
      expect(result.calculatedHeight).toBe(20);
    });

    it('should calculate correct height for auto zone without header', () => {
      const zone = createMockZone({ 
        name: 'Test', 
        width: '100%', 
        height: 'auto', 
        showHeader: false 
      });
      
      const zoneInfo = {
        zone,
        width: zone.width,
        height: zone.height,
        rowIndex: 0,
        isAutoHeight: true
      };
      
      const result = LayoutCalculator.calculateZoneAutoHeight(zoneInfo, 50, 20);
      
      // Overhead: 0 header + 1 top + 1 bottom + 2 borders + 0 margin = 4
      // Available for content: 20 - 4 = 16
      expect(result.overhead).toBe(4);
      expect(result.availableForContent).toBe(16);
      expect(result.maxDisplayableMessages).toBe(16);
    });

    it('should handle fixed height zones', () => {
      const zone = createMockZone({ 
        name: 'Test', 
        width: '100%', 
        height: 10
      });
      
      const zoneInfo = {
        zone,
        width: zone.width,
        height: zone.height,
        rowIndex: 0,
        isAutoHeight: false
      };
      
      const result = LayoutCalculator.calculateZoneAutoHeight(zoneInfo, 50, 20);
      
      expect(result.calculatedHeight).toBe(10);
      expect(result.maxDisplayableMessages).toBe(6); // Fixed height 10 - overhead 4 = 6
    });

    it('should enforce minimum zone heights', () => {
      // Zone with header should be minimum 5
      const zoneWithHeader = createMockZone({ 
        name: 'WithHeader', 
        width: '100%', 
        height: 1,  // Too small
        showHeader: true
      });
      expect(zoneWithHeader.height).toBe(5); // Auto-bumped to minimum

      // Zone without header should be minimum 4  
      const zoneNoHeader = createMockZone({ 
        name: 'NoHeader', 
        width: '100%', 
        height: 2,  // Too small
        showHeader: false
      });
      expect(zoneNoHeader.height).toBe(4); // Auto-bumped to minimum

      // Zone with sufficient height should remain unchanged
      const okZone = createMockZone({ 
        name: 'OK', 
        width: '100%', 
        height: 10,
        showHeader: true
      });
      expect(okZone.height).toBe(10); // Unchanged
    });

    it('should ensure minimum height of 1 message', () => {
      const zone = createMockZone({ 
        name: 'Test', 
        width: '100%', 
        height: 'auto'
      });
      
      const zoneInfo = {
        zone,
        width: zone.width,
        height: zone.height,
        rowIndex: 0,
        isAutoHeight: true
      };
      
      const result = LayoutCalculator.calculateZoneAutoHeight(zoneInfo, 50, 3); // Very small height
      
      expect(result.maxDisplayableMessages).toBe(1); // Always at least 1
      expect(result.availableForContent).toBe(1);
    });
  });
});