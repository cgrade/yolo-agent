"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._ = exports.Chain = void 0;
const arrays_1 = require("./arrays");
const chainObject_1 = require("./chainObject");
class Chain {
    constructor(_value) {
        this._value = _value;
    }
    arrayify(val) {
        this._value = arrays_1.Arrays.arrayify(this._value);
        return this;
    }
    clone() {
        this._value = arrays_1.Arrays.clone(this._value);
        return this;
    }
    compact() {
        this._value = arrays_1.Arrays.compact(this._value);
        return this;
    }
    removeBy(criteria) {
        arrays_1.Arrays.removeBy(this._value, criteria);
        return this;
    }
    remove(item) {
        arrays_1.Arrays.remove(this._value, item);
        return this;
    }
    chunk(size) {
        this._value = arrays_1.Arrays.chunk(this._value, size);
        return this;
    }
    flat() {
        this._value = arrays_1.Arrays.flat(this._value);
        return this;
    }
    flatDeep(depth = 1) {
        this._value = arrays_1.Arrays.flatDeep(this._value, depth);
        return this;
    }
    sortBy(criteria) {
        this._value = arrays_1.Arrays.sortBy(this._value, criteria);
        return this;
    }
    sort() {
        this._value = arrays_1.Arrays.sort(this._value);
        return this;
    }
    zip(...args) {
        this._value = arrays_1.Arrays.zip(this._value, ...args);
        return this;
    }
    uniqBy(criteria) {
        this._value = arrays_1.Arrays.uniqBy(this._value, criteria);
        return this;
    }
    uniq() {
        this._value = arrays_1.Arrays.uniq(this._value);
        return this;
    }
    sum() {
        return arrays_1.Arrays.sum(this._value);
    }
    sumBy(criteria) {
        return arrays_1.Arrays.sumBy(this._value, criteria);
    }
    difference(arr2) {
        this._value = arrays_1.Arrays.difference(this._value, arr2);
        return this;
    }
    differenceBy(arr2, criteria) {
        this._value = arrays_1.Arrays.differenceBy(this._value, arr2, criteria);
        return this;
    }
    map(predicate) {
        this._value = this._value.map(predicate);
        return this;
    }
    filter(predicate) {
        this._value = this._value.filter(predicate);
        return this;
    }
    find(predicate) {
        return this._value.find(predicate);
    }
    forEach(predicate) {
        this._value.forEach(predicate);
    }
    includes(searchElement, fromIndex) {
        return this._value.includes(searchElement, fromIndex);
    }
    indexOf(searchElement, fromIndex) {
        return this._value.indexOf(searchElement, fromIndex);
    }
    every(predicate) {
        return this._value.every(predicate);
    }
    some(predicate) {
        return this._value.some(predicate);
    }
    concat(...items) {
        this._value = this._value.concat(...items);
        return this;
    }
    shift() {
        return this._value.shift();
    }
    pop() {
        return this._value.pop();
    }
    length() {
        return this._value.length;
    }
    push(...items) {
        this._value.push(...items);
        return this;
    }
    unshift(...items) {
        this._value.unshift(...items);
        return this;
    }
    keyBy(key) {
        return arrays_1.Arrays.keyBy(this._value, key);
    }
    groupBy(key) {
        return arrays_1.Arrays.groupBy(this._value, key);
    }
    random() {
        return arrays_1.Arrays.random(this._value);
    }
    randomItems(count = 1) {
        return arrays_1.Arrays.randomItems(this._value, count);
    }
    value() {
        return this._value;
    }
}
exports.Chain = Chain;
function _(arr) {
    return Array.isArray(arr) ? new Chain(arr) : new chainObject_1.ChainObject(arr);
}
exports._ = _;
//# sourceMappingURL=chain.js.map