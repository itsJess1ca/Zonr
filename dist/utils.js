"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runInZone = runInZone;
function runInZone(zone, callback) {
    return zone.enter(callback);
}
//# sourceMappingURL=utils.js.map