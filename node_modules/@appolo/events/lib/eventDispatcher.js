"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDispatcher = void 0;
const iterator_1 = require("./iterator");
const consts_1 = require("./consts");
const fireEvent_1 = require("./methods/fireEvent");
const on_1 = require("./methods/on");
const un_1 = require("./methods/un");
const listeners_1 = require("./methods/listeners");
class EventDispatcher {
    constructor(_eventDispatcherOptions) {
        this._eventDispatcherOptions = _eventDispatcherOptions;
        this._eventDispatcherOptions = Object.assign({}, { await: false, parallel: true }, this._eventDispatcherOptions);
    }
    on(event, fn, scope, options) {
        return on_1.on(this, this._eventDispatcherOptions, event, fn, scope, options);
    }
    once(event, fn, scope, options = {}) {
        return on_1.once(this, event, fn, scope, options);
    }
    bubble(event, scope) {
        this.on(event, (...args) => scope.fireEvent(event, ...args));
    }
    un(event, fn, scope) {
        return un_1.un(this, event, fn, scope);
    }
    async fireEventAsync(event, ...args) {
        return fireEvent_1.fireEventAsync(this, event, args);
    }
    fireEvent(event, ...args) {
        return fireEvent_1.fireEvent(this, event, args);
    }
    removeListenersByScope(scope) {
        return listeners_1.removeListenersByScope(this, scope);
    }
    removeAllListeners() {
        return listeners_1.removeAllListeners(this);
    }
    hasListener(event, fn, scope) {
        return listeners_1.hasListener(this, event, fn, scope);
    }
    listenerCount(event) {
        return listeners_1.listenerCount(this, event);
    }
    iterator(event, options) {
        let iterator = new iterator_1.Iterator(this, event, options);
        return iterator.iterate();
    }
}
exports.EventDispatcher = EventDispatcher;
//# sourceMappingURL=eventDispatcher.js.map