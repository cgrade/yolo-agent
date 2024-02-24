"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booleans = void 0;
const index_1 = require("../index");
class Booleans {
    static isBoolean(obj) {
        return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
    }
    static booleanify(obj) {
        if (Booleans.isBoolean(obj)) {
            return obj;
        }
        if (index_1.Strings.isString(obj)) {
            return obj === "true";
        }
        if (index_1.Numbers.isNumber(obj)) {
            return obj === 1;
        }
        return false;
    }
}
exports.Booleans = Booleans;
//# sourceMappingURL=booleans.js.map