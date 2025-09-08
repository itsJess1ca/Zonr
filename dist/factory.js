"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createZone = createZone;
const zone_js_1 = require("./zone.js");
function createZone(name) {
    return new zone_js_1.ZoneImpl(name);
}
//# sourceMappingURL=factory.js.map