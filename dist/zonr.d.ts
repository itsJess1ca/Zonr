import { ZoneManagerImpl } from './zone-manager.js';
export default class Zonr {
    readonly zones: ZoneManagerImpl;
    private zoneIndex;
    private renderer;
    private isRendered;
    private renderTimeout;
    constructor();
    private scheduleRender;
    private renderUI;
    private setupSignalHandlers;
    stop(): void;
}
//# sourceMappingURL=zonr.d.ts.map