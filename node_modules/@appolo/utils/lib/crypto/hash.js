"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hash = void 0;
const strings_1 = require("../strings");
const crypto_1 = require("crypto");
class Hash {
    static hash(value, algorithm = 'sha1', encoding = 'hex') {
        return (0, crypto_1.createHash)(algorithm).update(value).digest(encoding);
    }
    static hashPlainObject(obj, algorithm = 'sha1', encoding = 'hex') {
        return Hash.hash(strings_1.Strings.stringifyObjectValues(obj), algorithm, encoding);
    }
    static md5(str) {
        return Hash.hash(str, "md5", "hex");
    }
    static sha1(str) {
        return Hash.hash(str, "sha1");
    }
    static hashCode(s, prefix = "_") {
        let h = 0, l = s.length, i = 0;
        if (l > 0)
            while (i < l)
                h = (h << 5) - h + s.charCodeAt(i++) | 0;
        return prefix + h;
    }
    static hash8Hex(str) {
        let i, l, hval = 0x811c9dc5;
        for (i = 0, l = str.length; i < l; i++) {
            hval ^= str.charCodeAt(i);
            hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
        }
        return ("0000000" + (hval >>> 0).toString(16)).slice(-8);
    }
}
exports.Hash = Hash;
//# sourceMappingURL=hash.js.map