import { ZoneRenderer, type RenderableZone } from './zone-renderer.js';
import { LayoutCalculator } from '../layout/calculator.js';
import type { Zone } from '../types.js';
import type { LogMessage } from '../events.js';

export class LayoutRenderer {
  private zones: Zone[] = [];
  private zoneMessages: Map<string, LogMessage[]> = new Map();
  private lastRenderableZones: RenderableZone[] = [];
  private lastRenderOutput: string = '';
  private isInitialized = false;
  private renderedZones: Set<string> = new Set(); // Track which zones have been fully rendered
  private zoneMessageHashes: Map<string, string> = new Map(); // Track content hashes for efficient comparison

  addZone(zone: Zone) {
    this.zones.push(zone);
    this.zoneMessages.set(zone.name, []);
  }

  removeZone(zoneName: string) {
    this.zones = this.zones.filter((zone) => zone.name !== zoneName);
    this.zoneMessages.delete(zoneName);
    this.renderedZones.delete(zoneName);
    this.zoneMessageHashes.delete(zoneName);
  }

  clearZones() {
    this.zones = [];
    this.zoneMessages.clear();
    this.renderedZones.clear();
    this.zoneMessageHashes.clear();
  }

  addMessage(zoneName: string, message: LogMessage) {
    const messages = this.zoneMessages.get(zoneName) || [];

    if (message.level === 'clear') {
      this.zoneMessages.set(zoneName, []);
    } else {
      messages.push(message);
      this.zoneMessages.set(zoneName, messages);
    }
  }

  render() {
    let terminalSize: { width: number; height: number };

    try {
      // Windows-specific workaround: call _refreshSize() before getWindowSize()
      if (
        process.platform === 'win32' &&
        typeof (
          process.stdout as NodeJS.WriteStream & { _refreshSize?: () => void }
        )._refreshSize === 'function'
      ) {
        (
          process.stdout as unknown as NodeJS.WriteStream & {
            _refreshSize: () => void;
          }
        )._refreshSize();
      }

      const windowSize = process.stdout.getWindowSize();
      terminalSize = {
        width: windowSize[0],
        height: windowSize[1],
      };
    } catch (_e) {
      // Fallback to columns/rows if getWindowSize() fails
      terminalSize = {
        width: process.stdout.columns || 80,
        height: process.stdout.rows || 24,
      };
    }

    // Use existing layout calculator to determine zone positions and sizes
    let context = LayoutCalculator.createLayoutContext(
      this.zones,
      terminalSize.width,
      terminalSize.height - 1
    );
    context = LayoutCalculator.distributeHeights(context);

    // Convert layout context to renderable zones
    const renderableZones: RenderableZone[] = [];
    let currentY = 0;

    context.rows.forEach((row) => {
      let currentX = 0;
      const rowHeight = row.calculatedHeight || row.availableHeight || 4;

      row.zones.forEach((zoneInfo) => {
        const zoneWidth =
          typeof zoneInfo.width === 'number' ? zoneInfo.width : 40;
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

  private renderDifferential(currentZones: RenderableZone[]) {
    if (!this.isInitialized) {
      // First render - clear screen and scrollback to prevent duplicates
      process.stdout.write('\x1b[2J\x1b[3J\x1b[H'); // Clear screen + scrollback, home cursor
      const renderOutput = ZoneRenderer.renderFrame(currentZones);
      process.stdout.write(renderOutput);
      this.lastRenderableZones = JSON.parse(JSON.stringify(currentZones));
      this.lastRenderOutput = renderOutput;
      this.isInitialized = true;
      
      // Mark all zones as rendered
      currentZones.forEach(zone => {
        this.renderedZones.add(zone.zone.name);
      });
      
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
      
      // Mark all zones as rendered after terminal size change
      this.renderedZones.clear();
      currentZones.forEach(zone => {
        this.renderedZones.add(zone.zone.name);
      });
      
      return;
    }

    // Check which zones have changed content or need initial render
    const changedZones: RenderableZone[] = [];
    const newZones: RenderableZone[] = [];

    // Create a map of previous zones by name for more reliable comparison
    const previousZonesMap = new Map<string, RenderableZone>();
    this.lastRenderableZones.forEach(zone => {
      previousZonesMap.set(zone.zone.name, zone);
    });

    for (const current of currentZones) {
      const zoneName = current.zone.name;
      const previous = previousZonesMap.get(zoneName);

      // Check if zone has never been rendered (needs full render with borders/headers)
      if (!this.renderedZones.has(zoneName)) {
        newZones.push(current);
        this.renderedZones.add(zoneName);
      } else if (previous && this.hasZoneChanged(current, previous)) {
        // Zone exists but content changed (only update content)
        changedZones.push(current);
      }
      // Implicit else: zone exists and hasn't changed, skip rendering
    }

    // Render new zones with full borders and headers
    if (newZones.length > 0) {
      let output = '';
      output += '\x1b[?25l'; // Hide cursor
      
      newZones.forEach((zone) => {
        output += ZoneRenderer.renderZone(zone);
      });
      
      output += '\x1b[?25h'; // Show cursor
      
      if (output) {
        process.stdout.write(output);
      }
    }

    // Only update changed zones - render content only to prevent border/header flicker
    if (changedZones.length > 0) {
      let output = '';
      output += '\x1b[?25l'; // Hide cursor
      
      changedZones.forEach((zone) => {
        // Only render the content area, preserving borders and headers
        output += ZoneRenderer.renderZoneContent(zone);
      });
      
      output += '\x1b[?25h'; // Show cursor
      
      if (output) {
        process.stdout.write(output);
      }
    }

    // Update cached state
    this.lastRenderableZones = JSON.parse(JSON.stringify(currentZones));
  }

  private hasTerminalSizeChanged(currentZones: RenderableZone[]): boolean {
    if (this.lastRenderableZones.length !== currentZones.length) {
      return true;
    }

    // Check if any zone positions or sizes changed (indicates terminal resize)
    for (let i = 0; i < currentZones.length; i++) {
      const current = currentZones[i];
      const previous = this.lastRenderableZones[i];

      if (
        !previous ||
        current.x !== previous.x ||
        current.y !== previous.y ||
        current.width !== previous.width ||
        current.height !== previous.height
      ) {
        return true;
      }
    }

    return false;
  }

  private hasZoneChanged(
    current: RenderableZone,
    previous: RenderableZone
  ): boolean {
    // Quick check: if message array lengths differ, definitely changed
    if (current.messages.length !== previous.messages.length) {
      return true;
    }

    // If both arrays are empty, no change
    if (current.messages.length === 0 && previous.messages.length === 0) {
      return false;
    }

    // Compare messages efficiently by checking the last few messages
    // (since we typically only show the most recent messages)
    const messagesToCheck = Math.min(10, current.messages.length); // Check last 10 messages max
    const currentStart = current.messages.length - messagesToCheck;
    const previousStart = previous.messages.length - messagesToCheck;

    for (let i = 0; i < messagesToCheck; i++) {
      const currentMsg = current.messages[currentStart + i];
      const previousMsg = previous.messages[previousStart + i];

      if (
        !previousMsg ||
        !currentMsg ||
        currentMsg.message !== previousMsg.message ||
        currentMsg.level !== previousMsg.level ||
        currentMsg.timestamp !== previousMsg.timestamp
      ) {
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
    this.renderedZones.clear(); // Clear rendered zone tracking

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
    this.renderedZones.clear(); // Clear rendered zone tracking
  }
}
