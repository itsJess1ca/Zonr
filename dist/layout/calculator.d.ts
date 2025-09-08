import type { Zone } from '../types.js';
import type { LayoutContext, ZoneLayoutInfo, HeightCalculationResult } from './types.js';
export declare class LayoutCalculator {
    static createLayoutContext(zones: Zone[], terminalWidth: number, terminalHeight: number): LayoutContext;
    private static groupZonesIntoRows;
    private static distributeWidthsInRows;
    static distributeHeights(context: LayoutContext): LayoutContext;
    static calculateZoneAutoHeight(zoneInfo: ZoneLayoutInfo, messageCount: number, availableHeight: number): HeightCalculationResult;
}
//# sourceMappingURL=calculator.d.ts.map