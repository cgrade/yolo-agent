"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegexLeaf = void 0;
const enums_1 = require("./enums");
const leaf_1 = require("./leaf");
const util_1 = require("./util");
const pathToRegexp = require("path-to-regexp");
class RegexLeaf extends leaf_1.Leaf {
    constructor(part, parts, index, options) {
        super(part, options);
        this.Type = enums_1.LeafType.Regex;
        let keys = [], keyFull = [];
        this._regex = pathToRegexp.pathToRegexp(util_1.Util.convertWildCard(this._part), keys);
        let fullPath = util_1.Util.joinByIndexWithWildCard(index, parts);
        this._regexFull = pathToRegexp.pathToRegexp(fullPath, keyFull);
        this._paramNames = keys.map(item => item.name);
        this._paramNamesFull = keyFull.map(item => item.name);
        this._isAny = part == "*";
    }
    check(parts, index, params) {
        // if (index == parts.length) {
        //     return this._handler ? this:null;
        // }
        let part = parts[index];
        // if(this._leafs.length == 0 && this._handler){
        //     return this._checkFullPath(index,parts,params)
        // }
        let regexMatch = this._isAny ? [] : this._regex.exec(part);
        if (!regexMatch) {
            return null;
        }
        if (this._handler && index == parts.length - 1) {
            this._addParams(params, this._paramNames, regexMatch);
            return this;
        }
        let found = this._checkLeafs(parts, index, params);
        if (found) {
            this._addParams(params, this._paramNames, regexMatch);
            return found;
        }
        if (regexMatch && this._handler) {
            return this._checkFullPath(index, parts, params);
        }
    }
    _checkFullPath(index, parts, params) {
        let regexMatch = this._regexFull.exec(util_1.Util.joinByIndex(index, parts));
        if (regexMatch) {
            this._addParams(params, this._paramNamesFull, regexMatch);
            return this;
        }
        return null;
    }
    _addParams(params, keys, values) {
        if (!values.length) {
            return;
        }
        let decode = this._options.decodeUrlParams;
        for (let i = 0, len = keys.length; i < len; i++) {
            params[keys[i]] = decode ? decodeURIComponent(values[i + 1]) : values[i + 1];
        }
    }
}
exports.RegexLeaf = RegexLeaf;
//# sourceMappingURL=regexLeaf.js.map