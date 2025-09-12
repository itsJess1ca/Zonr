import { ZoneManagerImpl } from './zone-manager.js';
import { LayoutRenderer } from './renderer/layout-renderer.js';
import { globalEventEmitter } from './events.js';
export default class Zonr {
    constructor() {
        this.zoneIndex = {};
        this.isRendered = false;
        this.renderTimeout = null;
        this.lastTerminalSize = { width: 0, height: 0 };
        this.resizeCheckInterval = null;
        this.zones = new ZoneManagerImpl();
        this.renderer = new LayoutRenderer();
        // Listen for log events to update renderer
        globalEventEmitter.on((logMessage) => {
            this.renderer.addMessage(logMessage.zoneName, logMessage);
            this.scheduleRender();
        });
        // Listen for terminal resize events and set up Windows workaround
        this.setupResizeHandler();
        this.setupResizePolling();
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
            },
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
    setupResizeHandler() {
        process.stdout.on('resize', () => {
            this.handleTerminalResize();
        });
    }
    setupResizePolling() {
        // Workaround for Windows Terminal resize detection bug
        // https://github.com/microsoft/terminal/issues/3238
        this.resizeCheckInterval = setInterval(() => {
            this.checkForResizeChange();
        }, 100); // Check every 100ms
    }
    checkForResizeChange() {
        let currentSize;
        try {
            // Windows-specific workaround: call _refreshSize() before getWindowSize()
            if (process.platform === 'win32' &&
                typeof process.stdout._refreshSize === 'function') {
                process.stdout._refreshSize();
            }
            const windowSize = process.stdout.getWindowSize();
            currentSize = {
                width: windowSize[0],
                height: windowSize[1],
            };
        }
        catch (_e) {
            // Fallback to columns/rows if getWindowSize() fails
            currentSize = {
                width: process.stdout.columns || 80,
                height: process.stdout.rows || 24,
            };
        }
        if (currentSize.width !== this.lastTerminalSize.width ||
            currentSize.height !== this.lastTerminalSize.height) {
            this.handleTerminalResize();
        }
    }
    handleTerminalResize() {
        let currentSize;
        try {
            // Windows-specific workaround: call _refreshSize() before getWindowSize()
            if (process.platform === 'win32' &&
                typeof process.stdout._refreshSize === 'function') {
                process.stdout._refreshSize();
            }
            const windowSize = process.stdout.getWindowSize();
            currentSize = {
                width: windowSize[0],
                height: windowSize[1],
            };
        }
        catch (_e) {
            // Fallback to columns/rows if getWindowSize() fails
            currentSize = {
                width: process.stdout.columns || 80,
                height: process.stdout.rows || 24,
            };
        }
        // Always trigger resize handling on resize events (Windows compatibility)
        this.lastTerminalSize = currentSize;
        // Force a full re-render by clearing the renderer's cache
        this.renderer.handleResize();
        // Delay render to ensure terminal has settled after resize
        if (this.renderTimeout) {
            clearTimeout(this.renderTimeout);
        }
        this.renderTimeout = setTimeout(() => {
            this.renderUI();
            this.renderTimeout = null;
        }, 50);
    }
    setupSignalHandlers() {
        const handleExit = () => {
            this.stop();
            process.exit(0);
        };
        process.on('SIGINT', handleExit);
        process.on('SIGTERM', handleExit);
    }
    // Top-level zone management methods for cleaner API
    addZone(config) {
        return this.zones.add(config);
    }
    getZone(name) {
        return this.zones.get(name);
    }
    hasZone(name) {
        return this.zones.has(name);
    }
    removeZone(nameOrZone) {
        const name = typeof nameOrZone === 'string' ? nameOrZone : nameOrZone.getName();
        // Remove from renderer
        this.renderer.removeZone(name);
        // Remove from zone index
        delete this.zoneIndex[name];
        delete this[name];
        // Remove from zone manager
        const removed = this.zones.remove(name);
        // Re-render to update layout
        if (removed) {
            this.scheduleRender();
        }
        return removed;
    }
    getAllZones() {
        return this.zones.list();
    }
    clearZones() {
        // Clear all zones from renderer
        this.renderer.clearZones();
        // Clear zone index
        for (const name in this.zoneIndex) {
            delete this[name];
        }
        this.zoneIndex = {};
        // Clear zone manager
        const allZones = this.zones.list();
        allZones.forEach((zone) => this.zones.remove(zone.getName()));
        // Re-render
        this.scheduleRender();
    }
    stop() {
        if (this.renderTimeout) {
            clearTimeout(this.renderTimeout);
            this.renderTimeout = null;
        }
        if (this.resizeCheckInterval) {
            clearInterval(this.resizeCheckInterval);
            this.resizeCheckInterval = null;
        }
        this.renderer.clear();
        this.isRendered = false;
    }
}
//# sourceMappingURL=zonr.js.map