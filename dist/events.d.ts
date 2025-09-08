export interface LogMessage {
    message: string;
    level: 'info' | 'warn' | 'error' | 'debug' | 'clear';
    timestamp: Date;
    zoneName: string;
}
export declare class ZoneEventEmitter {
    private listeners;
    on(listener: (message: LogMessage) => void): void;
    off(listener: (message: LogMessage) => void): void;
    emit(message: LogMessage): void;
}
export declare const globalEventEmitter: ZoneEventEmitter;
//# sourceMappingURL=events.d.ts.map