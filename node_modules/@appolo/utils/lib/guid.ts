import crypto = require('crypto')
import {Promises, Util} from "../index";


export class Guid {
    public static shortGuid(): string {
        return ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4)
    }

    private static s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };

    public static guid(): string {

        return Guid.s4() + Guid.s4() + '-' + Guid.s4() + '-' + Guid.s4() + '-' + Guid.s4() + '-' + Guid.s4() + Guid.s4() + Guid.s4();
    }

    public static uid(len:number = 11): string {
        let alphaNumeric = "zyxwvutsrqponmlkjihgfedcba9876543210"

        let str = '';
        while (len--) {
            str += alphaNumeric[Math.random() * 36 | 0];
        }
        return str;
    }


    public static nanoidUrl(size = 21): Promise<string> {

        return Guid.nanoid(size, "_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
    }

    public static async nanoid(size: number = 21, alphabet: string = "0123456789abcdefghijklmnopqrstuvwxyz"): Promise<string> {
        let mask = (2 << 31 - Math.clz32((alphabet.length - 1) | 1)) - 1,
            step = Math.ceil(1.6 * mask * size / alphabet.length);

        let id = '';
        let buffer = Buffer.allocUnsafe(step);

        while (true) {
            let bytes = await Promises.fromCallback(c => crypto.randomFill(buffer, c));
            let i = step;
            while (i--) {
                id += alphabet[bytes[i] & mask] || '';
                if (id.length === +size) {
                    return id
                }
            }
        }
    }
}


