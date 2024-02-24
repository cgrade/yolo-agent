"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Classes = void 0;
const arrays_1 = require("./arrays");
const index_1 = require("../index");
class Classes {
    static isClass(v) {
        return typeof v === 'function' && v.name && /^\s*class\s+/.test(v.toString());
    }
    static isFunction(obj) {
        return index_1.Functions.isFunction(obj);
    }
    ;
    static className(fn) {
        return fn.name.charAt(0).toLowerCase() + fn.name.slice(1);
    }
    static functionArgsNames(func) {
        const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        const ARGUMENT_NAMES = /([^\s,]+)/g;
        let fnStr = func.toString().replace(STRIP_COMMENTS, '');
        let args = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
        if (args === null) {
            args = [];
        }
        args = arrays_1.Arrays.compact(args);
        return args;
    }
    static getClassMethodsName(klass) {
        let names = Object.getOwnPropertyNames(klass.prototype).filter(name => (name !== 'constructor' && typeof klass.prototype[name] === 'function'));
        return names;
    }
    static classToPlain(klass) {
        let dto = typeof klass["toJSON"] == "function" ? klass["toJSON"]() : JSON.parse(JSON.stringify(klass));
        return dto;
    }
    static plainToClassInstance(instance, obj) {
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
    static plainToClass(klass, obj) {
        let instance = new klass(obj);
        return Classes.plainToClassInstance(instance, obj);
    }
}
exports.Classes = Classes;
//# sourceMappingURL=classes.js.map