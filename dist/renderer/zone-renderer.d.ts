import type { Zone } from '../types.js';
import type { LogMessage } from '../events.js';
export interface RenderableZone {
    zone: Zone;
    x: number;
    y: number;
    width: number;
    height: number;
    messages: LogMessage[];
}
export declare class ZoneRenderer {
    private static getColorForLevel;
    private static getVisualWidth;
    private static truncateText;
    static renderZone(renderableZone: RenderableZone): string;
    static renderFrame(zones: RenderableZone[]): string;
}
//# sourceMappingURL=zone-renderer.d.ts.map