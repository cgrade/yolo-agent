"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParamLeaf = void 0;
const enums_1 = require("./enums");
const leaf_1 = require("./leaf");
class ParamLeaf extends leaf_1.Leaf {
    constructor(part, options) {
        super(part, options);
        this.Type = enums_1.LeafType.Param;
        this._paramName = this._part.substr(1);
    }
    check(parts, index, params) {
        if (index == parts.length) {
            return null;
        }
        let part = parts[index];
        if (this._handler && index == parts.length - 1) {
            params[this._paramName] = this._options.decodeUrlParams ? decodeURIComponent(part) : part;
            return this;
        }
        let found = this._checkLeafs(parts, index, params);
        if (found) {
            params[this._paramName] = part;
            return found;
        }
    }
}
exports.ParamLeaf = ParamLeaf;
//# sourceMappingURL=paramLeaf.js.map