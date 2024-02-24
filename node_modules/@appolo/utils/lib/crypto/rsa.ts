import {KeyExportOptions} from "crypto";
import crypto = require("crypto");

export class Rsa {
    public static async generateRsaKeys(): Promise<{ privateKey: string, publicKey: string }> {

        return new Promise<{ privateKey: string, publicKey: string }>((resolve, reject) => {
            crypto.generateKeyPair('rsa', {modulusLength: 1024}, function (err, publicKey, privateKey) {
                if (err) {
                    return reject(err);
                }

                let exportOptions: KeyExportOptions<'pem'> = {
                    format: "pem",
                    type: "pkcs1"
                };

                resolve({
                    privateKey: privateKey.export(exportOptions).toString(),
                    publicKey: publicKey.export(exportOptions).toString()
                })
            })
        });
    }

    public static encrypt(publicKey: string | crypto.KeyObject, data: string): string {
        let key = publicKey instanceof crypto.KeyObject ? publicKey : crypto.createPublicKey(publicKey);

        return crypto.publicEncrypt(key, Buffer.from(data)).toString("base64");
    }

    public static decrypt(privateKey: string | crypto.KeyObject, encryptedValue: string): string {
        let key = privateKey instanceof crypto.KeyObject ? privateKey : crypto.createPrivateKey(privateKey);

        return crypto.privateDecrypt(key, Buffer.from(encryptedValue, "base64")).toString();
    }

    public static sign(privateKey: string | crypto.KeyObject, data: string): string {
        let key = privateKey instanceof crypto.KeyObject ? privateKey : crypto.createPrivateKey(privateKey);

        let sign = crypto.createSign('RSA-SHA256');
        sign.update(data);
        let signId = sign.sign(key, 'base64');

        return signId
    }

    public static verify(publicKey: string | crypto.KeyObject, signId: string, data: string): boolean {
        let key = publicKey instanceof crypto.KeyObject ? publicKey : crypto.createPublicKey(publicKey);

        const verify = crypto.createVerify('RSA-SHA256');
        verify.update(data);
        verify.end();

        let isValid = verify.verify(key, signId, "base64");

        return isValid
    }

    public static cleanPrivateKey(privateKey: string): string {
        return (privateKey || "").replace(/\s/g, "\n")
            .replace(/BEGIN\nRSA\nPRIVATE\nKEY/g, "BEGIN RSA PRIVATE KEY")
            .replace(/END\nRSA\nPRIVATE\nKEY/g, "END RSA PRIVATE KEY");
    }

    public static cleanPublicKey(privateKey: string): string {
        return (privateKey || "").replace(/\s/g, "\n")
            .replace(/BEGIN\nPUBLIC\nKEY/g, "BEGIN PUBLIC KEY")
            .replace(/END\nPUBLIC\nKEY/g, "END PUBLIC KEY");
    }


}
