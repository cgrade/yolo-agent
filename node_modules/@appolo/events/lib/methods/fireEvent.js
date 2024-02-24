"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._fireEvent = exports.fireEventAsync = exports.fireEvent = void 0;
const consts_1 = require("../consts");
const getRoutingKeys_1 = require("./getRoutingKeys");
function fireEvent(eventDispatcher, event, args) {
    let result = _fireEvent(eventDispatcher, event, args);
    if (!result) {
        return;
    }
    let callbacks = result.callbacks.concat(result.parallelPromises, result.serialPromises);
    for (let i = 0; i < callbacks.length; i++) {
        let callback = callbacks[i];
        callback.callback.fn.apply(callback.callback.scope, callback.args);
    }
}
exports.fireEvent = fireEvent;
async function fireEventAsync(eventDispatcher, event, args) {
    let result = _fireEvent(eventDispatcher, event, args);
    if (!result) {
        return;
    }
    if (result.serialPromises.length) {
        for (let callback of result.serialPromises) {
            await callback.callback.fn.apply(callback.callback.scope, callback.args);
        }
    }
    if (result.parallelPromises.length) {
        await Promise.all(result.parallelPromises.map(callback => callback.callback.fn.apply(callback.callback.scope, callback.args)));
    }
    if (result.callbacks.length) {
        for (let callback of result.callbacks) {
            callback.callback.fn.apply(callback.callback.scope, callback.args);
        }
    }
}
exports.fireEventAsync = fireEventAsync;
function _fireEvent(dispatcher, event, args) {
    if (!dispatcher[consts_1.CallbacksSymbol]) {
        return;
    }
    let handler = dispatcher[consts_1.CallbacksSymbol][event];
    let parallelPromises = [], serialPromises = [], callbacks = [];
    let routingKeys = getRoutingKeys_1.getRoutingKeys(dispatcher, handler, event);
    if (routingKeys.length) {
        _populateRoutingKeys(routingKeys, parallelPromises, dispatcher, args);
    }
    if (!handler) {
        return { callbacks, serialPromises, parallelPromises };
    }
    for (let i = handler.callbacks.length - 1; i >= 0; i--) {
        let callback = handler.callbacks[i];
        if (!callback || !callback.fn) {
            continue;
        }
        let arr = callback.options.await
            ? (callback.options.parallel ? parallelPromises : serialPromises)
            : callbacks;
        arr.push({ callback, args });
        if (callback.options.once) {
            _removeByIndex(handler, i, dispatcher, event);
        }
    }
    return { callbacks, serialPromises, parallelPromises };
}
exports._fireEvent = _fireEvent;
function _removeByIndex(handler, i, dispatcher, event) {
    handler.callbacks.splice(i, 1);
    if (!handler.callbacks.length && dispatcher[consts_1.RoutingKeysSymbol] && dispatcher[consts_1.RoutingKeysSymbol][event]) {
        dispatcher[consts_1.RoutingKeysSymbol][event] = undefined;
        dispatcher[consts_1.RoutingKeysCacheSymbol] = Object.keys(dispatcher[consts_1.RoutingKeysSymbol]);
    }
}
function _populateRoutingKeys(routingKeys, arr, dispatcher, args) {
    for (let i = 0, len = routingKeys.length; i < len; i++) {
        arr.push({
            callback: {
                fn: dispatcher.fireEvent,
                scope: dispatcher
            }, args: [routingKeys[i], ...args]
        });
    }
}
//# sourceMappingURL=fireEvent.js.map