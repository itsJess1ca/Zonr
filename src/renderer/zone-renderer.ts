import stringWidth from 'string-width';
import { ANSIRenderer } from './ansi-renderer.js';
import type { Zone } from '../types.js';
import type { LogMessage } from '../events.js';

export interface RenderableZone {
  zone: Zone;
  x: number;
  y: number;
  width: number;
  height: number;
  messages: LogMessage[];
}

export class ZoneRenderer {
  private static getColorForLevel(level: string): string {
    switch (level) {
      case 'error': return 'red';
      case 'warn': return 'yellow';
      case 'debug': return 'gray';
      default: return 'white';
    }
  }

  private static getVisualWidth(text: string): number {
    // Account for variation selectors that render wider than string-width reports
    const variationSelectorCount = (text.match(/\uFE0F/g) || []).length;
    return stringWidth(text) + variationSelectorCount;
  }

  private static truncateText(text: string, maxWidth: number): string {
    const visualWidth = this.getVisualWidth(text);
    if (visualWidth <= maxWidth) return text;

    // Truncate while accounting for wide characters
    let truncated = text;
    while (this.getVisualWidth(truncated + '...') > maxWidth && truncated.length > 0) {
      truncated = truncated.slice(0, -1);
    }
    
    return truncated.length > 0 ? truncated + '...' : '...';
  }

  static renderZone(renderableZone: RenderableZone): string {
    const { zone, x, y, width, height, messages } = renderableZone;
    let output = '';

    // Hide cursor during zone update
    output += ANSIRenderer.hideCursor();

    // Draw the zone border
    output += ANSIRenderer.drawBox(x, y, width, height, zone.borderColor);

    // Draw the zone header if enabled
    if (zone.showHeader) {
      output += ANSIRenderer.drawZoneHeader(x, y, zone.name, width, 'cyan');
    }

    // Calculate content area
    const contentX = x + 2; // Account for left border + padding
    const contentY = y + (zone.showHeader ? 2 : 1); // Account for top border + header
    const contentWidth = width - 4; // Account for borders + padding
    const contentHeight = height - (zone.showHeader ? 3 : 2); // Account for borders + header

    // Clear content area first to prevent old text from showing
    for (let i = 0; i < contentHeight; i++) {
      output += ANSIRenderer.moveCursor(contentY + i, contentX);
      output += ' '.repeat(contentWidth);
    }

    // Render messages
    const maxMessages = Math.max(1, contentHeight);
    const messagesToShow = messages.slice(-maxMessages);

    messagesToShow.forEach((message, index) => {
      if (index < contentHeight) {
        const messageY = contentY + index;
        const truncatedText = this.truncateText(message.message, contentWidth);
        const color = this.getColorForLevel(message.level);
        
        output += ANSIRenderer.drawText(contentX, messageY, truncatedText, color, contentWidth);
      }
    });

    // Show cursor after zone update
    output += ANSIRenderer.showCursor();

    return output;
  }

  static renderFrame(zones: RenderableZone[]): string {
    let output = '';
    
    // Hide cursor during render
    output += ANSIRenderer.hideCursor();

    // Render all zones
    zones.forEach(zone => {
      output += this.renderZone(zone);
    });

    // Show cursor at the end
    output += ANSIRenderer.showCursor();

    return output;
  }
}