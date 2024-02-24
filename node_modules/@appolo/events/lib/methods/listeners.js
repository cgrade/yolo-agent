"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeListenersByScope = exports.removeAllListeners = exports.listenerCount = exports.hasListener = void 0;
const consts_1 = require("../consts");
const getRoutingKeys_1 = require("./getRoutingKeys");
function hasListener(eventDispatcher, event, fn, scope) {
    if (!eventDispatcher[consts_1.CallbacksSymbol]) {
        return false;
    }
    let handler = eventDispatcher[consts_1.CallbacksSymbol][event];
    let routingKeys = getRoutingKeys_1.getRoutingKeys(eventDispatcher, handler, event);
    if (routingKeys.length) {
        for (let i = 0, len = routingKeys.length; i < len; i++) {
            if (eventDispatcher.hasListener(routingKeys[i], fn, scope)) {
                return true;
            }
        }
    }
    if (!handler || !handler.callbacks.length) {
        return false;
    }
    if (arguments.length == 1 || !fn) {
        return true;
    }
    for (let i = handler.callbacks.length - 1; i >= 0; i--) {
        let callback = handler.callbacks[i];
        if (callback.fn === fn && (!scope || callback.scope === scope)) {
            return true;
        }
    }
    return false;
}
exports.hasListener = hasListener;
function listenerCount(eventDispatcher, event) {
    let handler = eventDispatcher[consts_1.CallbacksSymbol][event], sum = 0;
    let routingKeys = getRoutingKeys_1.getRoutingKeys(eventDispatcher, handler, event);
    if (routingKeys.length) {
        for (let i = 0, len = routingKeys.length; i < len; i++) {
            sum += eventDispatcher.listenerCount(routingKeys[i]);
        }
    }
    if (!handler) {
        return sum;
    }
    return sum + handler.callbacks.length;
}
exports.listenerCount = listenerCount;
function removeAllListeners(eventDispatcher) {
    let keys = Object.keys(eventDispatcher[consts_1.CallbacksSymbol] || {});
    for (let i = 0, length = keys.length; i < length; i++) {
        let handler = eventDispatcher[consts_1.CallbacksSymbol][keys[i]];
        handler.callbacks.length = 0;
    }
    eventDispatcher[consts_1.CallbacksSymbol] = {};
    eventDispatcher[consts_1.RoutingKeysSymbol] = undefined;
    eventDispatcher[consts_1.RoutingKeysCacheSymbol] = undefined;
}
exports.removeAllListeners = removeAllListeners;
function removeListenersByScope(eventDispatcher, scope) {
    let keys = Object.keys(eventDispatcher[consts_1.CallbacksSymbol] || {});
    for (let i = 0, length = keys.length; i < length; i++) {
        let handler = eventDispatcher[consts_1.CallbacksSymbol][keys[i]];
        for (let j = handler.callbacks.length - 1; j >= 0; j--) {
            let callback = handler.callbacks[j];
            if (callback.scope === scope) {
                handler.callbacks.splice(j, 1);
            }
        }
    }
}
exports.removeListenersByScope = removeListenersByScope;
//# sourceMappingURL=listeners.js.map