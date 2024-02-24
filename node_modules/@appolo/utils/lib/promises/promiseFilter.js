"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseFilter = void 0;
class PromiseFilter {
    static filter(iterable, filterer, options = { concurrency: Infinity }) {
        let concurrency = options.concurrency || Infinity;
        let params = { index: 0 }, results = [], predicates = [], iterator = iterable[Symbol.iterator](), promises = [];
        while (concurrency-- > 0) {
            let promise = PromiseFilter._filterWrapper(filterer, iterator, results, predicates, params);
            if (!promise) {
                break;
            }
            promises.push(promise);
        }
        return Promise.all(promises).then(() => results.filter((v, i) => predicates[i]));
    }
    static _filterWrapper(filterer, iterator, results, predicates, params) {
        let next = iterator.next();
        if (next.done) {
            return null;
        }
        let i = params.index++;
        results.push(next.value);
        let predicate = filterer(next.value, i);
        return Promise.resolve(predicate).then(resolved => {
            predicates[i] = resolved;
            return PromiseFilter._filterWrapper(filterer, iterator, results, predicates, params);
        });
    }
}
exports.PromiseFilter = PromiseFilter;
//# sourceMappingURL=promiseFilter.js.map