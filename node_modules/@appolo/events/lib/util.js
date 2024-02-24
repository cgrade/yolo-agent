"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
class Util {
    static timeoutFn(timeout, resolve, reject) {
        let timeoutInterval = timeout ? setTimeout(() => reject(new Error("timeout")), timeout) : null;
        let fn = (...args) => {
            clearTimeout(timeoutInterval);
            resolve(args.length > 1 ? args : args[0]);
        };
        return fn;
    }
    static sagaFn(results, i, fn, scope) {
        let sagaFn = function () {
            results[i].push(Array.from(arguments));
            if (results.every(index => index[0] !== undefined)) {
                let args = results.map(index => index.shift());
                fn.apply(scope, args.reduce((acc, val) => acc.concat(val), []));
            }
        };
        fn["@__eventDispatcher__"] = sagaFn;
        return sagaFn;
    }
}
exports.Util = Util;
//# sourceMappingURL=util.js.map