"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crypto = void 0;
const rsa_1 = require("./rsa");
const aes_1 = require("./aes");
const hash_1 = require("./hash");
const salt_1 = require("./salt");
const xor_1 = require("./xor");
class Crypto {
    static get aes() {
        return aes_1.Aes;
    }
    static get rsa() {
        return rsa_1.Rsa;
    }
    static get hash() {
        return hash_1.Hash;
    }
    static get salt() {
        return salt_1.Salt;
    }
    static get xor() {
        return xor_1.Xor;
    }
}
exports.Crypto = Crypto;
//# sourceMappingURL=crypto.js.map