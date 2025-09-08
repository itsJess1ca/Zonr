import type { ZoneManager, ZoneConfig, Zone } from './types.js';
export declare class ZoneManagerImpl implements ZoneManager {
    private zones;
    add(config: ZoneConfig): Zone;
    get(name: string): Zone | undefined;
    has(name: string): boolean;
    remove(name: string): boolean;
    list(): Zone[];
}
//# sourceMappingURL=zone-manager.d.ts.map