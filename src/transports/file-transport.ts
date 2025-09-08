import type { Transport, LogLevel } from '../types.js';
import fs from "node:fs";

interface JSONLogMessage {
  timestamp: string;
  level: LogLevel;
  message: string;
}
export type Compressor = (source: string, dest: string) => string;
export type Generator = (time: number | Date, index?: number) => string;
export type IntervalUnit = 'M' | 'd' | 'h' | 'm' | 's';
export type Interval = `${number}${IntervalUnit}`;

export type FileSizeUnit = 'B' | 'K' | 'M' | 'G';
export type FileSize = `${number}${FileSizeUnit}`;

export interface FileTransportOptions {
  filename: string; // Specifies the name of the file. Required.
  path: string // Specifies the base path for files. Required.
  compress?: boolean | 'gzip' | Compressor; // Specifies compression method of rotated files. Default: false.
  encoding?: BufferEncoding; //Specifies the default encoding. Default: 'utf8'.
  history?: string; // Specifies the history filename. Default: false.
  immutable?: boolean; // Never mutate file names. Default: false.
  initialRotation?: boolean; // Initial rotation based on not-rotated file timestamp. Default: false.
  interval?: Interval; // Specifies the time interval to rotate the file. Default: undefined.
  intervalUTC?: boolean; // Boundaries for rotation are computed in UTC. Default: false.
  maxFiles?: number; // Specifies the maximum number of rotated files to keep. Default: undefined.
  maxSize?: FileSize; // Specifies the maximum size of rotated files to keep. Default: undefined.
  mode?: number; // Forwarded to fs.createWriteStream. Default: 0o666.
  size?: FileSize; // Specifies the file size to rotate the file. Default: null.
}

export class FileTransport implements Transport {
  name = 'file';
  private logs: JSONLogMessage[] = [];

  constructor(options: FileTransportOptions) {

  }

  applyDefaults(options: FileTransportOptions): FileTransportOptions {
    const defaults: Partial<FileTransportOptions> = {
      compress: false,
      encoding: 'utf8',
      immutable: false,
      initialRotation: false,
      intervalUTC: false,
      maxFiles: 0,
      mode: 0o666,
    };
    return { ...defaults, ...options };
  }

  write(message: string, level: LogLevel): void {
    const timestamp = new Date().toISOString();
    const formattedMessage = {
      timestamp,
      level,
      message
  };
    this.logs.push(formattedMessage);
  }

  getLogs(): JSONLogMessage[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }
}