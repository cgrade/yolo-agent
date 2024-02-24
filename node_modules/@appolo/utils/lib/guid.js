"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guid = void 0;
const crypto = require("crypto");
const index_1 = require("../index");
class Guid {
    static shortGuid() {
        return ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
    }
    static s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    ;
    static guid() {
        return Guid.s4() + Guid.s4() + '-' + Guid.s4() + '-' + Guid.s4() + '-' + Guid.s4() + '-' + Guid.s4() + Guid.s4() + Guid.s4();
    }
    static uid(len = 11) {
        let alphaNumeric = "zyxwvutsrqponmlkjihgfedcba9876543210";
        let str = '';
        while (len--) {
            str += alphaNumeric[Math.random() * 36 | 0];
        }
        return str;
    }
    static nanoidUrl(size = 21) {
        return Guid.nanoid(size, "_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
    }
    static async nanoid(size = 21, alphabet = "0123456789abcdefghijklmnopqrstuvwxyz") {
        let mask = (2 << 31 - Math.clz32((alphabet.length - 1) | 1)) - 1, step = Math.ceil(1.6 * mask * size / alphabet.length);
        let id = '';
        let buffer = Buffer.allocUnsafe(step);
        while (true) {
            let bytes = await index_1.Promises.fromCallback(c => crypto.randomFill(buffer, c));
            let i = step;
            while (i--) {
                id += alphabet[bytes[i] & mask] || '';
                if (id.length === +size) {
                    return id;
                }
            }
        }
    }
}
exports.Guid = Guid;
//# sourceMappingURL=guid.js.map