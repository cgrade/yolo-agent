"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = void 0;
const httpError_1 = require("./httpError");
class BadRequestError extends httpError_1.HttpError {
    constructor(error, data, code) {
        super(400, "Bad Request", error, data, code);
        this.error = error;
        this.data = data;
        this.code = code;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}
exports.BadRequestError = BadRequestError;
//# sourceMappingURL=badRequestError.js.map