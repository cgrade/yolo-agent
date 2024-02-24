import {CallbacksSymbol, RoutingKeysCacheSymbol, RoutingKeysSymbol} from "../consts";
import {getRoutingKeys} from "./getRoutingKeys";
import {EventDispatcher} from "../eventDispatcher";

export function hasListener(eventDispatcher: EventDispatcher, event: string, fn: (...args: any[]) => any, scope: any): boolean {
    if (!eventDispatcher[CallbacksSymbol]) {
        return false;
    }

    let handler = eventDispatcher[CallbacksSymbol][event];

    let routingKeys = getRoutingKeys(eventDispatcher, handler, event);

    if (routingKeys.length) {
        for (let i = 0, len = routingKeys.length; i < len; i++) {
            if (eventDispatcher.hasListener(routingKeys[i], fn, scope)) {
                return true;
            }
        }
    }

    if (!handler || !handler.callbacks.length) {
        return false;
    }

    if (arguments.length == 1 || !fn) {
        return true;
    }

    for (let i = handler.callbacks.length - 1; i >= 0; i--) {
        let callback = handler.callbacks[i];
        if (callback.fn === fn && (!scope || callback.scope === scope)) {
            return true;
        }
    }

    return false

}

export function listenerCount(eventDispatcher: EventDispatcher, event: string): number {
    let handler = eventDispatcher[CallbacksSymbol][event],
        sum = 0;

    let routingKeys = getRoutingKeys(eventDispatcher, handler, event);

    if (routingKeys.length) {
        for (let i = 0, len = routingKeys.length; i < len; i++) {
            sum += eventDispatcher.listenerCount(routingKeys[i]);
        }
    }

    if (!handler) {
        return sum;
    }

    return sum + handler.callbacks.length
}

export function removeAllListeners(eventDispatcher: EventDispatcher): void {

    let keys = Object.keys(eventDispatcher[CallbacksSymbol] || {});
    for (let i = 0, length = keys.length; i < length; i++) {
        let handler = eventDispatcher[CallbacksSymbol][keys[i]];
        handler.callbacks.length = 0;
    }

    eventDispatcher[CallbacksSymbol] = {};
    eventDispatcher[RoutingKeysSymbol] = undefined;
    eventDispatcher[RoutingKeysCacheSymbol] = undefined

}

export function removeListenersByScope(eventDispatcher: EventDispatcher, scope: any): void {

    let keys = Object.keys(eventDispatcher[CallbacksSymbol] || {});
    for (let i = 0, length = keys.length; i < length; i++) {
        let handler = eventDispatcher[CallbacksSymbol][keys[i]];

        for (let j = handler.callbacks.length - 1; j >= 0; j--) {
            let callback = handler.callbacks[j];

            if (callback.scope === scope) {
                handler.callbacks.splice(j, 1);
            }
        }
    }
}
