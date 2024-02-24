"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticLeaf = void 0;
const enums_1 = require("./enums");
const leaf_1 = require("./leaf");
class StaticLeaf extends leaf_1.Leaf {
    constructor(part, options) {
        super(part, options);
        this.Type = enums_1.LeafType.Static;
    }
    check(parts, index, params) {
        let part = parts[index];
        if (part != this._part) {
            return null;
        }
        if (this._handler && index == parts.length - 1) {
            return this;
        }
        return this._checkLeafs(parts, index, params);
    }
}
exports.StaticLeaf = StaticLeaf;
//# sourceMappingURL=staticLeaf.js.map