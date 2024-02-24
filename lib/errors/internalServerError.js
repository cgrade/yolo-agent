"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = void 0;
const httpError_1 = require("./httpError");
class InternalServerError extends httpError_1.HttpError {
    constructor(error, data, code) {
        super(500, "Internal Server Error", error, data, code);
        this.error = error;
        this.data = data;
        this.code = code;
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
}
exports.InternalServerError = InternalServerError;
//# sourceMappingURL=internalServerError.js.map