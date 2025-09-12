export class FileTransport {
    constructor(_options) {
        this.name = 'file';
        this.logs = [];
        // TODO: Implement file transport functionality
    }
    applyDefaults(options) {
        const defaults = {
            compress: false,
            encoding: 'utf8',
            immutable: false,
            initialRotation: false,
            intervalUTC: false,
            maxFiles: 0,
            mode: 0o666,
        };
        return { ...defaults, ...options };
    }
    write(message, level) {
        const timestamp = new Date().toISOString();
        const formattedMessage = {
            timestamp,
            level,
            message,
        };
        this.logs.push(formattedMessage);
    }
    getLogs() {
        return [...this.logs];
    }
    clearLogs() {
        this.logs = [];
    }
}
//# sourceMappingURL=file-transport.js.map