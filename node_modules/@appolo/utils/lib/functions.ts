import {Arrays} from "./arrays";

export class Functions {
    public static memoize(fn: Function, resolver?: (args?: any[]) => string | number) {
        let cache = {};
        return (...args) => {
            let key = resolver ? resolver(args) : args[0];
            if (cache.hasOwnProperty(key)) {
                return cache[key];
            }

            let result = fn.apply(this, args);

            cache[key] = result;

            return result;
        }

    }

    public static throttle(func: Function, timeFrame: number) {
        let lastTime = 0;
        return function () {

            let now = Date.now();

            if (now - lastTime >= timeFrame) {
                func.apply(this, arguments);
                lastTime = now;
            }
        };
    }

    public static debounce(func: Function, wait: number, immediate?: boolean) {
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

    public static isFunction(obj: any): obj is Function {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    };

    public static cloneFn<T>(orig: T): T {
        return Object.assign(Object.create(Object.getPrototypeOf(orig)), orig)

    }

    public static mixins(_klass: Function, mixins: Function | Function[]) {

        Arrays.arrayify<Function>(mixins).forEach(mixin => {
            Object.getOwnPropertyNames(mixin.prototype).forEach((name) => {
                if (["constructor"].indexOf(name) == -1) {
                    _klass.prototype[name] = mixin.prototype[name]
                }
            })
        });

    }

    public static to<T, K = any>(fn: Function): [K, T?] {
        try {
            return [null, fn()]
        } catch (e) {
            return [e]
        }
    }

    public static toNull<T>(fn: Function): T {
        try {
            return fn()
        } catch (e) {
            return null
        }
    }

    public static emptyFn() {

    }

}
