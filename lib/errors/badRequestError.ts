import {HttpError} from "./httpError";

export class BadRequestError extends HttpError {

    public statusCode: number;

    constructor(public error?: string | Error, public data?: any, public code?: number) {
        super(400, "Bad Request", error, data, code);


        Object.setPrototypeOf(this, BadRequestError.prototype);

    }
}