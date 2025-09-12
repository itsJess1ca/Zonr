import type { Transport, LogLevel } from '../types.js';
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
    filename: string;
    path: string;
    compress?: boolean | 'gzip' | Compressor;
    encoding?: BufferEncoding;
    history?: string;
    immutable?: boolean;
    initialRotation?: boolean;
    interval?: Interval;
    intervalUTC?: boolean;
    maxFiles?: number;
    maxSize?: FileSize;
    mode?: number;
    size?: FileSize;
}
export declare class FileTransport implements Transport {
    name: string;
    private logs;
    constructor(_options: FileTransportOptions);
    applyDefaults(options: FileTransportOptions): FileTransportOptions;
    write(message: string, level: LogLevel): void;
    getLogs(): JSONLogMessage[];
    clearLogs(): void;
}
export {};
//# sourceMappingURL=file-transport.d.ts.map