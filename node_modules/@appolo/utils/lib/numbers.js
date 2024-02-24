"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Numbers = void 0;
class Numbers {
    static toFixed(number, precision = 0) {
        let pow = Math.pow(10, precision);
        return (Math.round(number * pow) / pow);
    }
    static random(min, max, floating = false) {
        if (max === undefined) {
            max = min;
            min = 0;
        }
        let isInt = !floating && Number.isInteger(min) && Number.isInteger(min);
        if (isInt) {
            return Numbers.randomInt(min, max);
        }
        min = Math.min(min, max);
        max = Math.max(max, max);
        return (Math.random() * (max - min + 1)) + min;
    }
    static isNumber(str) {
        return (typeof str === 'number' || str instanceof Number);
    }
    static randomInt(min, max) {
        if (max === undefined) {
            max = min;
            min = 0;
        }
        min = Math.ceil(Math.min(min, max));
        max = Math.floor(Math.max(min, max));
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    static isValidRandom(num) {
        return Numbers.random(1, num) == num;
    }
    static round(value, step) {
        step || (step = 1.0);
        let inv = 1.0 / step;
        return Math.round(value * inv) / inv;
    }
    static diff(a, b) {
        if (a === 0) {
            return 0;
        }
        const diff = a - b;
        return diff / a;
    }
    static format(num) {
        return new Intl.NumberFormat().format(num);
    }
}
exports.Numbers = Numbers;
//# sourceMappingURL=numbers.js.map