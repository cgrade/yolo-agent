import {HttpError} from "./httpError";

export class InternalServerError extends HttpError {

    public statusCode: number;

    constructor(public error?: string | Error, public data?: any, public code?: number) {
        super(500, "Internal Server Error", error, data, code);


        Object.setPrototypeOf(this, InternalServerError.prototype);

    }
}