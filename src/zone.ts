import type { Zone, Transport, LogLevel, ZoneConfig } from './types.js';
import { FileTransport } from './transports/file-transport.js';
import { globalEventEmitter } from './events.js';

export class ZoneImpl implements Zone {
  public readonly name: string;
  public readonly width: number;
  public readonly innerWidth: number;
  public readonly height: number | 'auto';
  public readonly showHeader: boolean;
  public readonly transports: Transport[];
  public readonly originalWidth: string | number | undefined;
  public readonly borderColor: string = "blue";

  constructor(config: ZoneConfig) {
    this.name = config.name;
    this.originalWidth = config.width;
    this.width = this.parseSize(config.width, 100);
    this.innerWidth = this.width - 4;
    this.height = this.parseHeight(config.height, config.showHeader);
    this.showHeader = config.showHeader !== false; // Default to true
    this.transports = this.createTransports(config.additionalTransports);
    if (config.borderColor) {
      this.borderColor = config.borderColor;
    }
  }

  private parseSize(size: string | number | undefined, defaultValue: number): number {
    if (typeof size === 'number') return size;
    if (typeof size === 'string') {
      if (size.endsWith('%')) {
        return parseInt(size) * defaultValue / 100;
      }
      return parseInt(size) || defaultValue;
    }
    return defaultValue;
  }

  private parseHeight(height: string | number | 'auto' | undefined, includeHeader: boolean = true): number | 'auto' {
    if (height === 'auto') return 'auto';
    const minHeight = includeHeader ? 5 : 4; // 2 borders + 1 padding + 1 content + (1 header space if needed)
    if (typeof height === 'number') {
      return Math.max(height, minHeight);
    }
    if (typeof height === 'string') {
      if (height.endsWith('%')) {
        const terminalHeight = process.stdout.rows || 24;
        const calculated = parseInt(height) * terminalHeight / 100;
        return Math.max(calculated, minHeight);
      }
      const parsed = parseInt(height) || 10;
      return Math.max(parsed, minHeight);
    }
    return 10;
  }

  private createTransports(additionalTransports?: string[]): Transport[] {
    const transports: Transport[] = [];
    return transports;
  }

  private log(message: string, level: LogLevel): void {
    // Emit event for UI components
    globalEventEmitter.emit({
      message,
      level,
      timestamp: new Date(),
      zoneName: this.name
    });

    // Also write to transports
    this.transports.forEach(transport => {
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
      zoneName: this.name
    });
  }
}