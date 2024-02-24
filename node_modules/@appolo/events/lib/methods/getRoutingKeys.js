"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoutingKeys = void 0;
const consts_1 = require("../consts");
function getRoutingKeys(eventDispatcher, handler, event) {
    if ((handler && handler.isRoutingKey) || !eventDispatcher[consts_1.RoutingKeysSymbol]) {
        return [];
    }
    let keys = [], routingKeysIndex = eventDispatcher[consts_1.RoutingKeysSymbol], routingKeys = eventDispatcher[consts_1.RoutingKeysCacheSymbol];
    for (let i = 0, len = routingKeys.length; i < len; i++) {
        let routingKey = routingKeysIndex[routingKeys[i]];
        if (!routingKey) {
            continue;
        }
        let cacheKey = routingKey.key + event;
        let shouldFireEvent = routingKey.cache[cacheKey];
        if (shouldFireEvent === undefined) {
            shouldFireEvent = routingKey.cache[cacheKey] = routingKey.regex.test(event);
        }
        if (shouldFireEvent) {
            keys.push(routingKey.key);
        }
    }
    return keys;
}
exports.getRoutingKeys = getRoutingKeys;
//# sourceMappingURL=getRoutingKeys.js.map