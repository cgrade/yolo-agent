"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Iterator = void 0;
const symbolAsyncIterator = Symbol.asyncIterator || '@@asyncIterator';
class Iterator {
    constructor(emitter, events, options = {}) {
        this._eventCount = 0;
        this._nextQueue = [];
        this._valueQueue = [];
        this._events = Array.isArray(events) ? events : [events];
        this._emitter = emitter;
        this._options = options;
        this._limit = options.limit || Infinity;
        this._done = this._limit <= 0;
    }
    iterate() {
        this._events.forEach(event => this._emitter.on(event, this._onEvent, this));
        let $self = this;
        let dto = {
            [symbolAsyncIterator]() {
                return this;
            },
            next: async () => {
                if ($self._valueQueue.length) {
                    let result = $self._valueQueue.shift();
                    return { value: result.value, done: false };
                }
                if ($self._done) {
                    return { value: undefined, done: true };
                }
                return new Promise((resolve, reject) => $self._nextQueue.push({ resolve, reject }));
            },
            return: async (value) => {
                this._cancel();
                return { done: this._done, value };
            },
            throw: async (error) => {
                this._cancel();
                return {
                    done: this._done,
                    value: Promise.reject(error)
                };
            }
        };
        return dto;
    }
    _onEvent(value) {
        this._eventCount++;
        if (this._limit <= this._eventCount) {
            this._done = true;
        }
        if (this._nextQueue.length) {
            const result = this._nextQueue.shift();
            result.resolve({ done: false, value });
        }
        else {
            this._valueQueue.push({ value });
        }
        if (this._done) {
            this._cancel();
        }
    }
    _cancel() {
        this._events.forEach(event => this._emitter.un(event, this._onEvent, this));
        while (this._nextQueue.length > 0) {
            const result = this._nextQueue.shift();
            result.resolve({ done: true, value: undefined });
        }
        this._nextQueue.length = 0;
        // this._valueQueue.length = 0;
    }
}
exports.Iterator = Iterator;
//# sourceMappingURL=iterator.js.map