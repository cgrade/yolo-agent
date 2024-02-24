"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Salt = void 0;
const crypto = require("crypto");
const util = require("util");
const pbkdf2Async = util.promisify(crypto.pbkdf2);
class Salt {
    static async hash(password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const derivedKey = await pbkdf2Async(password, salt, 2048, 32, 'sha512');
        const hash = derivedKey.toString('hex');
        return [salt, hash].join('$');
    }
    static async verify(password, hashed) {
        const originalHash = hashed.split('$')[1];
        const salt = hashed.split('$')[0];
        const derivedKey = await pbkdf2Async(password, salt, 2048, 32, 'sha512');
        const hash = derivedKey.toString('hex');
        return hash === originalHash;
    }
}
exports.Salt = Salt;
//# sourceMappingURL=salt.js.map