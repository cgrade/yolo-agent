"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = void 0;
const httpError_1 = require("./httpError");
class UnauthorizedError extends httpError_1.HttpError {
    constructor(error, data, code) {
        super(401, "Unauthorized", error, data, code);
        this.error = error;
        this.data = data;
        this.code = code;
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}
exports.UnauthorizedError = UnauthorizedError;
//# sourceMappingURL=unauthorizedError.js.map