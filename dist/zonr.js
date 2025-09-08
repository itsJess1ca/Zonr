import { ZoneManagerImpl } from './zone-manager.js';
import { LayoutRenderer } from './renderer/layout-renderer.js';
import { globalEventEmitter } from './events.js';
export default class Zonr {
    constructor() {
        this.zoneIndex = {};
        this.isRendered = false;
        this.renderTimeout = null;
        this.zones = new ZoneManagerImpl();
        this.renderer = new LayoutRenderer();
        // Listen for log events to update renderer
        globalEventEmitter.on((logMessage) => {
            this.renderer.addMessage(logMessage.zoneName, logMessage);
            this.scheduleRender();
        });
        // Override zones.add to update index and renderer
        const originalAdd = this.zones.add.bind(this.zones);
        this.zones.add = (config) => {
            const zone = originalAdd(config);
            this.zoneIndex[config.name] = zone;
            // Also add to this object for direct access
            this[config.name] = zone;
            // Add zone to renderer
            this.renderer.addZone(zone);
            // Debounce rendering to prevent multiple renders
            this.scheduleRender();
            return zone;
        };
        // Proxy to allow zonr["zoneName"] access
        return new Proxy(this, {
            get(target, prop) {
                if (typeof prop === 'string' && target.zoneIndex[prop]) {
                    return target.zoneIndex[prop];
                }
                return target[prop];
            }
        });
    }
    scheduleRender() {
        if (this.renderTimeout) {
            clearTimeout(this.renderTimeout);
        }
        this.renderTimeout = setTimeout(() => {
            this.renderUI();
            this.renderTimeout = null;
        }, 0);
    }
    renderUI() {
        const allZones = this.zones.list();
        if (allZones.length > 0) {
            this.renderer.render();
            if (!this.isRendered) {
                this.isRendered = true;
                // Set up signal handlers for clean exit
                this.setupSignalHandlers();
            }
        }
    }
    setupSignalHandlers() {
        const handleExit = () => {
            this.stop();
            process.exit(0);
        };
        process.on('SIGINT', handleExit);
        process.on('SIGTERM', handleExit);
    }
    stop() {
        if (this.renderTimeout) {
            clearTimeout(this.renderTimeout);
            this.renderTimeout = null;
        }
        this.renderer.clear();
        this.isRendered = false;
    }
}
//# sourceMappingURL=zonr.js.map