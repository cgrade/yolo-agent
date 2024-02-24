export class PromiseSome {
    public static some<T>(promises: Promise<T>[], {counter = 1} = {counter: 1}): Promise<({ status: "fulfilled"; value: T; } | { status: "rejected"; reason: any; })[]> {

        return new Promise((resolve) => {

            let settled = [];
            counter = Math.min(Math.max(Math.floor(counter), 1), promises.length);

            if (!promises.length) {
                resolve(settled);
            }

            for (let i = 0; i < promises.length; i++) {
                promises[i]
                    .then(value => (settled.push({status: "fulfilled", value}) === counter) && resolve(settled))
                    .catch(reason => (settled.push({status: "rejected", reason}) === counter) && resolve(settled));
            }
        })
    }

    public static someRejected<T>(promises: Promise<T>[], {counter = 1, fn = null}: { counter?: number, fn?: (value: T) => boolean } = {
        counter: 1,
        fn: null
    }): Promise<({ status: "rejected"; reason: any; })[]> {

        return new Promise((resolve, reject) => {

            let resolved = [], rejected = [];

            if (!promises.length) {
                resolve(rejected);
            }
            counter = Math.min(Math.max(Math.floor(counter), 1), promises.length);

            let fnResolve = value => (resolved.push({status: "fulfilled", value}) + rejected.length === promises.length)
                && resolve(rejected);

            let fnReject = reason => (rejected.push({status: "rejected", reason}) === counter
                || resolved.length + rejected.length === promises.length) && resolve(rejected);

            for (let i = 0; i < promises.length; i++) {
                promises[i]
                    .then(value => fn ? (fn(value) ? fnResolve(value) : fnReject(value)) : fnResolve(value))
                    .catch(fnReject)
            }
        })
    }

    public static someResolved<T>(promises: Promise<T>[], {counter = 1, fn = null}: { counter?: number, fn?: (value: T) => boolean } = {
        counter: 1,
        fn: null
    }): Promise<({ status: "fulfilled"; value: T; })[]> {


        return new Promise((resolve, reject) => {

            let resolved = [], rejected = [];

            if (!promises.length) {
                resolve(resolved);
            }

            counter = Math.min(Math.max(Math.floor(counter), 1), promises.length);

            let fnResolve = value => (resolved.push({status: "fulfilled", value}) === counter
                || resolved.length + rejected.length === promises.length) && resolve(resolved);

            let fnReject = reason => (rejected.push({status: "rejected", reason}) + resolved.length === promises.length)
                && resolve(resolved);

            for (let i = 0; i < promises.length; i++) {
                promises[i]
                    .then(value => fn ? (fn(value) ? fnResolve(value) : fnReject(value)) : fnResolve(value))
                    .catch(fnReject)
            }
        })
    }
}
