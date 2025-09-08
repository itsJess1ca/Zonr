import { ZoneRenderer } from './zone-renderer.js';
import { LayoutCalculator } from '../layout/calculator.js';
export class LayoutRenderer {
    constructor() {
        this.zones = [];
        this.zoneMessages = new Map();
        this.lastRenderableZones = [];
        this.lastRenderOutput = '';
        this.isInitialized = false;
    }
    addZone(zone) {
        this.zones.push(zone);
        this.zoneMessages.set(zone.name, []);
    }
    removeZone(zoneName) {
        this.zones = this.zones.filter((zone) => zone.name !== zoneName);
        this.zoneMessages.delete(zoneName);
    }
    clearZones() {
        this.zones = [];
        this.zoneMessages.clear();
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
        let terminalSize;
        try {
            // Windows-specific workaround: call _refreshSize() before getWindowSize()
            if (process.platform === 'win32' &&
                typeof process.stdout._refreshSize === 'function') {
                process.stdout._refreshSize();
            }
            const windowSize = process.stdout.getWindowSize();
            terminalSize = {
                width: windowSize[0],
                height: windowSize[1],
            };
        }
        catch (_e) {
            // Fallback to columns/rows if getWindowSize() fails
            terminalSize = {
                width: process.stdout.columns || 80,
                height: process.stdout.rows || 24,
            };
        }
        // Use existing layout calculator to determine zone positions and sizes
        let context = LayoutCalculator.createLayoutContext(this.zones, terminalSize.width, terminalSize.height - 1);
        context = LayoutCalculator.distributeHeights(context);
        // Convert layout context to renderable zones
        const renderableZones = [];
        let currentY = 0;
        context.rows.forEach((row) => {
            let currentX = 0;
            const rowHeight = row.calculatedHeight || row.availableHeight || 4;
            row.zones.forEach((zoneInfo) => {
                const zoneWidth = typeof zoneInfo.width === 'number' ? zoneInfo.width : 40;
                const messages = this.zoneMessages.get(zoneInfo.zone.name) || [];
                // Update the zone's innerWidth based on calculated layout width
                zoneInfo.zone.updateCalculatedDimensions(zoneWidth);
                renderableZones.push({
                    zone: zoneInfo.zone,
                    x: currentX,
                    y: currentY,
                    width: zoneWidth,
                    height: rowHeight,
                    messages: messages,
                });
                currentX += zoneWidth;
            });
            currentY += rowHeight;
        });
        // Use differential rendering to minimize screen updates
        this.renderDifferential(renderableZones);
    }
    renderDifferential(currentZones) {
        if (!this.isInitialized) {
            // First render - clear screen and scrollback to prevent duplicates
            process.stdout.write('\x1b[2J\x1b[3J\x1b[H'); // Clear screen + scrollback, home cursor
            const renderOutput = ZoneRenderer.renderFrame(currentZones);
            process.stdout.write(renderOutput);
            this.lastRenderableZones = JSON.parse(JSON.stringify(currentZones));
            this.lastRenderOutput = renderOutput;
            this.isInitialized = true;
            return;
        }
        // Always check if terminal size changed by comparing zone positions/sizes
        const terminalSizeChanged = this.hasTerminalSizeChanged(currentZones);
        if (terminalSizeChanged) {
            // Terminal size changed - clear screen and scrollback to prevent artifacts
            process.stdout.write('\x1b[2J\x1b[3J\x1b[H'); // Clear screen + scrollback, home cursor
            const renderOutput = ZoneRenderer.renderFrame(currentZones);
            process.stdout.write(renderOutput);
            this.lastRenderableZones = JSON.parse(JSON.stringify(currentZones));
            this.lastRenderOutput = renderOutput;
            return;
        }
        // Check which zones have changed content
        const changedZones = [];
        for (let i = 0; i < currentZones.length; i++) {
            const current = currentZones[i];
            const previous = this.lastRenderableZones[i];
            if (!previous || this.hasZoneChanged(current, previous)) {
                changedZones.push(current);
            }
        }
        // Only update changed zones
        if (changedZones.length > 0) {
            let output = '';
            changedZones.forEach((zone) => {
                output += ZoneRenderer.renderZone(zone);
            });
            if (output) {
                process.stdout.write(output);
            }
        }
        // Update cached state
        this.lastRenderableZones = JSON.parse(JSON.stringify(currentZones));
    }
    hasTerminalSizeChanged(currentZones) {
        if (this.lastRenderableZones.length !== currentZones.length) {
            return true;
        }
        // Check if any zone positions or sizes changed (indicates terminal resize)
        for (let i = 0; i < currentZones.length; i++) {
            const current = currentZones[i];
            const previous = this.lastRenderableZones[i];
            if (!previous ||
                current.x !== previous.x ||
                current.y !== previous.y ||
                current.width !== previous.width ||
                current.height !== previous.height) {
                return true;
            }
        }
        return false;
    }
    hasZoneChanged(current, previous) {
        // Check if messages changed (position/size changes are handled separately)
        if (current.messages.length !== previous.messages.length) {
            return true;
        }
        for (let i = 0; i < current.messages.length; i++) {
            const currentMsg = current.messages[i];
            const previousMsg = previous.messages[i];
            if (!previousMsg ||
                currentMsg.message !== previousMsg.message ||
                currentMsg.level !== previousMsg.level ||
                currentMsg.timestamp !== previousMsg.timestamp) {
                return true;
            }
        }
        return false;
    }
    handleResize() {
        // Clear everything and reset state for resize
        process.stdout.write('\x1b[2J\x1b[3J\x1b[H'); // Clear screen + scrollback, home cursor
        this.isInitialized = false;
        this.lastRenderableZones = [];
        this.lastRenderOutput = '';
        // Force immediate re-render after clearing state
        setTimeout(() => {
            this.render();
        }, 10);
    }
    clear() {
        // Clear screen and scrollback, show cursor
        process.stdout.write('\x1b[2J\x1b[3J\x1b[H\x1b[?25h');
        this.isInitialized = false;
        this.lastRenderableZones = [];
        this.lastRenderOutput = '';
    }
}
//# sourceMappingURL=layout-renderer.js.map