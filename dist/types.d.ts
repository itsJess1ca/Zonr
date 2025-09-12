export type ANSIColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'gray';
export interface ZoneConfig {
    name: string;
    width?: string | number;
    height?: string | number | 'auto';
    additionalTransports?: string[];
    showHeader?: boolean;
    borderColor?: ANSIColor;
}
export interface Zone {
    name: string;
    innerWidth: number;
    width: number;
    height: number | 'auto';
    showHeader: boolean;
    transports: Transport[];
    originalWidth: string | number | undefined;
    borderColor: ANSIColor;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    debug(message: string): void;
    clear(): void;
    updateCalculatedDimensions(calculatedWidth: number): void;
    getName(): string;
    getConfig(): ZoneConfig;
}
export interface Transport {
    name: string;
    write(message: string, level: LogLevel): void;
}
export type LogLevel = 'info' | 'warn' | 'error' | 'debug';
export interface ZoneManager {
    add(config: ZoneConfig): Zone;
    get(name: string): Zone | undefined;
    has(name: string): boolean;
    remove(name: string): boolean;
    list(): Zone[];
}
//# sourceMappingURL=types.d.ts.map