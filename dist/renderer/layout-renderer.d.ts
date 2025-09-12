import type { Zone } from '../types.js';
import type { LogMessage } from '../events.js';
export declare class LayoutRenderer {
    private zones;
    private zoneMessages;
    private lastRenderableZones;
    private lastRenderOutput;
    private isInitialized;
    addZone(zone: Zone): void;
    removeZone(zoneName: string): void;
    clearZones(): void;
    addMessage(zoneName: string, message: LogMessage): void;
    render(): void;
    private renderDifferential;
    private hasTerminalSizeChanged;
    private hasZoneChanged;
    handleResize(): void;
    clear(): void;
}
//# sourceMappingURL=layout-renderer.d.ts.map