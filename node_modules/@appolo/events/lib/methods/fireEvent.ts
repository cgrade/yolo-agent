import {CallbackArray, ICallback, IHandler} from "../IEventOptions";
import {CallbacksSymbol, RoutingKeysCacheSymbol, RoutingKeysSymbol} from "../consts";
import {getRoutingKeys} from "./getRoutingKeys";
import {EventDispatcher} from "../eventDispatcher";

export function fireEvent(eventDispatcher: EventDispatcher, event: string, args: any[]): void {
    let result = _fireEvent(eventDispatcher, event, args);
    if (!result) {
        return;
    }

    let callbacks = result.callbacks.concat(result.parallelPromises, result.serialPromises)

    for (let i = 0; i < callbacks.length; i++) {
        let callback = callbacks[i];
        callback.callback.fn.apply(callback.callback.scope, callback.args)
    }
}

export async function fireEventAsync(eventDispatcher: EventDispatcher, event: string, args: any[]): Promise<any> {

    let result = _fireEvent(eventDispatcher, event, args);
    if (!result) {
        return;
    }

    if (result.serialPromises.length) {
        for (let callback of result.serialPromises) {
            await callback.callback.fn.apply(callback.callback.scope, callback.args)
        }
    }

    if (result.parallelPromises.length) {

        await Promise.all(result.parallelPromises.map(callback => callback.callback.fn.apply(callback.callback.scope, callback.args)))
    }

    if (result.callbacks.length) {
        for (let callback of result.callbacks) {
            callback.callback.fn.apply(callback.callback.scope, callback.args)
        }
    }
}

export function _fireEvent(dispatcher: EventDispatcher, event: string, args: any[]): {
    parallelPromises: CallbackArray,
    serialPromises: CallbackArray,
    callbacks: CallbackArray
} {

    if (!dispatcher[CallbacksSymbol]) {
        return;
    }

    let handler = dispatcher[CallbacksSymbol][event];
    let parallelPromises: CallbackArray = [],
        serialPromises: CallbackArray = [],
        callbacks: CallbackArray = [];

    let routingKeys = getRoutingKeys(dispatcher, handler, event);

    if (routingKeys.length) {
        _populateRoutingKeys(routingKeys, parallelPromises, dispatcher, args);
    }

    if (!handler) {
        return {callbacks, serialPromises, parallelPromises}
    }
    for (let i = handler.callbacks.length - 1; i >= 0; i--) {
        let callback = handler.callbacks[i];

        if (!callback || !callback.fn) {
            continue;
        }

        let arr = callback.options.await
            ? (callback.options.parallel ? parallelPromises : serialPromises)
            : callbacks

        arr.push({callback, args})

        if (callback.options.once) {
            _removeByIndex(handler, i, dispatcher, event);
        }

    }

    return {callbacks, serialPromises, parallelPromises}
}

function _removeByIndex(handler: IHandler, i: number, dispatcher: EventDispatcher, event: string) {
    handler.callbacks.splice(i, 1);

    if (!handler.callbacks.length && dispatcher[RoutingKeysSymbol] && dispatcher[RoutingKeysSymbol][event]) {
        dispatcher[RoutingKeysSymbol][event] = undefined;
        dispatcher[RoutingKeysCacheSymbol] = Object.keys(dispatcher[RoutingKeysSymbol]);
    }
}


function _populateRoutingKeys(routingKeys: string[], arr: CallbackArray, dispatcher: EventDispatcher, args: any[]) {
    for (let i = 0, len = routingKeys.length; i < len; i++) {
        arr.push({
            callback: {
                fn: dispatcher.fireEvent,
                scope: dispatcher
            }, args: [routingKeys[i], ...args]

        })
    }
}
