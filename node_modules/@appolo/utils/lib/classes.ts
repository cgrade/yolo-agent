import {Arrays} from "./arrays";
import {Functions, Util} from "../index";

export class Classes {
    public static isClass(v: any): boolean {
        return typeof v === 'function' && v.name && /^\s*class\s+/.test(v.toString());
    }

    public static isFunction(obj: any): boolean {
        return Functions.isFunction(obj);
    };

    public static className(fn: Function): string {
        return fn.name.charAt(0).toLowerCase() + fn.name.slice(1)
    }

    public static functionArgsNames(func: ((...args: any[]) => any) | (new(...args: any[]) => any)) {

        const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        const ARGUMENT_NAMES = /([^\s,]+)/g;

        let fnStr = func.toString().replace(STRIP_COMMENTS, '');
        let args:any[] = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);

        if (args === null) {
            args = [];
        }

        args = Arrays.compact(args);

        return args;
    }

    public static getClassMethodsName(klass: (new(...args: any[]) => any)): string[] {
        let names = Object.getOwnPropertyNames(klass.prototype).filter(name => (name !== 'constructor' && typeof klass.prototype[name] === 'function'))

        return names;
    }

    public static classToPlain<T>(klass: T ): { [P in keyof T]: T[P] } {

        let dto = typeof klass["toJSON"] == "function" ? klass["toJSON"]() : JSON.parse(JSON.stringify(klass))

        return dto
    }

    public static plainToClassInstance<T>(instance: T, obj: { [P in keyof T]: T[P] }): T {

        if (typeof instance["formJSON"] == "function") {
            instance["formJSON"](obj);

            return instance;
        }

        let keys = Object.keys(obj);

        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (typeof instance[key] != "function") {
                instance[key] = obj[key];
            }
        }

        return instance;
    }

    public static plainToClass<T>(klass: { new(...args: any[]): T }, obj: { [P in keyof T]: T[P] }): T {

        let instance = new klass(obj);

        return Classes.plainToClassInstance(instance, obj)
    }
}
