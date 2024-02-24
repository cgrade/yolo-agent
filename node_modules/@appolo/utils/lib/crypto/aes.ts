import crypto = require('crypto');

export class Aes {
    public static encrypt(key: string, value: string): string {
        if (typeof key !== 'string' || !key) {
            throw new TypeError('key must be not empty string');
        }
        if (typeof value !== 'string' || !value) {
            throw new TypeError('value must be a non empty string');
        }

        let sha256 = crypto.createHash('sha256');

        sha256.update(key);

        let iv = crypto.randomBytes(16);

        let cipher = crypto.createCipheriv("aes-256-ctr", sha256.digest(), iv);

        let cipherText = cipher.update(Buffer.from(value));

        let encrypted = Buffer.concat([iv, cipherText, cipher.final()]).toString('base64');

        return encrypted;
    }

    public static decrypt(key: string, encrypted: string): string {
        if (typeof key !== 'string' || !key) {
            throw new TypeError('key must be not empty string');
        }
        if (typeof encrypted !== 'string' || !encrypted) {
            throw new TypeError('encrypted must be not empty string');
        }

        let input = Buffer.from(encrypted, 'base64');

        if (input.length < 17) {
            throw new TypeError('invalid encrypted string');
        }

        let sha256 = crypto.createHash('sha256');
        sha256.update(key);

        let iv = input.slice(0, 16);
        let decipher = crypto.createDecipheriv("aes-256-ctr", sha256.digest(), iv);

        let cipherText = input.slice(16);

        let value = decipher.update(cipherText).toString() + decipher.final();

        return value;
    }
}
