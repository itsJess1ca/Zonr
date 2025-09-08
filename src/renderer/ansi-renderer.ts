import stringWidth from 'string-width';

// ANSI escape sequences for terminal control
export class ANSIRenderer {
  static clearScreen() {
    return '\x1b[2J\x1b[H';
  }

  static moveCursor(row: number, col: number) {
    return `\x1b[${row + 1};${col + 1}H`;
  }

  static hideCursor() {
    return '\x1b[?25l';
  }

  static showCursor() {
    return '\x1b[?25h';
  }

  static setColor(color: string) {
    const colors: Record<string, string> = {
      black: '\x1b[30m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m',
      white: '\x1b[37m',
      gray: '\x1b[90m',
      reset: '\x1b[0m',
      bold: '\x1b[1m',
    };
    return colors[color] || colors.reset;
  }

  static drawBox(
    x: number,
    y: number,
    width: number,
    height: number,
    color?: string
  ) {
    let output = '';
    const colorCode = color ? this.setColor(color) : '';
    const resetCode = color ? this.setColor('reset') : '';

    // Box drawing characters
    const chars = {
      topLeft: '╭',
      topRight: '╮',
      bottomLeft: '╰',
      bottomRight: '╯',
      horizontal: '─',
      vertical: '│',
    };

    // Draw top border
    output += this.moveCursor(y, x);
    output += colorCode;
    output +=
      chars.topLeft + chars.horizontal.repeat(width - 2) + chars.topRight;
    output += resetCode;

    // Draw side borders and content area
    for (let i = 1; i < height - 1; i++) {
      output += this.moveCursor(y + i, x);
      output += colorCode + chars.vertical + resetCode;
      output += ' '.repeat(width - 2);
      output += colorCode + chars.vertical + resetCode;
    }

    // Draw bottom border
    output += this.moveCursor(y + height - 1, x);
    output += colorCode;
    output +=
      chars.bottomLeft + chars.horizontal.repeat(width - 2) + chars.bottomRight;
    output += resetCode;

    return output;
  }

  static drawText(
    x: number,
    y: number,
    text: string,
    color?: string,
    maxWidth?: number
  ) {
    let output = '';
    const colorCode = color ? this.setColor(color) : '';
    const resetCode = color ? this.setColor('reset') : '';

    // Handle wide characters properly - account for variation selectors
    let displayText = text;
    if (maxWidth) {
      const variationSelectorCount = (text.match(/\uFE0F/g) || []).length;
      const actualWidth = stringWidth(text) + variationSelectorCount;

      if (actualWidth > maxWidth) {
        // Truncate while accounting for wide characters
        let truncated = text;
        while (
          stringWidth(truncated + '...') +
            (truncated.match(/\uFE0F/g) || []).length >
            maxWidth &&
          truncated.length > 0
        ) {
          truncated = truncated.slice(0, -1);
        }
        displayText = truncated.length > 0 ? truncated + '...' : '...';
      }
    }

    output += this.moveCursor(y, x);
    output += colorCode + displayText + resetCode;

    return output;
  }

  static drawZoneHeader(
    x: number,
    y: number,
    title: string,
    width: number,
    color?: string
  ) {
    let output = '';
    const colorCode = color
      ? this.setColor(color) + this.setColor('bold')
      : this.setColor('bold');
    const resetCode = this.setColor('reset');

    // Position header over the top border
    const headerText = ` ${title} `;
    const headerWidth = stringWidth(headerText);
    const startPos = Math.max(0, Math.floor((width - headerWidth) / 2));

    output += this.moveCursor(y, x + startPos);
    output += colorCode + headerText + resetCode;

    return output;
  }

  static render(content: string) {
    process.stdout.write(content);
  }

  static getTerminalSize() {
    return {
      width: process.stdout.columns || 80,
      height: process.stdout.rows || 24,
    };
  }
}
