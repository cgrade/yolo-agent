export class Enums {

    public static names(enm: any): string[] {
        return Enums.enumNames(enm)
    }

    public static enumNames(enm: any): string[] {
        let res = [], keys = Object.keys(enm || {}), i = 0, len = keys.length;

        for (; i < len; i++) {
            let key = keys[i];
            if (isNaN(key as any) && res.indexOf(key) === -1 && res.indexOf(enm[key]) === -1) {
                res.push(key);
            }
        }

        return res;
    }

    public static values<T = string | number>(enm: any): T[] {
        return Enums.enumValues(enm)
    }

    public static enumValues<T>(enm: any): T[] {
        let res = [], keys = Object.keys(enm || {}), i = 0, len = keys.length;

        for (; i < len; i++) {
            let key = keys[i];
            let useValue = enm[key] as any;

            if (!isNaN(key as any)) {
                useValue = +key;
            }

            if (res.indexOf(useValue) === -1 && res.indexOf(key) === -1) {
                res.push(useValue);
            }
        }

        return res;
    }
}
