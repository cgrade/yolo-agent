"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enums = void 0;
class Enums {
    static names(enm) {
        return Enums.enumNames(enm);
    }
    static enumNames(enm) {
        let res = [], keys = Object.keys(enm || {}), i = 0, len = keys.length;
        for (; i < len; i++) {
            let key = keys[i];
            if (isNaN(key) && res.indexOf(key) === -1 && res.indexOf(enm[key]) === -1) {
                res.push(key);
            }
        }
        return res;
    }
    static values(enm) {
        return Enums.enumValues(enm);
    }
    static enumValues(enm) {
        let res = [], keys = Object.keys(enm || {}), i = 0, len = keys.length;
        for (; i < len; i++) {
            let key = keys[i];
            let useValue = enm[key];
            if (!isNaN(key)) {
                useValue = +key;
            }
            if (res.indexOf(useValue) === -1 && res.indexOf(key) === -1) {
                res.push(useValue);
            }
        }
        return res;
    }
}
exports.Enums = Enums;
//# sourceMappingURL=enums.js.map