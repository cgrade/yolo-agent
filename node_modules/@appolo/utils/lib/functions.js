"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Functions = void 0;
const arrays_1 = require("./arrays");
class Functions {
    static memoize(fn, resolver) {
        let cache = {};
        return (...args) => {
            let key = resolver ? resolver(args) : args[0];
            if (cache.hasOwnProperty(key)) {
                return cache[key];
            }
            let result = fn.apply(this, args);
            cache[key] = result;
            return result;
        };
    }
    static throttle(func, timeFrame) {
        let lastTime = 0;
        return function () {
            let now = Date.now();
            if (now - lastTime >= timeFrame) {
                func.apply(this, arguments);
                lastTime = now;
            }
        };
    }
    static debounce(func, wait, immediate) {
        let timeout;
        return function () {
            let context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            }, wait);
            if (immediate && !timeout) {
                func.apply(context, args);
            }
        };
    }
    static isFunction(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    }
    ;
    static cloneFn(orig) {
        return Object.assign(Object.create(Object.getPrototypeOf(orig)), orig);
    }
    static mixins(_klass, mixins) {
        arrays_1.Arrays.arrayify(mixins).forEach(mixin => {
            Object.getOwnPropertyNames(mixin.prototype).forEach((name) => {
                if (["constructor"].indexOf(name) == -1) {
                    _klass.prototype[name] = mixin.prototype[name];
                }
            });
        });
    }
    static to(fn) {
        try {
            return [null, fn()];
        }
        catch (e) {
            return [e];
        }
    }
    static toNull(fn) {
        try {
            return fn();
        }
        catch (e) {
            return null;
        }
    }
    static emptyFn() {
    }
}
exports.Functions = Functions;
//# sourceMappingURL=functions.js.map