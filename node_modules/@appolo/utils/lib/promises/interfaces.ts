export interface PromiseFulfilledResult<T> {
    status: "fulfilled";
    value: T;
}

export interface PromiseRejectedResult {
    status: "rejected";
    reason: any;
}

export type PromiseSettledResult<T> = PromiseFulfilledResult<T> | PromiseRejectedResult;

export type Resolvable<R> = R | PromiseLike<R>
export type IterateFunction<T, R> = (item: T, index: number | string) => Resolvable<R>;

export interface IRetry {
    retires: number,
    max?: number,
    random?: number,
    min?: number,
    fixed?: number,
    linear?: number,
    exponential?: number
}
