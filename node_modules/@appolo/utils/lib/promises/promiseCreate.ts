import {IRetry} from "./interfaces";
import {Promises} from "./promises";

export class PromiseCreate<T> {
    constructor(private fn: () => Promise<T>) {
    }

    public timeout(timeout: number): this {
        let fn = this.fn;
        this.fn = () => Promises.timeout<T>(fn(), timeout)
        return this
    }

    public delay(time: number): this {
        let fn = this.fn;
        this.fn = () => Promises.delay(time).then(() => fn())
        return this
    }

    public retry(options: (number | IRetry) = 1): this {
        let fn = this.fn;
        this.fn = () => Promises.retry<T>(fn, options);
        return this;
    }

    public run(): Promise<T> {
        return this.fn();
    }

    public runTo<K = any>(): Promise<[K, T?]> {
        return Promises.to<T, K>(this.fn());
    }
}
