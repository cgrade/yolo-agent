"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
class HttpError extends Error {
    constructor(status, message, error, data, code) {
        super(message);
        this.status = status;
        this.error = error;
        this.data = data;
        this.code = code;
        this.__HttpError__ = true;
        this.statusCode = status;
        if (error && error.code && !this.code) {
            this.code = error.code;
        }
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}
exports.HttpError = HttpError;
//# sourceMappingURL=httpError.js.map