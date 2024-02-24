import {Rsa} from "./rsa";
import {Aes} from "./aes";
import {Hash} from "./hash";
import {Salt} from "./salt";
import {Xor} from "./xor";

export class Crypto {
    public static get aes(): typeof Aes {
        return Aes
    }

    public static get rsa(): typeof Rsa {
        return Rsa
    }

    public static get hash(): typeof Hash {
        return Hash
    }

    public static get salt(): typeof Salt {
        return Salt
    }

    public static get xor(): typeof Xor {
        return Xor
    }


}
