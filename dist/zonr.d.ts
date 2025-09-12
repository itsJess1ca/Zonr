import type { ZoneConfig, Zone } from './types.js';
import { ZoneManagerImpl } from './zone-manager.js';
export default class Zonr {
    readonly zones: ZoneManagerImpl;
    private zoneIndex;
    private renderer;
    private isRendered;
    private renderTimeout;
    private lastTerminalSize;
    private resizeCheckInterval;
    constructor();
    private scheduleRender;
    private renderUI;
    private setupResizeHandler;
    private setupResizePolling;
    private checkForResizeChange;
    private handleTerminalResize;
    private setupSignalHandlers;
    addZone(config: ZoneConfig): Zone;
    getZone(name: string): Zone | undefined;
    hasZone(name: string): boolean;
    removeZone(nameOrZone: string | Zone): boolean;
    getAllZones(): Zone[];
    clearZones(): void;
    stop(): void;
}
//# sourceMappingURL=zonr.d.ts.map