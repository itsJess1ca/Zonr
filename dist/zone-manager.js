import { ZoneImpl } from './zone.js';
export class ZoneManagerImpl {
    constructor() {
        this.zones = new Map();
    }
    add(config) {
        if (this.zones.has(config.name)) {
            throw new Error(`Zone with name '${config.name}' already exists`);
        }
        const zone = new ZoneImpl(config);
        this.zones.set(config.name, zone);
        return zone;
    }
    get(name) {
        return this.zones.get(name);
    }
    has(name) {
        return this.zones.has(name);
    }
    remove(name) {
        return this.zones.delete(name);
    }
    list() {
        return Array.from(this.zones.values());
    }
}
//# sourceMappingURL=zone-manager.js.map