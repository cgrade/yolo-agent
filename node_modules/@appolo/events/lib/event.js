"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const eventDispatcher_1 = require("./eventDispatcher");
const util_1 = require("./util");
class Event {
    constructor(_opts) {
        this._opts = _opts;
        this.EVENT_NAME = "event";
        this._dispatcher = new eventDispatcher_1.EventDispatcher();
        this._opts = Object.assign({}, { await: false, parallel: true }, _opts);
    }
    static saga(events, fn, scope, options) {
        let results = [];
        for (let i = 0; i < events.length; i++) {
            results[i] = [];
            events[i].on(util_1.Util.sagaFn(results, i, fn, scope), null, options);
        }
    }
    static sagaOnce(events, fn, scope, options = {}) {
        if (fn) {
            return Event.saga(events, fn, scope, Object.assign(Object.assign({}, options), { once: true }));
        }
        return new Promise((resolve, reject) => {
            Event.saga(events, util_1.Util.timeoutFn(options.timeout, resolve, reject), scope, Object.assign(Object.assign({}, options), { once: true }));
        });
    }
    on(fn, scope, options = {}) {
        this._dispatcher.on(this.EVENT_NAME, fn, scope, Object.assign(Object.assign({}, this._opts), options));
    }
    un(fn, scope) {
        this._dispatcher.un(this.EVENT_NAME, fn, scope);
    }
    once(fn, scope, options = {}) {
        return this._dispatcher.once(this.EVENT_NAME, fn, scope, Object.assign(Object.assign({}, this._opts), options));
    }
    iterator(event, options) {
        return this._dispatcher.iterator(event, options);
    }
    fireEvent(payload) {
        this._dispatcher.fireEvent(this.EVENT_NAME, payload);
    }
    fireEventAsync(payload) {
        return this._dispatcher.fireEventAsync(this.EVENT_NAME, payload);
    }
    removeAllListeners() {
        this._dispatcher.removeAllListeners();
    }
    hasListener(fn, scope) {
        return this._dispatcher.hasListener(this.EVENT_NAME, fn, scope);
    }
    listenerCount() {
        return this._dispatcher.listenerCount(this.EVENT_NAME);
    }
}
exports.Event = Event;
//# sourceMappingURL=event.js.map