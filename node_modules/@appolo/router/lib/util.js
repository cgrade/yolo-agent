"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
class Util {
    static isRegex(path) {
        return this.RegexChars.some(char => path.includes(char)) || path.indexOf(":") != path.lastIndexOf(":");
    }
    static isStaticRoute(path) {
        return !Util.isRegex(path) && ![":"].some(char => path.includes(char));
    }
    static isParam(path) {
        return path.charCodeAt(0) == 58;
    }
    static removeTailSlash(path) {
        return path.charCodeAt(path.length - 1) === 47 ? path.slice(0, -1) : path;
    }
    static removeHeadSlash(path) {
        return path.charCodeAt(0) === 47 ? path.slice(1) : path;
    }
    static convertWildCard(part) {
        if (part == "*") {
            return "(.*)";
        }
        if (part.endsWith("*")) {
            return part.slice(0, -1) + "(.*)";
        }
        return part;
    }
    static joinByIndex(index, parts) {
        let part = "";
        for (let i = index, len = parts.length; i < len; i++) {
            part += parts[i];
            if (i < len - 1) {
                part += "/";
            }
        }
        return part;
    }
    static joinByIndexWithWildCard(index, parts) {
        let part = "";
        for (let i = index, len = parts.length; i < len; i++) {
            part += Util.convertWildCard(parts[i]);
            if (i < len - 1) {
                part += "/";
            }
        }
        return part;
    }
    static sortBy(arr, criteria) {
        arr = arr.slice(0);
        arr.sort((a, b) => {
            let valueA = criteria(a), valueB = criteria(b);
            return (valueA > valueB) ? 1 : ((valueB > valueA) ? -1 : 0);
        });
        return arr;
    }
}
exports.Util = Util;
Util.RegexChars = ["?", "(", "+", "*", "-"];
//# sourceMappingURL=util.js.map