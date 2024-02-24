"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const utils_1 = require("@appolo/utils");
class ErrorHandler {
    static getStatusCode(err) {
        if ((err.status >= 400 && err.status < 600)) {
            return err.status;
        }
        if (err.statusCode >= 400 && err.statusCode < 600) {
            return err.statusCode;
        }
        return 500;
    }
    static getErrorMessage(e, statusCode, errorMessage, errorStack) {
        let dto = {
            statusCode: statusCode
        };
        dto.message = e.message;
        if (utils_1.Objects.isPlain(e.data)) {
            Object.assign(dto, e.data);
        }
        if (e.code) {
            dto.code = e.code;
        }
        if (e.error) {
            if (errorMessage) {
                dto.error = e.error.message || e.error.toString();
            }
            if (errorStack && e.error.stack) {
                dto.error = e.error.stack;
            }
            if (e.error.code && !dto.code) {
                dto.code = e.error.code;
            }
        }
        return dto;
    }
}
exports.ErrorHandler = ErrorHandler;
//# sourceMappingURL=errorHandler.js.map