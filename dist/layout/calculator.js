export class LayoutCalculator {
    static createLayoutContext(zones, terminalWidth, terminalHeight) {
        const rows = this.groupZonesIntoRows(zones);
        const distributedRows = this.distributeWidthsInRows(rows, terminalWidth);
        return {
            totalTerminalHeight: terminalHeight,
            totalTerminalWidth: terminalWidth,
            rows: distributedRows.map((rowZones, index) => ({
                zones: rowZones.map(({ zone, width, height }) => ({
                    zone,
                    width,
                    height,
                    rowIndex: index,
                    isAutoHeight: height === 'auto',
                })),
                hasAutoZones: rowZones.some(({ height }) => height === 'auto'),
            })),
        };
    }
    static groupZonesIntoRows(zones) {
        const rows = [];
        let currentRow = [];
        let currentRowWidth = 0;
        const maxWidth = 100;
        zones.forEach((zone) => {
            const originalWidth = zone.originalWidth;
            let zoneWidthPercent = 0;
            if (typeof originalWidth === 'string') {
                if (originalWidth.endsWith('%')) {
                    zoneWidthPercent = parseInt(originalWidth);
                }
                else {
                    const parsed = parseInt(originalWidth);
                    zoneWidthPercent = isNaN(parsed) ? 100 : parsed;
                }
            }
            else if (typeof originalWidth === 'number') {
                zoneWidthPercent = originalWidth;
            }
            else {
                zoneWidthPercent = 100;
            }
            if (currentRowWidth + zoneWidthPercent > maxWidth &&
                currentRow.length > 0) {
                rows.push(currentRow);
                currentRow = [];
                currentRowWidth = 0;
            }
            currentRow.push({
                zone,
                width: zone.originalWidth || zone.width,
                height: zone.height,
            });
            currentRowWidth += zoneWidthPercent;
        });
        if (currentRow.length > 0) {
            rows.push(currentRow);
        }
        return rows;
    }
    static distributeWidthsInRows(rows, terminalWidth) {
        return rows.map((row) => {
            // Calculate percentage values for each zone in the row
            const percentages = row.map(({ zone }) => {
                const originalWidth = zone.originalWidth;
                if (typeof originalWidth === 'string' && originalWidth.endsWith('%')) {
                    return parseInt(originalWidth);
                }
                else if (typeof originalWidth === 'number') {
                    return originalWidth;
                }
                else {
                    // Default width for zones without specified width
                    return Math.floor(100 / row.length);
                }
            });
            // Smart width distribution algorithm
            const borderPaddingOverhead = 4; // 2 borders + 2 padding per zone
            const totalOverhead = row.length * borderPaddingOverhead;
            const availableContentWidth = terminalWidth - totalOverhead;
            // Calculate base widths (floor division)
            const baseWidths = percentages.map((p) => Math.floor((availableContentWidth * p) / 100));
            // Calculate used width and remainder
            const usedContentWidth = baseWidths.reduce((sum, w) => sum + w, 0);
            const remainderWidth = availableContentWidth - usedContentWidth;
            // Distribute remainder to largest zones first
            const sortedIndices = percentages
                .map((p, i) => ({ percentage: p, index: i }))
                .sort((a, b) => b.percentage - a.percentage)
                .map((x) => x.index);
            // Add remainder columns to largest zones
            for (let i = 0; i < remainderWidth; i++) {
                baseWidths[sortedIndices[i % sortedIndices.length]]++;
            }
            // Add back overhead to get final zone widths
            const finalWidths = baseWidths.map((w) => w + borderPaddingOverhead);
            // Debug logging for width calculations
            if (process.env.DEBUG_WIDTHS) {
                console.log('Width distribution debug:');
                console.log('Terminal width:', terminalWidth);
                console.log('Percentages:', percentages);
                console.log('Final zone widths:', finalWidths);
                console.log('Total width:', finalWidths.reduce((a, b) => a + b, 0));
            }
            // Return row with updated widths
            return row.map((zoneInfo, index) => ({
                ...zoneInfo,
                width: finalWidths[index],
            }));
        });
    }
    static distributeHeights(context) {
        let remainingHeight = context.totalTerminalHeight;
        // First pass: Handle mixed rows (rows with both auto and fixed zones)
        context.rows.forEach((row) => {
            if (!row.hasAutoZones) {
                // All zones have fixed heights, use the maximum
                const maxFixedHeight = Math.max(...row.zones.map((zoneInfo) => typeof zoneInfo.height === 'number' ? zoneInfo.height : 4));
                row.fixedHeight = maxFixedHeight;
                row.calculatedHeight = maxFixedHeight;
                remainingHeight -= maxFixedHeight;
            }
            else {
                // Row has auto zones, check if there are also fixed zones
                const fixedZones = row.zones.filter((z) => !z.isAutoHeight);
                if (fixedZones.length > 0) {
                    // Mixed row: use the maximum fixed height for the entire row
                    const maxFixedHeight = Math.max(...fixedZones.map((zoneInfo) => typeof zoneInfo.height === 'number' ? zoneInfo.height : 4));
                    row.fixedHeight = maxFixedHeight;
                    row.calculatedHeight = maxFixedHeight;
                    row.availableHeight = maxFixedHeight;
                    remainingHeight -= maxFixedHeight;
                }
            }
        });
        // Second pass: Distribute remaining height among pure auto rows
        const pureAutoRows = context.rows.filter((row) => row.hasAutoZones && !row.fixedHeight);
        const heightPerAutoRow = Math.floor(remainingHeight / Math.max(1, pureAutoRows.length));
        pureAutoRows.forEach((row) => {
            row.availableHeight = heightPerAutoRow;
            row.calculatedHeight = heightPerAutoRow;
        });
        return context;
    }
    static calculateZoneAutoHeight(zoneInfo, messageCount, availableHeight) {
        if (zoneInfo.height !== 'auto') {
            const fixedHeight = typeof zoneInfo.height === 'number' ? zoneInfo.height : 4;
            // With overlapping header design: header no longer takes content space
            const topPadding = zoneInfo.zone.showHeader ? 0 : 1; // No top padding when header overlaps
            const bottomPadding = 1;
            const borderLines = 2;
            const contentMargin = zoneInfo.zone.showHeader ? 1 : 0; // Margin to avoid header overlap
            const overhead = topPadding + bottomPadding + borderLines + contentMargin;
            const availableForContent = Math.max(1, fixedHeight - overhead);
            return {
                maxDisplayableMessages: Math.max(1, availableForContent),
                calculatedHeight: fixedHeight,
                overhead,
                availableForContent,
            };
        }
        // With overlapping header design: header no longer takes content space
        const topPadding = zoneInfo.zone.showHeader ? 0 : 1; // No top padding when header overlaps
        const bottomPadding = 1;
        const borderLines = 2;
        const contentMargin = zoneInfo.zone.showHeader ? 1 : 0; // Margin to avoid header overlap
        const overhead = topPadding + bottomPadding + borderLines + contentMargin;
        const availableForContent = Math.max(1, availableHeight - overhead);
        const maxDisplayableMessages = Math.max(1, availableForContent);
        return {
            maxDisplayableMessages,
            calculatedHeight: availableHeight,
            overhead,
            availableForContent,
        };
    }
}
//# sourceMappingURL=calculator.js.map