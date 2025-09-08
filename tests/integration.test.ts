import { describe, it, expect } from 'vitest';
import { LayoutCalculator } from '../src/layout/calculator.js';
import { ZoneImpl } from '../src/zone.js';
import { testScenarios, edgeCaseScenarios } from './scenarios/test-scenarios.js';
import type { Zone } from '../src/types.js';

// Helper to create zones from scenario config
function createZonesFromScenario(scenario: typeof testScenarios[0]): Zone[] {
  return scenario.zones.map(config => 
    new ZoneImpl({
      name: config.name,
      width: config.width,
      height: config.height,
      showHeader: config.showHeader
    })
  );
}

describe('Layout System Integration Tests', () => {
  describe('Standard Test Scenarios', () => {
    testScenarios.forEach(scenario => {
      it(`should handle ${scenario.name} correctly`, () => {
        const zones = createZonesFromScenario(scenario);
        
        // Create layout context (subtract 1 for terminal cursor line like in App component)
        let context = LayoutCalculator.createLayoutContext(
          zones,
          scenario.terminalSize.width,
          scenario.terminalSize.height - 1 - 1
        );

        // Distribute heights
        context = LayoutCalculator.distributeHeights(context);

        // Validate row count
        expect(context.rows.length).toBe(scenario.expectedBehavior.rowCount);

        // Validate total height doesn't exceed terminal
        const totalUsedHeight = context.rows.reduce(
          (sum, row) => sum + (row.calculatedHeight || 0),
          0
        );
        expect(totalUsedHeight).toBeLessThanOrEqual(scenario.expectedBehavior.maxTotalHeight);

        // Validate each zone's message capacity
        context.rows.forEach(row => {
          row.zones.forEach(zoneInfo => {
            const result = LayoutCalculator.calculateZoneAutoHeight(
              zoneInfo,
              100, // Simulate 100 messages available
              row.availableHeight || row.calculatedHeight || 4
            );

            const expected = scenario.expectedBehavior.maxMessagesPerZone[zoneInfo.zone.name];
            if (expected !== undefined) {
              // Allow some tolerance for calculation differences
              expect(result.maxDisplayableMessages).toBeGreaterThanOrEqual(Math.max(1, expected - 2));
              expect(result.maxDisplayableMessages).toBeLessThanOrEqual(expected + 2);
            }
          });
        });
      });
    });
  });

  describe('Edge Case Scenarios', () => {
    edgeCaseScenarios.forEach(scenario => {
      it(`should handle ${scenario.name} without errors`, () => {
        const zones = createZonesFromScenario(scenario);
        
        let context = LayoutCalculator.createLayoutContext(
          zones,
          scenario.terminalSize.width,
          scenario.terminalSize.height - 1
        );

        context = LayoutCalculator.distributeHeights(context);

        // Should not throw and should produce valid results
        expect(context.rows.length).toBeGreaterThan(0);
        expect(context.totalTerminalHeight).toBe(scenario.terminalSize.height - 1);
        expect(context.totalTerminalWidth).toBe(scenario.terminalSize.width);

        // All zones should have valid heights
        context.rows.forEach(row => {
          expect(row.calculatedHeight).toBeGreaterThan(0);
          
          row.zones.forEach(zoneInfo => {
            const result = LayoutCalculator.calculateZoneAutoHeight(
              zoneInfo,
              50,
              row.availableHeight || row.calculatedHeight || 4
            );
            
            expect(result.maxDisplayableMessages).toBeGreaterThanOrEqual(1);
            expect(result.calculatedHeight).toBeGreaterThan(0);
          });
        });
      });
    });
  });

  describe('Performance Tests', () => {
    it('should calculate complex layouts within performance bounds', () => {
      // Create a complex scenario with many zones
      const manyZones = Array.from({ length: 20 }, (_, i) => 
        new ZoneImpl({
          name: `Zone${i}`,
          width: i % 2 === 0 ? '50' : '50',
          height: 'auto'
        })
      );

      const startTime = Date.now();
      
      let context = LayoutCalculator.createLayoutContext(manyZones, 200, 100);
      context = LayoutCalculator.distributeHeights(context);
      
      // Calculate heights for all zones
      context.rows.forEach(row => {
        row.zones.forEach(zoneInfo => {
          LayoutCalculator.calculateZoneAutoHeight(
            zoneInfo,
            1000, // Many messages
            row.availableHeight || 10
          );
        });
      });

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(50); // Should complete in under 50ms
    });

    it('should handle terminal size changes efficiently', () => {
      const zones = createZonesFromScenario(testScenarios[0]);
      
      // Test different terminal sizes
      const terminalSizes = [
        { width: 80, height: 24 },
        { width: 120, height: 30 },
        { width: 200, height: 60 },
        { width: 40, height: 12 }
      ];

      terminalSizes.forEach(size => {
        const startTime = Date.now();
        
        let context = LayoutCalculator.createLayoutContext(zones, size.width, size.height - 1);
        context = LayoutCalculator.distributeHeights(context);
        
        const duration = Date.now() - startTime;
        expect(duration).toBeLessThan(10); // Very fast recalculation
        expect(context.totalTerminalHeight).toBe(size.height - 1);
      });
    });
  });

  describe('Constraint Validation', () => {
    it('should never exceed terminal height', () => {
      testScenarios.forEach(scenario => {
        const zones = createZonesFromScenario(scenario);
        
        let context = LayoutCalculator.createLayoutContext(
          zones,
          scenario.terminalSize.width,
          scenario.terminalSize.height - 1
        );
        context = LayoutCalculator.distributeHeights(context);

        const totalHeight = context.rows.reduce(
          (sum, row) => sum + (row.calculatedHeight || 0),
          0
        );

        expect(totalHeight).toBeLessThanOrEqual(scenario.terminalSize.height);
      });
    });

    it('should always provide at least 1 message capacity per auto zone', () => {
      testScenarios.forEach(scenario => {
        const zones = createZonesFromScenario(scenario);
        
        let context = LayoutCalculator.createLayoutContext(
          zones,
          scenario.terminalSize.width,
          scenario.terminalSize.height - 1
        );
        context = LayoutCalculator.distributeHeights(context);

        context.rows.forEach(row => {
          row.zones.forEach(zoneInfo => {
            if (zoneInfo.isAutoHeight) {
              const result = LayoutCalculator.calculateZoneAutoHeight(
                zoneInfo,
                50,
                row.availableHeight || row.calculatedHeight || 4
              );
              
              expect(result.maxDisplayableMessages).toBeGreaterThanOrEqual(1);
            }
          });
        });
      });
    });
  });
});