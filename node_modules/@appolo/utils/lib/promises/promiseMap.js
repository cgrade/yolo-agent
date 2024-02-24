"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseMap = void 0;
class PromiseMap {
    static map(iterable, mapper, options = { concurrency: Infinity }) {
        let concurrency = options.concurrency || Infinity;
        let params = { index: 0 }, results = [], iterator = iterable[Symbol.iterator](), promises = [];
        while (concurrency-- > 0) {
            let promise = PromiseMap._mapWrapper(mapper, iterator, results, params);
            if (!promise) {
                break;
            }
            promises.push(promise);
        }
        return Promise.all(promises).then(() => results);
    }
    static _mapWrapper(mapper, iterator, results, params) {
        let next = iterator.next();
        if (next.done) {
            return null;
        }
        let i = params.index++, mapped = mapper(next.value, i);
        return Promise.resolve(mapped).then(resolved => {
            results[i] = resolved;
            return PromiseMap._mapWrapper(mapper, iterator, results, params);
        });
    }
}
exports.PromiseMap = PromiseMap;
//# sourceMappingURL=promiseMap.js.map