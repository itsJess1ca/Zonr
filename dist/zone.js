import { globalEventEmitter } from './events.js';
export class ZoneImpl {
    constructor(config) {
        this.borderColor = 'blue';
        this.name = config.name;
        this.originalWidth = config.width;
        this.width = this.parseSize(config.width, 100);
        this.innerWidth = this.width - 4;
        this.height = this.parseHeight(config.height, config.showHeader);
        this.showHeader = config.showHeader !== false; // Default to true
        this.transports = this.createTransports(config.additionalTransports);
        if (config.borderColor) {
            this.borderColor = config.borderColor;
        }
    }
    parseSize(size, defaultValue) {
        if (typeof size === 'number')
            return size;
        if (typeof size === 'string') {
            if (size.endsWith('%')) {
                return (parseInt(size) * defaultValue) / 100;
            }
            return parseInt(size) || defaultValue;
        }
        return defaultValue;
    }
    parseHeight(height, includeHeader = true) {
        if (height === 'auto')
            return 'auto';
        const minHeight = includeHeader ? 5 : 4; // 2 borders + 1 padding + 1 content + (1 header space if needed)
        if (typeof height === 'number') {
            return Math.max(height, minHeight);
        }
        if (typeof height === 'string') {
            if (height.endsWith('%')) {
                const terminalHeight = process.stdout.rows || 24;
                const calculated = (parseInt(height) * terminalHeight) / 100;
                return Math.max(calculated, minHeight);
            }
            const parsed = parseInt(height) || 10;
            return Math.max(parsed, minHeight);
        }
        return 10;
    }
    createTransports(_additionalTransports) {
        const transports = [];
        // TODO: Implement transport creation based on additionalTransports parameter
        return transports;
    }
    log(message, level) {
        // Emit event for UI components
        globalEventEmitter.emit({
            message,
            level,
            timestamp: new Date(),
            zoneName: this.name,
        });
        // Also write to transports
        this.transports.forEach((transport) => {
            transport.write(message, level);
        });
    }
    info(message) {
        this.log(message, 'info');
    }
    warn(message) {
        this.log(message, 'warn');
    }
    error(message) {
        this.log(message, 'error');
    }
    debug(message) {
        this.log(message, 'debug');
    }
    clear() {
        globalEventEmitter.emit({
            message: '',
            level: 'clear',
            timestamp: new Date(),
            zoneName: this.name,
        });
    }
    // Update calculated dimensions after layout calculation
    updateCalculatedDimensions(calculatedWidth) {
        this.innerWidth = calculatedWidth - 4; // Account for borders + padding
    }
    getName() {
        return this.name;
    }
    getConfig() {
        return {
            name: this.name,
            width: this.originalWidth,
            height: this.height,
            showHeader: this.showHeader,
            borderColor: this.borderColor,
        };
    }
}
//# sourceMappingURL=zone.js.map