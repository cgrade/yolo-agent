import crypto = require('crypto');
import util = require('util');

const pbkdf2Async = util.promisify(crypto.pbkdf2);

export class Salt {
    public static async hash(password: string): Promise<string> {

        const salt = crypto.randomBytes(16).toString('hex');

        const derivedKey = await pbkdf2Async(password, salt, 2048, 32, 'sha512');

        const hash = derivedKey.toString('hex');

        return [salt, hash].join('$');
    }

    public static async verify(password: string, hashed: string): Promise<boolean> {

        const originalHash = hashed.split('$')[1];
        const salt = hashed.split('$')[0];
        const derivedKey = await pbkdf2Async(password, salt, 2048, 32, 'sha512');
        const hash = derivedKey.toString('hex');

        return hash === originalHash

    }
}
