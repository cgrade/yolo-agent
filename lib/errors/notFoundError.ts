import {HttpError} from "./httpError";

export class NotFoundError extends HttpError {

    constructor(public error?: string | Error, public data?: any, public code?: number) {
        super(404, "Not Found", error, data, code);


        Object.setPrototypeOf(this, NotFoundError.prototype);

    }
}