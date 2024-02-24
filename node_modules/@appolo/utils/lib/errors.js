"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataError = exports.Errors = void 0;
const index_1 = require("../index");
class Errors {
    static stack() {
        let pst = Error.prepareStackTrace;
        Error.prepareStackTrace = function (_, stack) {
            Error.prepareStackTrace = pst;
            return stack;
        };
        let stack = (new Error()).stack;
        return stack;
    }
    static errorToString(err) {
        let output = "";
        if (!err) {
            return output;
        }
        return (err instanceof Error)
            ? err.stack || err.toString()
            : index_1.Objects.tryStringifyJSON(err);
    }
}
exports.Errors = Errors;
class DataError extends Error {
    constructor(message, data) {
        super(message);
        this._data = data;
        Object.setPrototypeOf(this, DataError.prototype);
    }
    get data() {
        return this._data;
    }
}
exports.DataError = DataError;
//# sourceMappingURL=errors.js.map