export interface LayoutContext {
    totalTerminalHeight: number;
    totalTerminalWidth: number;
    rows: RowInfo[];
}
export interface RowInfo {
    zones: ZoneLayoutInfo[];
    hasAutoZones: boolean;
    fixedHeight?: number;
    calculatedHeight?: number;
    availableHeight?: number;
}
export interface ZoneLayoutInfo {
    zone: import('../types.js').Zone;
    width: number | string;
    height: number | string | 'auto';
    rowIndex: number;
    isAutoHeight: boolean;
}
export interface HeightCalculationResult {
    maxDisplayableMessages: number;
    calculatedHeight: number;
    overhead: number;
    availableForContent: number;
}
export interface TestScenario {
    name: string;
    zones: Array<{
        name: string;
        width?: string | number;
        height?: string | number | 'auto';
        showHeader?: boolean;
    }>;
    terminalSize: {
        width: number;
        height: number;
    };
    expectedBehavior: {
        rowCount: number;
        maxMessagesPerZone: Record<string, number>;
        maxTotalHeight: number;
    };
}
//# sourceMappingURL=types.d.ts.map