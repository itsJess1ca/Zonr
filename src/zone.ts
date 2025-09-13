import type {
  Zone,
  Transport,
  LogLevel,
  ZoneConfig,
  ANSIColor,
} from './types.js';
import { globalEventEmitter } from './events.js';

export class ZoneImpl implements Zone {
  public readonly name: string;
  public readonly width: number;
  public innerWidth: number;
  public readonly height: number | 'auto';
  public readonly showHeader: boolean;
  public readonly transports: Transport[];
  public readonly originalWidth: string | number | undefined;
  public readonly borderColor: ANSIColor = 'blue';

  constructor(config: ZoneConfig) {
    this.name = config.name;
    this.originalWidth = config.width;
    this.width = this.parseSize(config.width, 100);
    this.innerWidth = this.width - 4;
    this.height = this.parseHeight(config.height, config.showHeader);
    this.showHeader = config.showHeader !== false; // Default to true
    this.transports = this.createTransports(config.additionalTransports);
    if (config.borderColor) {
      (this as { borderColor: ANSIColor }).borderColor = config.borderColor;
    }
  }

  private parseSize(
    size: string | number | undefined,
    defaultValue: number
  ): number {
    if (typeof size === 'number') return size;
    if (typeof size === 'string') {
      if (size.endsWith('%')) {
        return (parseInt(size) * defaultValue) / 100;
      }
      return parseInt(size) || defaultValue;
    }
    return defaultValue;
  }

  private parseHeight(
    height: string | number | 'auto' | undefined,
    includeHeader: boolean = true
  ): number | 'auto' {
    if (height === 'auto') return 'auto';
    const minHeight = includeHeader ? 5 : 4; // 2 borders + 1 padding + 1 content + (1 header space if needed)
    if (typeof height === 'number') {
      return Math.max(height, minHeight);
    }
    if (typeof height === 'string') {
      if (height.endsWith('%')) {
        const terminalHeight = process.stdout.rows || 24;
        const calculated = (parseInt(height) * terminalHeight) / 100;
        return Math.max(calculated, minHeight);
      }
      const parsed = parseInt(height) || 10;
      return Math.max(parsed, minHeight);
    }
    return 10;
  }

  private createTransports(
    additionalTransports?: (string | Transport)[]
  ): Transport[] {
    const transports: Transport[] = [];

    if (!additionalTransports) {
      return transports;
    }

    for (const transport of additionalTransports) {
      if (typeof transport === 'string') {
        // Handle string-based transport creation for backward compatibility
        // For now, we'll skip string-based transports since they require factory implementation
        console.warn(
          `String-based transport "${transport}" is not yet implemented. Use Transport class instances instead.`
        );
      } else if (transport && typeof transport.write === 'function') {
        // It's already a Transport instance, use it directly
        transports.push(transport);
      } else {
        console.warn('Invalid transport provided:', transport);
      }
    }

    return transports;
  }

  private log(message: string, level: LogLevel): void {
    // Emit event for UI components
    globalEventEmitter.emit({
      message,
      level,
      timestamp: new Date(),
      zoneName: this.name,
    });

    // Also write to transports
    this.transports.forEach((transport) => {
      transport.write(message, level);
    });
  }

  info(message: string): void {
    this.log(message, 'info');
  }

  warn(message: string): void {
    this.log(message, 'warn');
  }

  error(message: string): void {
    this.log(message, 'error');
  }

  debug(message: string): void {
    this.log(message, 'debug');
  }

  clear(): void {
    globalEventEmitter.emit({
      message: '',
      level: 'clear',
      timestamp: new Date(),
      zoneName: this.name,
    });
  }

  // Update calculated dimensions after layout calculation
  updateCalculatedDimensions(calculatedWidth: number): void {
    this.innerWidth = calculatedWidth - 4; // Account for borders + padding
  }

  getName(): string {
    return this.name;
  }

  getConfig(): ZoneConfig {
    return {
      name: this.name,
      width: this.originalWidth,
      height: this.height,
      showHeader: this.showHeader,
      borderColor: this.borderColor,
    };
  }
}
