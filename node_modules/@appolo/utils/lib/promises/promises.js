"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Promises = void 0;
const deferred_1 = require("./deferred");
const promiseMap_1 = require("./promiseMap");
const promiseFilter_1 = require("./promiseFilter");
const promiseSome_1 = require("./promiseSome");
const time_1 = require("../time");
const promiseCreate_1 = require("./promiseCreate");
class Promises {
    static delay(delay) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }
    static map(iterable, mapper, options = { concurrency: Infinity }) {
        return promiseMap_1.PromiseMap.map(iterable, mapper, options);
    }
    static props(props, options = { concurrency: Infinity }) {
        const keys = Object.keys(props);
        const values = Object.values(props);
        return Promises.map(values, (item) => item, { concurrency: options.concurrency })
            .then(resolved => {
            const res = {};
            for (let i = 0, len = keys.length; i < len; i++) {
                res[keys[i]] = resolved[i];
            }
            return res;
        });
    }
    static filter(iterable, filterer, options = { concurrency: Infinity }) {
        return promiseFilter_1.PromiseFilter.filter(iterable, filterer, options);
    }
    static fromCallback(resolver) {
        return new Promise((resolve, reject) => {
            resolver((err, data) => {
                if (err == null) {
                    resolve(data);
                }
                else {
                    reject(err);
                }
            });
        });
    }
    static defer() {
        return new deferred_1.Deferred();
    }
    static async to(promise) {
        try {
            let result = await promise;
            return [null, result];
        }
        catch (e) {
            return [e];
        }
    }
    static async toNull(promise) {
        try {
            let result = await promise;
            return result;
        }
        catch (e) {
            return null;
        }
    }
    static allSettled(promises) {
        let settled = [];
        for (let i = 0; i < promises.length; i++) {
            let promise = promises[i]
                .then(value => ({ status: "fulfilled", value }))
                .catch(reason => ({ status: "rejected", reason }));
            settled.push(promise);
        }
        return Promise.all(settled);
    }
    static async allSettledSpread(promises) {
        let fulfilled = [], rejected = [];
        let results = await Promises.allSettled(promises);
        for (let i = 0; i < results.length; i++) {
            let item = results[i];
            if (item.status == "fulfilled") {
                fulfilled.push(item.value);
            }
            else {
                rejected.push(item.reason);
            }
        }
        return [fulfilled, rejected];
    }
    static some(promises, opts = {}) {
        return promiseSome_1.PromiseSome.some(promises, opts);
    }
    static someRejected(promises, opts = {}) {
        return promiseSome_1.PromiseSome.someRejected(promises, opts);
    }
    static someResolved(promises, opts = {}) {
        return promiseSome_1.PromiseSome.someResolved(promises, opts);
    }
    static isPromise(obj) {
        return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function' && typeof obj.catch === 'function';
    }
    static timeout(promise, timeout) {
        return Promises.promiseTimeout(promise, timeout);
    }
    static async retry(fn, options = 1, retryCount = 0) {
        let [err, result] = await Promises.to(fn());
        if (err == null) {
            return result;
        }
        if (typeof options == "number") {
            options = { retires: options };
        }
        retryCount++;
        if (retryCount > options.retires) {
            throw err;
        }
        let delay = time_1.Time.calcBackOff(retryCount, options);
        if (delay) {
            await Promises.delay(delay);
        }
        return Promises.retry(fn, options, retryCount);
    }
    static promiseTimeout(promise, timeout) {
        return new Promise((resolve, reject) => {
            let interval = setTimeout(() => reject(new Error("promise timeout")), timeout);
            promise
                .then(resolve)
                .catch(reject)
                .finally(() => clearTimeout(interval));
        });
    }
    static create(fn) {
        return new promiseCreate_1.PromiseCreate(fn);
    }
}
exports.Promises = Promises;
//# sourceMappingURL=promises.js.map