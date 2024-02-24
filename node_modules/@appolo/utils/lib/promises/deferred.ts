export class Deferred<T> {

    private _resolveSelf;
    private _rejectSelf;
    private readonly _promise: Promise<T>;

    constructor() {
        this._promise = new Promise((resolve, reject) => {
            this._resolveSelf = resolve;
            this._rejectSelf = reject;
        })
    }

    public get promise(): Promise<T> {
        return this._promise;
    }

    public resolve(val: T): void {
        this._resolveSelf(val)
    }

    public reject(reason: any): void {
        this._rejectSelf(reason)
    }

}
