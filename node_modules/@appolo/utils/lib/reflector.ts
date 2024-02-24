import {Objects} from "../index";
import "reflect-metadata";

export class Reflector {

    public static getFnMetadata<T>(symbol: Symbol | string, klass: Function, defaultValue?: T): T {
        return Reflector.getMetadata(symbol, klass, undefined, defaultValue);
    }

    public static getMetadata<T>(symbol: Symbol | string, klass: Function, propertyName?: string, defaultValue?: T): T {

        let value = Reflect.getOwnMetadata(symbol, klass,propertyName);

        if (value !== undefined) {
            return value;
        }

        if (Reflect.hasMetadata(symbol, klass,propertyName)) {
            value = Objects.cloneDeep(Reflect.getMetadata(symbol, klass, propertyName));
            Reflect.defineMetadata(symbol, value, klass,propertyName);
            return value;
        }

        if (defaultValue !== undefined) {
            value = defaultValue;
            Reflect.defineMetadata(symbol, value, klass, propertyName);
        }

        return value
    }

    public static getFnOwnMetadata<T>(symbol: Symbol | string, klass: any, defaultValue?: T): T {
        return Reflector.getOwnMetadata(symbol, klass, undefined, defaultValue);
    }

    public static getOwnMetadata<T>(symbol: Symbol | string, klass: any, propertyName?: string, defaultValue?: T): T {

        let value = Reflect.getOwnMetadata(symbol, klass, propertyName);

        if (!value && defaultValue != undefined) {
            value = defaultValue;
            Reflect.defineMetadata(symbol, value, klass, propertyName);
        }

        return value
    }

    public static findReflectData<T, K extends { fn: Function }>(symbol: Symbol | string, exported: K[]): K & { metaData: T } {

        for (let i = 0, len = (exported ? exported.length : 0); i < len; i++) {
            let result = Reflect.getOwnMetadata(symbol, exported[i].fn);

            if (result !== undefined) {
                return {...exported[i], metaData: result}
            }
        }

        return null;
    }

    public static findAllReflectData<T, K extends { fn: Function }>(symbol: Symbol | string, exported: K[]): (K & { metaData: T })[] {

        let results = [];

        for (let i = 0, len = (exported ? exported.length : 0); i < len; i++) {
            let result = Reflect.getOwnMetadata(symbol, exported[i].fn);

            if (result !== undefined) {
                results.push({...exported[i], metaData: result})
            }
        }

        return results;
    }

    public static setMetadata(key: string | Symbol, value: any, target: any, propertyKey?: string) {
        if (propertyKey) {
            Reflect.defineMetadata(key, value, target.constructor, propertyKey)
        } else {
            Reflect.defineMetadata(key, value, target)

        }
    }


    public static decorateMetadata(key: string | Symbol, value: any) {
        return function (target: any, propertyKey?: string) {
            Reflector.setMetadata(key, value, target, propertyKey);
        }
    }
}
