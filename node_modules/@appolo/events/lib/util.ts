"use strict";

export class Util {

    public static timeoutFn(timeout: number, resolve: (value?: (PromiseLike<any> | any)) => void, reject: (e?: Error) => void) {

        let timeoutInterval = timeout ? setTimeout(() => reject(new Error("timeout")), timeout) : null;

        let fn = (...args: any[]) => {
            clearTimeout(timeoutInterval);
            resolve(args.length > 1 ? args : args[0])
        };
        return fn;
    }

    public static sagaFn(results: any[][], i: number, fn: (...args: any[]) => any, scope: any) {
        let sagaFn = function () {
            results[i].push(Array.from(arguments))
            if (results.every(index => index[0] !== undefined)) {
                let args = results.map(index => index.shift());
                fn.apply(scope, args.reduce((acc, val) => acc.concat(val), []))
            }
        }

        fn["@__eventDispatcher__"] = sagaFn;
        return sagaFn;
    }
}
