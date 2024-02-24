"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rsa = void 0;
const crypto = require("crypto");
class Rsa {
    static async generateRsaKeys() {
        return new Promise((resolve, reject) => {
            crypto.generateKeyPair('rsa', { modulusLength: 1024 }, function (err, publicKey, privateKey) {
                if (err) {
                    return reject(err);
                }
                let exportOptions = {
                    format: "pem",
                    type: "pkcs1"
                };
                resolve({
                    privateKey: privateKey.export(exportOptions).toString(),
                    publicKey: publicKey.export(exportOptions).toString()
                });
            });
        });
    }
    static encrypt(publicKey, data) {
        let key = publicKey instanceof crypto.KeyObject ? publicKey : crypto.createPublicKey(publicKey);
        return crypto.publicEncrypt(key, Buffer.from(data)).toString("base64");
    }
    static decrypt(privateKey, encryptedValue) {
        let key = privateKey instanceof crypto.KeyObject ? privateKey : crypto.createPrivateKey(privateKey);
        return crypto.privateDecrypt(key, Buffer.from(encryptedValue, "base64")).toString();
    }
    static sign(privateKey, data) {
        let key = privateKey instanceof crypto.KeyObject ? privateKey : crypto.createPrivateKey(privateKey);
        let sign = crypto.createSign('RSA-SHA256');
        sign.update(data);
        let signId = sign.sign(key, 'base64');
        return signId;
    }
    static verify(publicKey, signId, data) {
        let key = publicKey instanceof crypto.KeyObject ? publicKey : crypto.createPublicKey(publicKey);
        const verify = crypto.createVerify('RSA-SHA256');
        verify.update(data);
        verify.end();
        let isValid = verify.verify(key, signId, "base64");
        return isValid;
    }
    static cleanPrivateKey(privateKey) {
        return (privateKey || "").replace(/\s/g, "\n")
            .replace(/BEGIN\nRSA\nPRIVATE\nKEY/g, "BEGIN RSA PRIVATE KEY")
            .replace(/END\nRSA\nPRIVATE\nKEY/g, "END RSA PRIVATE KEY");
    }
    static cleanPublicKey(privateKey) {
        return (privateKey || "").replace(/\s/g, "\n")
            .replace(/BEGIN\nPUBLIC\nKEY/g, "BEGIN PUBLIC KEY")
            .replace(/END\nPUBLIC\nKEY/g, "END PUBLIC KEY");
    }
}
exports.Rsa = Rsa;
//# sourceMappingURL=rsa.js.map