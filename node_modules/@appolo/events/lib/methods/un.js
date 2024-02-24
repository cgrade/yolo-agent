"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.un = void 0;
const consts_1 = require("../consts");
function un(eventDispatcher, event, fn, scope) {
    if (Array.isArray(event)) {
        event.forEach(event => eventDispatcher.un(event, fn["@__eventDispatcher__"] || fn, scope));
        return;
    }
    if (!eventDispatcher[consts_1.CallbacksSymbol]) {
        return;
    }
    let handler = eventDispatcher[consts_1.CallbacksSymbol][event];
    if (!handler || !handler.callbacks.length) {
        return;
    }
    for (let i = handler.callbacks.length - 1; i >= 0; i--) {
        let callback = handler.callbacks[i];
        if (callback.fn === fn && (scope ? callback.scope === scope : true)) {
            handler.callbacks.splice(i, 1);
        }
    }
    if (!handler.callbacks.length && eventDispatcher[consts_1.RoutingKeysSymbol] && eventDispatcher[consts_1.RoutingKeysSymbol][event]) {
        eventDispatcher[consts_1.RoutingKeysSymbol][event] = undefined;
        eventDispatcher[consts_1.RoutingKeysCacheSymbol] = Object.keys(eventDispatcher[consts_1.RoutingKeysSymbol]);
    }
}
exports.un = un;
//# sourceMappingURL=un.js.map