"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoneStorage = void 0;
class ZoneStorage {
    constructor() {
        this._data = new Map();
    }
    set(key, value) {
        this._data.set(key, value);
    }
    get(key) {
        return this._data.get(key);
    }
    has(key) {
        return this._data.has(key);
    }
    delete(key) {
        return this._data.delete(key);
    }
    clear() {
        this._data.clear();
    }
}
exports.ZoneStorage = ZoneStorage;
//# sourceMappingURL=storage.js.map