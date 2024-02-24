import {HttpError} from "./httpError";

export class UnauthorizedError extends HttpError {

    public statusCode: number;

    constructor(public error?: string | Error, public data?: any, public code?: number) {
        super(401, "Unauthorized", error, data, code);


        Object.setPrototypeOf(this, UnauthorizedError.prototype);

    }
}