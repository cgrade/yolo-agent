"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainObject = void 0;
const objects_1 = require("./objects");
const chain_1 = require("./chain");
class ChainObject {
    constructor(_value) {
        this._value = _value;
    }
    pick(...pick) {
        this._value = objects_1.Objects.pick(this._value, ...pick);
        return this;
    }
    omit(...omit) {
        this._value = objects_1.Objects.omit(this._value, ...omit);
        return this;
    }
    invert() {
        this._value = objects_1.Objects.invert(this._value);
        return this;
    }
    replaceFormatJson(data) {
        this._value = objects_1.Objects.replaceFormatJson(this._value, data);
        return this;
    }
    defaults(...args) {
        this._value = objects_1.Objects.defaults(this._value, ...args);
        return this;
    }
    defaultsDeep(...args) {
        this._value = objects_1.Objects.defaultsDeep(this._value, ...args);
        return this;
    }
    cloneDeep(...args) {
        this._value = objects_1.Objects.cloneDeep(this._value);
        return this;
    }
    clone() {
        this._value = objects_1.Objects.clone(this._value);
        return this;
    }
    cloneFast() {
        this._value = objects_1.Objects.cloneFast(this._value);
        return this;
    }
    compact() {
        this._value = objects_1.Objects.compact(this._value);
        return this;
    }
    tryStringifyJSON() {
        return objects_1.Objects.tryStringifyJSON(this._value);
    }
    get(path, defValue) {
        return objects_1.Objects.get(this._value, path, defValue);
    }
    set(path, value) {
        objects_1.Objects.set(this._value, path, value);
        return this;
    }
    has(path) {
        return objects_1.Objects.has(this._value, path);
    }
    keys() {
        return new chain_1.Chain(Object.keys(this._value));
    }
    values() {
        return new chain_1.Chain(Object.values(this._value));
    }
    assign(...sources) {
        Object.assign(this._value, ...sources);
        return this;
    }
    forEach(criteria) {
        Object.keys(this._value).forEach(key => criteria(this._value[key], key));
        return this;
    }
    value() {
        return this._value;
    }
}
exports.ChainObject = ChainObject;
//# sourceMappingURL=chainObject.js.map