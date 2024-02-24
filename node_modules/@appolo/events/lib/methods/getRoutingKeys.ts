import {IHandler} from "../IEventOptions";
import {EventDispatcher} from "../eventDispatcher";
import {RoutingKeysCacheSymbol, RoutingKeysSymbol} from "../consts";

export function getRoutingKeys(eventDispatcher:EventDispatcher,handler: IHandler, event: string): string[] {

    if ((handler && handler.isRoutingKey) || !eventDispatcher[RoutingKeysSymbol]) {
        return [];
    }

    let keys = [],
        routingKeysIndex = eventDispatcher[RoutingKeysSymbol],
        routingKeys = eventDispatcher[RoutingKeysCacheSymbol];

    for (let i = 0, len = routingKeys.length; i < len; i++) {
        let routingKey = routingKeysIndex[routingKeys[i]];

        if (!routingKey) {
            continue;
        }

        let cacheKey = routingKey.key + event;

        let shouldFireEvent = routingKey.cache[cacheKey];

        if (shouldFireEvent === undefined) {
            shouldFireEvent = routingKey.cache[cacheKey] = routingKey.regex.test(event)
        }

        if (shouldFireEvent) {
            keys.push(routingKey.key)
        }
    }

    return keys;
}
