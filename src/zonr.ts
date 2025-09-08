import type { ZoneConfig, Zone } from './types.js';
import { ZoneManagerImpl } from './zone-manager.js';
import { LayoutRenderer } from './renderer/layout-renderer.js';
import { globalEventEmitter } from './events.js';

export default class Zonr {
  public readonly zones: ZoneManagerImpl;
  private zoneIndex: { [name: string]: Zone } = {};
  private renderer: LayoutRenderer;
  private isRendered = false;
  private renderTimeout: NodeJS.Timeout | null = null;
  private lastTerminalSize = { width: 0, height: 0 };
  private resizeCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
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
    this.zones.add = (config: ZoneConfig) => {
      const zone = originalAdd(config);
      this.zoneIndex[config.name] = zone;
      // Also add to this object for direct access
      (this as any)[config.name] = zone;
      
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
        
        return (target as any)[prop];
      }
    });
  }

  private scheduleRender(): void {
    if (this.renderTimeout) {
      clearTimeout(this.renderTimeout);
    }
    
    this.renderTimeout = setTimeout(() => {
      this.renderUI();
      this.renderTimeout = null;
    }, 0);
  }

  private renderUI(): void {
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

  private setupResizeHandler(): void {
    process.stdout.on('resize', () => {
      this.handleTerminalResize();
    });
  }

  private setupResizePolling(): void {
    // Workaround for Windows Terminal resize detection bug
    // https://github.com/microsoft/terminal/issues/3238
    this.resizeCheckInterval = setInterval(() => {
      this.checkForResizeChange();
    }, 100); // Check every 100ms
  }

  private checkForResizeChange(): void {
    let currentSize: { width: number; height: number };
    
    try {
      // Windows-specific workaround: call _refreshSize() before getWindowSize()
      if (process.platform === 'win32' && typeof (process.stdout as any)._refreshSize === 'function') {
        (process.stdout as any)._refreshSize();
      }
      
      const windowSize = process.stdout.getWindowSize();
      currentSize = {
        width: windowSize[0],
        height: windowSize[1]
      };
    } catch (e) {
      // Fallback to columns/rows if getWindowSize() fails
      currentSize = {
        width: process.stdout.columns || 80,
        height: process.stdout.rows || 24
      };
    }

    if (currentSize.width !== this.lastTerminalSize.width || 
        currentSize.height !== this.lastTerminalSize.height) {
      this.handleTerminalResize();
    }
  }

  private handleTerminalResize(): void {
    let currentSize: { width: number; height: number };
    
    try {
      // Windows-specific workaround: call _refreshSize() before getWindowSize()
      if (process.platform === 'win32' && typeof (process.stdout as any)._refreshSize === 'function') {
        (process.stdout as any)._refreshSize();
      }
      
      const windowSize = process.stdout.getWindowSize();
      currentSize = {
        width: windowSize[0],
        height: windowSize[1]
      };
    } catch (e) {
      // Fallback to columns/rows if getWindowSize() fails
      currentSize = {
        width: process.stdout.columns || 80,
        height: process.stdout.rows || 24
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

  private setupSignalHandlers(): void {
    const handleExit = () => {
      this.stop();
      process.exit(0);
    };

    process.on('SIGINT', handleExit);
    process.on('SIGTERM', handleExit);
  }

  public stop(): void {
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