import CallSite = NodeJS.CallSite;
import {Objects} from "../index";

export class Errors {
    public static stack(): CallSite[] {

        let pst = Error.prepareStackTrace;
        Error.prepareStackTrace = function (_, stack) {
            Error.prepareStackTrace = pst;
            return stack;
        };

        let stack = (new Error()).stack;

        return stack as any;
    }

    public static errorToString(err: Error): string {
        let output = "";

        if (!err) {
            return output
        }

        return (err instanceof Error)
            ? err.stack || err.toString()
            : Objects.tryStringifyJSON(err)

    }


}

export class DataError<T> extends Error {
    private readonly _data: T;

    constructor(message?: string, data?: T) {
        super(message);

        this._data = data;

        Object.setPrototypeOf(this, DataError.prototype);
    }

    public get data(): T {
        return this._data;
    }
}
