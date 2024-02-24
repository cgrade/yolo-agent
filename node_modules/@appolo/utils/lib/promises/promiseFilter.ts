import {IterateFunction, Resolvable} from "./interfaces";

export class PromiseFilter {
    public static filter<R, U>(iterable: Resolvable<Iterable<Resolvable<R>>>, filterer: IterateFunction<R, U>, options: { concurrency: number } = {concurrency: Infinity}): Promise<U[]> {
        let concurrency = options.concurrency || Infinity;

        let params = {index: 0}, results = [], predicates = [], iterator = iterable[Symbol.iterator](), promises = [];

        while (concurrency-- > 0) {
            let promise = PromiseFilter._filterWrapper(filterer, iterator, results, predicates, params);

            if (!promise) {
                break
            }

            promises.push(promise);
        }

        return Promise.all(promises).then(() => results.filter((v, i) => predicates[i]));
    }

    private static _filterWrapper<R, U>(filterer: IterateFunction<R, U>, iterator: IterableIterator<R>, results: any[], predicates: any[], params: { index: number }) {
        let next = iterator.next();
        if (next.done) {
            return null
        }

        let i = params.index++;

        results.push(next.value);

        let predicate = filterer(next.value, i);

        return Promise.resolve(predicate).then(resolved => {
            predicates[i] = resolved;
            return PromiseFilter._filterWrapper(filterer, iterator, results, predicates, params)
        })
    }
}
