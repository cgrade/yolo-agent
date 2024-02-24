"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reflector = void 0;
const index_1 = require("../index");
require("reflect-metadata");
class Reflector {
    static getFnMetadata(symbol, klass, defaultValue) {
        return Reflector.getMetadata(symbol, klass, undefined, defaultValue);
    }
    static getMetadata(symbol, klass, propertyName, defaultValue) {
        let value = Reflect.getOwnMetadata(symbol, klass, propertyName);
        if (value !== undefined) {
            return value;
        }
        if (Reflect.hasMetadata(symbol, klass, propertyName)) {
            value = index_1.Objects.cloneDeep(Reflect.getMetadata(symbol, klass, propertyName));
            Reflect.defineMetadata(symbol, value, klass, propertyName);
            return value;
        }
        if (defaultValue !== undefined) {
            value = defaultValue;
            Reflect.defineMetadata(symbol, value, klass, propertyName);
        }
        return value;
    }
    static getFnOwnMetadata(symbol, klass, defaultValue) {
        return Reflector.getOwnMetadata(symbol, klass, undefined, defaultValue);
    }
    static getOwnMetadata(symbol, klass, propertyName, defaultValue) {
        let value = Reflect.getOwnMetadata(symbol, klass, propertyName);
        if (!value && defaultValue != undefined) {
            value = defaultValue;
            Reflect.defineMetadata(symbol, value, klass, propertyName);
        }
        return value;
    }
    static findReflectData(symbol, exported) {
        for (let i = 0, len = (exported ? exported.length : 0); i < len; i++) {
            let result = Reflect.getOwnMetadata(symbol, exported[i].fn);
            if (result !== undefined) {
                return Object.assign(Object.assign({}, exported[i]), { metaData: result });
            }
        }
        return null;
    }
    static findAllReflectData(symbol, exported) {
        let results = [];
        for (let i = 0, len = (exported ? exported.length : 0); i < len; i++) {
            let result = Reflect.getOwnMetadata(symbol, exported[i].fn);
            if (result !== undefined) {
                results.push(Object.assign(Object.assign({}, exported[i]), { metaData: result }));
            }
        }
        return results;
    }
    static setMetadata(key, value, target, propertyKey) {
        if (propertyKey) {
            Reflect.defineMetadata(key, value, target.constructor, propertyKey);
        }
        else {
            Reflect.defineMetadata(key, value, target);
        }
    }
    static decorateMetadata(key, value) {
        return function (target, propertyKey) {
            Reflector.setMetadata(key, value, target, propertyKey);
        };
    }
}
exports.Reflector = Reflector;
//# sourceMappingURL=reflector.js.map