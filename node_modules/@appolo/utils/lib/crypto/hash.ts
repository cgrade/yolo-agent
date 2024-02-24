import {Strings} from '../strings';

import {BinaryLike, createHash} from "crypto";

export class Hash {

    public static hash(value: BinaryLike, algorithm: string = 'sha1', encoding: 'base64' | 'hex' = 'hex'): string {
        return createHash(algorithm).update(value).digest(encoding);
    }

    public static hashPlainObject(obj: { [index: string]: string | number | boolean }, algorithm: string = 'sha1', encoding: 'base64' | 'hex' = 'hex'): string {
        return Hash.hash(Strings.stringifyObjectValues(obj), algorithm, encoding);
    }

    public static md5(str: string): string {
        return Hash.hash(str, "md5", "hex");
    }


    public static sha1(str: string): string {
        return Hash.hash(str, "sha1");
    }

    public static hashCode(s: string, prefix: string = "_"): string {
        let h = 0, l = s.length, i = 0;
        if (l > 0)
            while (i < l)
                h = (h << 5) - h + s.charCodeAt(i++) | 0;
        return prefix + h;
    }

    public static hash8Hex(str: string) {
        let i: number, l: number, hval: number = 0x811c9dc5;

        for (i = 0, l = str.length; i < l; i++) {
            hval ^= str.charCodeAt(i);
            hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
        }

        return ("0000000" + (hval >>> 0).toString(16)).slice(-8);

    }
}
