import type { ZoneManager, ZoneConfig, Zone } from './types.js';
import { ZoneImpl } from './zone.js';

export class ZoneManagerImpl implements ZoneManager {
  private zones = new Map<string, Zone>();

  add(config: ZoneConfig): Zone {
    if (this.zones.has(config.name)) {
      throw new Error(`Zone with name '${config.name}' already exists`);
    }

    const zone = new ZoneImpl(config);
    this.zones.set(config.name, zone);
    return zone;
  }

  get(name: string): Zone | undefined {
    return this.zones.get(name);
  }

  has(name: string): boolean {
    return this.zones.has(name);
  }

  remove(name: string): boolean {
    return this.zones.delete(name);
  }

  list(): Zone[] {
    return Array.from(this.zones.values());
  }
}
