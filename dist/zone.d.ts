import type { Zone, Transport, ZoneConfig } from './types.js';
export declare class ZoneImpl implements Zone {
    readonly name: string;
    readonly width: number;
    readonly innerWidth: number;
    readonly height: number | 'auto';
    readonly showHeader: boolean;
    readonly transports: Transport[];
    readonly originalWidth: string | number | undefined;
    readonly borderColor: string;
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
}
//# sourceMappingURL=zone.d.ts.map