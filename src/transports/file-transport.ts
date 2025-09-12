import { join } from 'node:path';
import SonicBoom, { SonicBoomOpts } from 'sonic-boom';
import type { Transport, LogLevel } from '../types.js';

interface JSONLogMessage {
  timestamp: string;
  level: LogLevel;
  message: string;
}

export interface FileTransportOptions {
  // Support both patterns for flexibility
  filename?: string;
  path?: string;
  filePath?: string; // Alternative single-path option
  
  // File rotation options
  maxFiles?: number;
  maxSize?: string;
  
  // SonicBoom options
  encoding?: BufferEncoding;
  sync?: boolean;
  minLength?: number;
  retryEAGAIN?: SonicBoomOpts["retryEAGAIN"];
  onError?: (error: Error) => void;
  
  // High-volume logging options
  highVolume?: boolean; // Optimize for high-volume logging (larger buffer, sync mode)
}

export class FileTransport implements Transport {
  name = 'file';
  private stream: SonicBoom;
  private options: FileTransportOptions;
  private isDestroyed = false;

  constructor(options: FileTransportOptions) {
    this.options = this.applyDefaults(options);
    const filePath = this.getFilePath(options);
    
    try {
      this.stream = new SonicBoom({
        dest: filePath,
        append: true,
        sync: this.options.sync ?? false,
        minLength: this.options.minLength ?? 4096,
        retryEAGAIN: this.options.retryEAGAIN,
      });

      this.stream.on('error', (err: Error) => {
        const errorHandler = this.options.onError || ((error: Error) => {
          console.error(`FileTransport error: ${error.message}`);
        });
        errorHandler(err);
      });

      this.stream.on('ready', () => {
        // Stream is ready for writing
      });

      this.stream.on('drain', () => {
        // Buffered data has been written
      });

    } catch (error) {
      const err = error as Error;
      const errorHandler = this.options.onError || ((error: Error) => {
        console.error(`FileTransport initialization error: ${error.message}`);
      });
      errorHandler(err);
      throw err;
    }
  }

  private getFilePath(options: FileTransportOptions): string {
    if (options.filePath) {
      // Use the direct file path if provided
      return options.filePath;
    } else if (options.filename && options.path) {
      // Use path + filename combination
      return join(options.path, options.filename);
    } else {
      throw new Error('FileTransport requires either "filePath" or both "path" and "filename" options');
    }
  }

  private applyDefaults(options: FileTransportOptions): FileTransportOptions {
    const defaults: Partial<FileTransportOptions> = {
      encoding: 'utf8',
      sync: options.highVolume ? true : false, // Use sync mode for high-volume to prevent drops
      minLength: options.highVolume ? 8192 : 4096, // Larger buffer for high-volume (must be < 16384)
    };
    return { ...defaults, ...options };
  }

  write(message: string, level: LogLevel): void {
    if (this.isDestroyed) {
      console.warn('FileTransport: Attempt to write to destroyed transport');
      return;
    }

    try {
      const timestamp = new Date().toISOString();
      const logEntry: JSONLogMessage = {
        timestamp,
        level,
        message,
      };
      
      const formattedLine = JSON.stringify(logEntry) + '\n';
      this.stream.write(formattedLine);
    } catch (error) {
      const err = error as Error;
      const errorHandler = this.options.onError || ((error: Error) => {
        console.error(`FileTransport write error: ${error.message}`);
      });
      errorHandler(err);
    }
  }

  async flush(): Promise<void> {
    if (this.isDestroyed) {
      throw new Error('FileTransport: Cannot flush destroyed transport');
    }

    return new Promise((resolve, reject) => {
      this.stream.flush((err?: Error) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async close(): Promise<void> {
    if (this.isDestroyed) {
      return Promise.resolve();
    }

    this.isDestroyed = true;
    return this.stream.end();
  }

  destroy(): void {
    if (this.isDestroyed) {
      return;
    }

    this.isDestroyed = true;
    this.stream.destroy();
  }

  get destroyed(): boolean {
    return this.isDestroyed;
  }
}
