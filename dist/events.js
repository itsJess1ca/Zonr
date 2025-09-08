export class ZoneEventEmitter {
    constructor() {
        this.listeners = [];
    }
    on(listener) {
        this.listeners.push(listener);
    }
    off(listener) {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }
    emit(message) {
        this.listeners.forEach(listener => listener(message));
    }
}
export const globalEventEmitter = new ZoneEventEmitter();
//# sourceMappingURL=events.js.map