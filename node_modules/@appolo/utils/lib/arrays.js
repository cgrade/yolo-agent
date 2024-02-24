"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arrays = void 0;
const classes_1 = require("./classes");
class Arrays {
    static clone(arr) {
        return arr.slice(0);
    }
    static arrayify(val) {
        return undefined === val ? [] : (Array.isArray(val) ? val : [val]);
    }
    static nullifyEmptyArray(arr) {
        return (arr && arr.length) ? arr : null;
    }
    static areArraysEqual(arrA, arrB) {
        const a = new Set(arrA);
        const b = new Set(arrB);
        if (a.size !== b.size) {
            return false;
        }
        for (let k of a) {
            if (!b.has(k)) {
                return false;
            }
        }
        return true;
    }
    static compact(array) {
        let index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
        while (++index < length) {
            let value = array[index];
            if (value) {
                result[resIndex++] = value;
            }
        }
        return result;
    }
    static range(start, end, increment) {
        const isEndDef = typeof end !== 'undefined';
        end = isEndDef ? end : start;
        start = isEndDef ? start : 0;
        if (typeof increment === 'undefined') {
            increment = Math.sign(end - start);
        }
        const length = Math.abs((end - start) / (increment || 1));
        let arr = Array.from({ length }), current = start;
        for (let i = 0; i < length; i++) {
            arr[i] = current;
            current = current + increment;
        }
        return arr;
    }
    static random(arr) {
        if (!arr || !arr.length) {
            return null;
        }
        if (arr.length < 2) {
            return arr[0];
        }
        return arr[Math.floor(Math.random() * arr.length)];
    }
    static randomItems(arr, n) {
        if (!arr || !arr.length) {
            return [];
        }
        return Arrays.sortBy(arr, () => 0.5 - Math.random()).slice(0, n);
    }
    static removeBy(list, criteria) {
        if (!list || !list.length) {
            return;
        }
        for (let i = list.length - 1; i >= 0; i--) {
            if (criteria(list[i], i)) {
                list.splice(i, 1);
            }
        }
    }
    static remove(list, item) {
        Arrays.removeBy(list, current => current === item);
    }
    static chunk(array, chunkSize) {
        return Arrays.splitToChunks(array, chunkSize);
    }
    static splitToChunks(array, chunkSize) {
        return [].concat.apply([], array.map(function (elem, i) {
            return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
        }));
    }
    static groupBy(arr, key) {
        let output = {};
        for (let i = 0, len = arr.length; i < len; i++) {
            let item = arr[i], value = (typeof key === "function") ? key(item) : item[key], dto = output[value] || (output[value] = []);
            dto.push(item);
        }
        return output;
    }
    static keyBy(arr, key) {
        if (!key) {
            key = (item, index) => item.toString();
        }
        let output = {}, isFn = classes_1.Classes.isFunction(key);
        for (let i = 0, len = (arr || []).length; i < len; i++) {
            let item = arr[i];
            let outputKey = isFn ? key(item, i) : item[key];
            output[outputKey] = item;
        }
        return output;
    }
    static keyByMap(arr, key) {
        if (!key) {
            key = (item, index) => item.toString();
        }
        let output = new Map(), isFn = classes_1.Classes.isFunction(key);
        for (let i = 0, len = (arr || []).length; i < len; i++) {
            let item = arr[i];
            let outputKey = isFn ? key(item, i) : item[key];
            output.set(outputKey, item);
        }
        return output;
    }
    static flat(arr) {
        return arr.reduce((acc, val) => acc.concat(val), []);
    }
    static flatDeep(arr, depth = 1) {
        return depth > 0
            ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? Arrays.flatDeep(val, depth - 1) : val), [])
            : arr.slice();
    }
    static partition(arr, criteria) {
        let arr1 = [], arr2 = [];
        for (let i = 0, len = (arr || []).length; i < len; i++) {
            let value = arr[i];
            criteria(value) ? arr1.push(value) : arr2.push(value);
        }
        return [arr1, arr2];
    }
    static sortBy(arr, criteria) {
        arr = Arrays.clone(arr);
        arr.sort((a, b) => {
            let valueA = criteria(a), valueB = criteria(b);
            return (valueA > valueB) ? 1 : ((valueB > valueA) ? -1 : 0);
        });
        return arr;
    }
    static zip(arr, ...args) {
        let arrs = [arr].concat(args);
        let maxLen = Math.max(...arrs.map(item => item.length));
        let output = [];
        for (let i = 0; i < maxLen; i++) {
            let dto = [];
            for (let j = 0; j < arrs.length; j++) {
                dto.push(arrs[j][i]);
            }
            output.push(dto);
        }
        return output;
    }
    static sort(arr) {
        let criteria = ((value) => value);
        arr = Arrays.clone(arr);
        arr.sort((a, b) => {
            let valueA = criteria(a), valueB = criteria(b);
            return (valueA > valueB) ? 1 : ((valueB > valueA) ? -1 : 0);
        });
        return arr;
    }
    static map(arr, criteria) {
        if (!arr) {
            return [];
        }
        if (!Array.isArray(arr)) {
            return Object.keys(arr).map(key => criteria(arr[key], key));
        }
        return arr.map(criteria);
    }
    static forEach(arr, criteria) {
        if (!arr) {
            return;
        }
        if (!Array.isArray(arr)) {
            Object.keys(arr).forEach(key => criteria(arr[key], key));
            return;
        }
        arr.forEach(criteria);
    }
    static uniqBy(arr, criteria) {
        let dic = new Map(), out = [];
        if (!arr || !arr.length) {
            return [];
        }
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i], key = criteria(item, i);
            if (!dic.has(key)) {
                dic.set(key, 1);
                out.push(item);
            }
        }
        return out;
    }
    static uniq(arr) {
        return Arrays.uniqBy(arr, (item) => item);
    }
    static sumBy(arr, criteria) {
        if (!arr || !arr.length) {
            return 0;
        }
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i], num = criteria(item, i);
            sum += num;
        }
        return sum;
    }
    static sum(arr) {
        return Arrays.sumBy(arr, item => item);
    }
    static difference(arr, arr2) {
        return Arrays.differenceBy(arr, arr2, item => item);
    }
    static differenceBy(arr, arr2, criteria) {
        let out = [];
        if (!arr || !arr.length) {
            return [];
        }
        if (!arr2 || !arr2.length) {
            return arr;
        }
        for (let i = 0; i < arr.length; i++) {
            let item1 = arr[i], key1 = criteria(item1, i), found = false;
            for (let j = 0; j < arr2.length; j++) {
                let item2 = arr2[j], key2 = criteria(item2, j);
                if (key1 === key2) {
                    found = true;
                }
            }
            if (!found) {
                out.push(item1);
            }
        }
        return out;
    }
    static countBy(arr, criteria) {
        if (!arr || !arr.length) {
            return {};
        }
        let dto = {};
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i], key = criteria(item, i);
            if (dto[key] !== undefined) {
                dto[key]++;
            }
            else {
                dto[key] = 1;
            }
        }
        return dto;
    }
}
exports.Arrays = Arrays;
//# sourceMappingURL=arrays.js.map