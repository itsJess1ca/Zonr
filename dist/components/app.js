import { jsx as _jsx } from "react/jsx-runtime";
import { Box } from 'ink';
import { ZoneComponent } from './zone-component.js';
import { LayoutCalculator } from '../layout/calculator.js';
export const App = ({ zones }) => {
    const calculateLayout = () => {
        const totalWidth = process.stdout.columns || 80;
        const totalHeight = (process.stdout.rows || 24) - 1; // Reserve 1 line for terminal/cursor
        // Use the new layout calculator
        let context = LayoutCalculator.createLayoutContext(zones, totalWidth, totalHeight);
        context = LayoutCalculator.distributeHeights(context);
        return context;
    };
    const layoutContext = calculateLayout();
    return (_jsx(Box, { flexDirection: "column", width: "100%", height: "100%", children: layoutContext.rows.map((row, rowIndex) => (_jsx(Box, { flexDirection: "row", width: "100%", children: row.zones.map((zoneInfo) => (_jsx(ZoneComponent, { zone: zoneInfo.zone, width: zoneInfo.width, height: zoneInfo.height, innerWidth: zoneInfo.zone.innerWidth, layoutContext: {
                    availableHeight: row.availableHeight || row.calculatedHeight || 4,
                    rowIndex: zoneInfo.rowIndex,
                    totalRows: layoutContext.rows.length
                } }, zoneInfo.zone.name))) }, rowIndex))) }));
};
//# sourceMappingURL=app.js.map