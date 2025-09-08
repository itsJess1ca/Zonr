import { ZoneRenderer } from './zone-renderer.js';
import { LayoutCalculator } from '../layout/calculator.js';
export class LayoutRenderer {
    constructor() {
        this.zones = [];
        this.zoneMessages = new Map();
        this.lastRender = '';
    }
    addZone(zone) {
        this.zones.push(zone);
        this.zoneMessages.set(zone.name, []);
    }
    addMessage(zoneName, message) {
        const messages = this.zoneMessages.get(zoneName) || [];
        if (message.level === 'clear') {
            this.zoneMessages.set(zoneName, []);
        }
        else {
            messages.push(message);
            this.zoneMessages.set(zoneName, messages);
        }
    }
    render() {
        const terminalSize = { width: process.stdout.columns || 80, height: process.stdout.rows || 24 };
        // Use existing layout calculator to determine zone positions and sizes
        let context = LayoutCalculator.createLayoutContext(this.zones, terminalSize.width, terminalSize.height - 1);
        context = LayoutCalculator.distributeHeights(context);
        // Convert layout context to renderable zones
        const renderableZones = [];
        let currentY = 0;
        context.rows.forEach(row => {
            let currentX = 0;
            const rowHeight = row.calculatedHeight || row.availableHeight || 4;
            row.zones.forEach(zoneInfo => {
                const zoneWidth = typeof zoneInfo.width === 'number' ? zoneInfo.width : 40;
                const messages = this.zoneMessages.get(zoneInfo.zone.name) || [];
                renderableZones.push({
                    zone: zoneInfo.zone,
                    x: currentX,
                    y: currentY,
                    width: zoneWidth,
                    height: rowHeight,
                    messages: messages
                });
                currentX += zoneWidth;
            });
            currentY += rowHeight;
        });
        // Generate the render output
        const renderOutput = ZoneRenderer.renderFrame(renderableZones);
        // Only update the screen if the content has changed (basic optimization)
        if (renderOutput !== this.lastRender) {
            process.stdout.write(renderOutput);
            this.lastRender = renderOutput;
        }
    }
    clear() {
        process.stdout.write('\x1b[2J\x1b[H\x1b[?25h'); // Clear screen, home cursor, show cursor
    }
}
//# sourceMappingURL=layout-renderer.js.map