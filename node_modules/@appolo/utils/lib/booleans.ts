import {Arrays} from "./arrays";
import {Functions, Numbers, Strings} from "../index";

export class Booleans {


    public static isBoolean(obj: any): obj is boolean {
        return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
    }

    public static booleanify(obj: any): boolean {
        if (Booleans.isBoolean(obj)) {
            return obj;
        }

        if (Strings.isString(obj)) {
            return obj === "true";
        }

        if (Numbers.isNumber(obj)) {
            return obj === 1;
        }

        return false;
    }


}
