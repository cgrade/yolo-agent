import {CallbacksSymbol, RoutingKeysCacheSymbol, RoutingKeysSymbol} from "../consts";
import {EventDispatcher} from "../eventDispatcher";

export function un(eventDispatcher: EventDispatcher,event: string | string[], fn: (...args: any[]) => any, scope: any): void {

    if (Array.isArray(event)) {
        event.forEach(event => eventDispatcher.un(event, fn["@__eventDispatcher__"] || fn, scope));
        return;
    }

    if (!eventDispatcher[CallbacksSymbol]) {
        return
    }

    let handler = eventDispatcher[CallbacksSymbol][event];

    if (!handler || !handler.callbacks.length) {
        return
    }

    for (let i = handler.callbacks.length - 1; i >= 0; i--) {
        let callback = handler.callbacks[i];
        if (callback.fn === fn && (scope ? callback.scope === scope : true)) {
            handler.callbacks.splice(i, 1);
        }
    }

    if (!handler.callbacks.length && eventDispatcher[RoutingKeysSymbol] && eventDispatcher[RoutingKeysSymbol][event]) {
        eventDispatcher[RoutingKeysSymbol][event] = undefined;
        eventDispatcher[RoutingKeysCacheSymbol] = Object.keys(eventDispatcher[RoutingKeysSymbol]);
    }
}
