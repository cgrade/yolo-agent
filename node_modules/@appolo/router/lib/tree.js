"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tree = void 0;
const enums_1 = require("./enums");
const leaf_1 = require("./leaf");
class Tree extends leaf_1.Leaf {
    constructor(options) {
        super("", options);
        this.Type = enums_1.LeafType.Tree;
    }
    check(parts, index, params) {
        return this._checkLeafs(parts, index, params);
    }
    remove(parts, index = 0) {
        for (let j = 0; j < this._numLeafs; j++) {
            this._leafs[j].remove(parts, index);
        }
    }
}
exports.Tree = Tree;
//# sourceMappingURL=tree.js.map