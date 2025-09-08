import type { Zone } from '../types.js';
import type { LogMessage } from '../events.js';
export declare class LayoutRenderer {
    private zones;
    private zoneMessages;
    private lastRender;
    addZone(zone: Zone): void;
    addMessage(zoneName: string, message: LogMessage): void;
    render(): void;
    clear(): void;
}
//# sourceMappingURL=layout-renderer.d.ts.map