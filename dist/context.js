"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentZone = getCurrentZone;
exports.setCurrentZone = setCurrentZone;
exports.getCurrentZoneName = getCurrentZoneName;
let currentZone = null;
function getCurrentZone() {
    return currentZone;
}
function setCurrentZone(zone) {
    currentZone = zone;
}
function getCurrentZoneName() {
    return currentZone?.name ?? null;
}
//# sourceMappingURL=context.js.map