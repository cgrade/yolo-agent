"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Objects = void 0;
const arrays_1 = require("./arrays");
const index_1 = require("../index");
const booleans_1 = require("./booleans");
class Objects {
    static isPlain(obj) {
        if (!Objects.isObject(obj)) {
            return false;
        }
        let ctor = obj.constructor;
        if (typeof ctor !== 'function') {
            return false;
        }
        let proto = ctor.prototype;
        if (!Objects.isObject(proto) || !proto.hasOwnProperty('isPrototypeOf')) {
            return false;
        }
        return true;
    }
    static isObject(val) {
        return val != null && typeof val === 'object' && Object.prototype.toString.call(val) === '[object Object]';
    }
    static isEmpty(obj) {
        return Object.keys(obj || {}).length === 0;
    }
    static replaceFormatJson(obj, data) {
        return JSON.parse(index_1.Strings.replaceFormatJson(JSON.stringify(obj), data));
    }
    static isBoolean(obj) {
        return booleans_1.Booleans.isBoolean(obj);
    }
    static isNullish(obj) {
        return obj === undefined || obj === null || Number.isNaN(obj);
    }
    static cloneFast(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    static invert(obj) {
        return Objects.invertBy(obj, (value) => value);
    }
    static invertBy(obj, criteria) {
        let output = Object.keys(obj || {}).reduce((output, key, index) => {
            let newKey = criteria(obj[key], key, index);
            output[newKey] = key;
            return output;
        }, {});
        return output;
    }
    static defaults(obj, ...args) {
        for (let i = 0, len = args.length; i < len; i++) {
            let arg = args[i];
            let keys = Object.keys(arg || {});
            for (let j = 0, len2 = keys.length; j < len2; j++) {
                let key = keys[j];
                if (!(key in obj) || (obj[key] === undefined && arg[key] != undefined)) {
                    obj[key] = arg[key];
                }
            }
        }
        return obj;
    }
    ;
    static defaultsDeep(obj, ...args) {
        for (let i = 0, len = args.length; i < len; i++) {
            let arg = args[i];
            let keys = Object.keys(arg || {});
            for (let j = 0, len2 = keys.length; j < len2; j++) {
                let key = keys[j], value = arg[key], source = obj[key];
                if (Objects.isPlain(value)) {
                    obj[key] = Objects.defaultsDeep({}, source, value);
                }
                else if (!(key in obj) || (source === undefined && value != undefined)) {
                    obj[key] = value;
                }
            }
        }
        return obj;
    }
    ;
    static cloneDeep(obj) {
        let isArray = Array.isArray(obj);
        if (!obj || !isArray && !Objects.isPlain(obj)) {
            return obj;
        }
        let output = isArray ? [] : {};
        let keys = Object.keys(obj || {});
        for (let i = 0, len = keys.length; i < len; i++) {
            let key = keys[i], value = obj[key];
            output[key] = (value !== null && value !== undefined)
                ? Objects.cloneDeep(value)
                : value;
        }
        return output;
    }
    static clone(obj) {
        if (!obj) {
            return obj;
        }
        let output = Array.isArray(obj) ? [] : {};
        let keys = Object.keys(obj || {});
        for (let i = 0, len = keys.length; i < len; i++) {
            let key = keys[i];
            output[key] = obj[key];
        }
        return output;
    }
    static compact(obj) {
        let output = {};
        let keys = Object.keys(obj || {});
        for (let i = 0, length = keys.length; i < length; i++) {
            let key = keys[i], item = obj[key];
            if (!item && !(item == 0 || item == false)) {
                continue;
            }
            output[key] = item;
        }
        return output;
    }
    static tryParseJSON(jsonString) {
        let [err, output] = index_1.Functions.to(() => JSON.parse(jsonString));
        return err ? null : output;
    }
    static tryStringifyJSON(json) {
        let [err, str] = index_1.Functions.to(() => JSON.stringify(json));
        return err ? "" : str;
    }
    static pick(obj, ...pick) {
        let out = {};
        obj = obj || {};
        for (let i = 0; i < pick.length; i++) {
            let key = pick[i];
            if (key in obj) {
                out[key] = obj[key];
            }
        }
        return out;
    }
    static omit(obj, ...omit) {
        let out = {}, keys = Object.keys(obj || {}), omitIndex = arrays_1.Arrays.keyBy(omit);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (!omitIndex[key]) {
                out[key] = obj[key];
            }
        }
        return out;
    }
    static get(obj, path, defValue) {
        if (!path) {
            return undefined;
        }
        const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g);
        const result = pathArray.reduce((prevObj, key) => prevObj && prevObj[key], obj);
        return result === undefined ? defValue : result;
    }
    static set(obj, path, value) {
        if (!obj) {
            return;
        }
        const parts = path.split('.');
        let current = obj;
        for (let i = 0, len = parts.length; i < len - 1; i++) {
            const part = parts[i];
            if (!current[part]) {
                current[part] = {};
            }
            current = current[part];
        }
        current[parts[parts.length - 1]] = value;
    }
    static has(obj, key) {
        if (!obj || !key) {
            return false;
        }
        let keyParts = key.split('.');
        return !!obj && (keyParts.length > 1
            ? Objects.has(obj[key.split('.')[0]], keyParts.slice(1).join('.'))
            : Object.hasOwnProperty.call(obj, key));
    }
    static mapObject(obj, iteratee) {
        const memo = [];
        for (let k in obj) {
            if (obj.hasOwnProperty(k)) {
                const v = obj[k];
                memo.push(iteratee(v, k));
            }
        }
        return memo;
    }
}
exports.Objects = Objects;
//# sourceMappingURL=objects.js.map