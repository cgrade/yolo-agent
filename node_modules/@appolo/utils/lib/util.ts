import {Numbers} from "./numbers";
import {Arrays} from "./arrays";
import {Classes} from "./classes";
import {Guid} from "./guid";
import {Hash} from "./crypto/hash";
import {Objects} from "./objects";
import {Promises} from "./promises/promises";
import {Strings} from "./strings";
import {Time} from "./time";
import {Files} from "./files";
import {Enums} from "./enums";
import {Reflector} from "./reflector";
import {Functions} from "./functions";
import {Errors} from "./errors";
import {Crypto} from "./crypto/crypto";
import {Url} from "./url";
import {Ip} from "./ip";
import {Booleans} from "./booleans";

export class Util {
    public static get numbers(): typeof Numbers {
        return Numbers
    }

    public static get arrays(): typeof Arrays {
        return Arrays
    }

    public static get classes(): typeof Classes {
        return Classes
    }

    public static get guid(): typeof Guid {
        return Guid
    }

    public static get hash(): typeof Hash {
        return Hash
    }

    public static get objects(): typeof Objects {
        return Objects
    }

    public static get promises(): typeof Promises {
        return Promises
    }

    public static get strings(): typeof Strings {
        return Strings
    }

    public static get time(): typeof Time {
        return Time
    }

    public static get files(): typeof Files {
        return Files
    }

    public static get enums(): typeof Enums {
        return Enums
    }

    public static get functions(): typeof Functions {
        return Functions
    }

    public static get Reflector(): typeof Reflector {
        return Reflector
    }

    public static get errors(): typeof Errors {
        return Errors
    }

    public static get crypto(): typeof Crypto {
        return Crypto
    }

    public static get url(): typeof Url {
        return Url
    }

    public static get booleans(): typeof Booleans {
        return Booleans
    }

    public static get ip(): typeof Ip {
        return Ip
    }
}
