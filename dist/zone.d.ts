import type { Zone, Transport, ZoneConfig, ANSIColor } from './types.js';
export declare class ZoneImpl implements Zone {
    readonly name: string;
    readonly width: number;
    innerWidth: number;
    readonly height: number | 'auto';
    readonly showHeader: boolean;
    readonly transports: Transport[];
    readonly originalWidth: string | number | undefined;
    readonly borderColor: ANSIColor;
    constructor(config: ZoneConfig);
    private parseSize;
    private parseHeight;
    private createTransports;
    private log;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    debug(message: string): void;
    clear(): void;
    updateCalculatedDimensions(calculatedWidth: number): void;
    getName(): string;
    getConfig(): ZoneConfig;
}
//# sourceMappingURL=zone.d.ts.map