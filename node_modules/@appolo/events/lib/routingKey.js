"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutingKey = void 0;
class RoutingKey {
    static isRoutingRoute(key) {
        return this.RegexRoute.test(key);
    }
    static test(pattern, key) {
        const regex = this.createRegex(pattern);
        return regex.test(key);
    }
    static createRegex(pattern) {
        for (let i = 0, len = this.Rules.length; i < len; i++) {
            let rule = this.Rules[i];
            pattern = pattern.replace(rule[0], rule[1]);
        }
        let regex = new RegExp(`^${pattern}$`);
        return regex;
    }
}
exports.RoutingKey = RoutingKey;
RoutingKey.Rules = [
    [new RegExp('\\.', 'g'), '\\.'],
    [new RegExp('\\*', 'g'), '([\\w|-]+)'],
    [new RegExp('#', 'g'), '([\\w|.|-]*)']
];
RoutingKey.RegexRoute = new RegExp("\\*|#");
//# sourceMappingURL=routingKey.js.map