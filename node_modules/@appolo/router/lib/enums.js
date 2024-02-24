"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeafType = exports.Methods = void 0;
var Methods;
(function (Methods) {
    Methods["GET"] = "GET";
    Methods["POST"] = "POST";
    Methods["PUT"] = "PUT";
    Methods["PATCH"] = "PATCH";
    Methods["DELETE"] = "DELETE";
    Methods["HEAD"] = "HEAD";
    Methods["OPTIONS"] = "OPTIONS";
    Methods["PURGE"] = "PURGE";
})(Methods = exports.Methods || (exports.Methods = {}));
var LeafType;
(function (LeafType) {
    LeafType[LeafType["Tree"] = 0] = "Tree";
    LeafType[LeafType["Static"] = 1] = "Static";
    LeafType[LeafType["Param"] = 2] = "Param";
    LeafType[LeafType["Regex"] = 3] = "Regex";
})(LeafType = exports.LeafType || (exports.LeafType = {}));
//# sourceMappingURL=enums.js.map