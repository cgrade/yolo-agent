"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeafFactory = void 0;
const util_1 = require("./util");
const regexLeaf_1 = require("./regexLeaf");
const paramLeaf_1 = require("./paramLeaf");
const staticLeaf_1 = require("./staticLeaf");
class LeafFactory {
    static createLeaf(part, parts, index, options) {
        if (util_1.Util.isRegex(part)) {
            return new regexLeaf_1.RegexLeaf(part, parts, index, options);
        }
        else if (util_1.Util.isParam(part)) {
            return new paramLeaf_1.ParamLeaf(part, options);
        }
        else {
            return new staticLeaf_1.StaticLeaf(part, options);
        }
    }
}
exports.LeafFactory = LeafFactory;
//# sourceMappingURL=leafFactory.js.map