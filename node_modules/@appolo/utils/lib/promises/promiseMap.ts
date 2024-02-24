import {IterateFunction, Resolvable} from "./interfaces";

export class PromiseMap {
    public static map<R, U>(iterable: Resolvable<Iterable<Resolvable<R>>>, mapper: IterateFunction<R, U>, options: { concurrency: number } = {concurrency: Infinity}): Promise<U[]> {

        let concurrency = options.concurrency || Infinity;

        let params = {index: 0}, results = [], iterator = iterable[Symbol.iterator](), promises = [];

        while (concurrency-- > 0) {
            let promise = PromiseMap._mapWrapper(mapper, iterator, results, params);

            if (!promise) {
                break;
            }

            promises.push(promise);
        }

        return Promise.all(promises).then(() => results);

    }

    private static _mapWrapper<R, U>(mapper: IterateFunction<R, U>, iterator: IterableIterator<R>, results: any[], params: { index: number }) {

        let next = iterator.next();

        if (next.done) {
            return null;
        }

        let i = params.index++, mapped = mapper(next.value, i);

        return Promise.resolve(mapped).then(resolved => {
            results[i] = resolved;
            return PromiseMap._mapWrapper(mapper, iterator, results, params)
        })
    }
}
