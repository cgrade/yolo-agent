"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.once = exports.on = void 0;
const util_1 = require("../util");
const consts_1 = require("../consts");
const routingKey_1 = require("../routingKey");
function on(dispatcher, eventDispatcherOptions, event, fn, scope, options) {
    if (Array.isArray(event)) {
        (options && options.saga)
            ? _handleSaga(event, dispatcher, fn, scope, options)
            : event.forEach(event => dispatcher.on(event, fn, scope, options));
        return;
    }
    let handler = _getHandler(dispatcher, event);
    handler.callbacks.unshift({
        fn: fn,
        scope: scope,
        options: Object.assign({ await: false, parallel: true, order: 0 }, eventDispatcherOptions, options)
    });
    if (options && options.order) {
        handler.callbacks.sort((a, b) => a.options.order - b.options.order);
    }
    if (!handler.isRoutingKey && routingKey_1.RoutingKey.isRoutingRoute(event)) {
        _handleRouting(dispatcher, handler, event);
    }
}
exports.on = on;
function once(eventDispatcher, event, fn, scope, options = {}) {
    if (fn) {
        return eventDispatcher.on(event, fn, scope, Object.assign(Object.assign({}, options), { once: true }));
    }
    return new Promise((resolve, reject) => {
        eventDispatcher.on(event, util_1.Util.timeoutFn(options.timeout, resolve, reject), scope, Object.assign(Object.assign({}, options), { once: true }));
    });
}
exports.once = once;
function _handleSaga(event, dispatcher, fn, scope, options) {
    let results = [];
    for (let i = 0; i < event.length; i++) {
        results[i] = [];
        dispatcher.on(event[i], util_1.Util.sagaFn(results, i, fn, scope), null, options);
    }
}
function _handleRouting(dispatcher, handler, event) {
    if (!dispatcher[consts_1.RoutingKeysSymbol]) {
        dispatcher[consts_1.RoutingKeysSymbol] = {};
        dispatcher[consts_1.RoutingKeysCacheSymbol] = [];
    }
    handler.isRoutingKey = true;
    dispatcher[consts_1.RoutingKeysSymbol][event] = { regex: routingKey_1.RoutingKey.createRegex(event), key: event, cache: {} };
    dispatcher[consts_1.RoutingKeysCacheSymbol] = Object.keys(dispatcher[consts_1.RoutingKeysSymbol]);
}
function _getHandler(dispatcher, event) {
    if (!dispatcher[consts_1.CallbacksSymbol]) {
        dispatcher[consts_1.CallbacksSymbol] = {};
    }
    let handler = dispatcher[consts_1.CallbacksSymbol][event];
    if (!handler) {
        handler = dispatcher[consts_1.CallbacksSymbol][event] = { callbacks: [], isRoutingKey: false, order: false };
    }
    return handler;
}
//# sourceMappingURL=on.js.map