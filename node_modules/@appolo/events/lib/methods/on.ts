import {IEventOptions, IHandler} from "../IEventOptions";
import {Util} from "../util";
import {CallbacksSymbol, RoutingKeysCacheSymbol, RoutingKeysSymbol} from "../consts";
import {RoutingKey} from "../routingKey";
import {EventDispatcher} from "../eventDispatcher";


export function on(dispatcher: EventDispatcher, eventDispatcherOptions: { await?: boolean, parallel?: boolean }, event: string | string[], fn: (...args: any[]) => any, scope: any, options: IEventOptions): void {

    if (Array.isArray(event)) {

        (options && options.saga)
            ? _handleSaga(event, dispatcher, fn, scope, options)
            : event.forEach(event => dispatcher.on(event, fn, scope, options))

        return;
    }


    let handler = _getHandler(dispatcher, event);

    handler.callbacks.unshift({
        fn: fn,
        scope: scope,
        options: Object.assign({await: false, parallel: true, order: 0}, eventDispatcherOptions, options)
    });

    if (options && options.order) {
        handler.callbacks.sort((a, b) => a.options.order - b.options.order)
    }

    if (!handler.isRoutingKey && RoutingKey.isRoutingRoute(event)) {
        _handleRouting(dispatcher, handler, event);
    }

}


export function once(eventDispatcher: EventDispatcher, event: string | string[], fn: (...args: any[]) => any, scope: any, options: IEventOptions = {}): Promise<any> | void {

    if (fn) {
        return eventDispatcher.on(event, fn, scope, {...options, ...{once: true}});
    }

    return new Promise((resolve, reject) => {
        eventDispatcher.on(event, Util.timeoutFn(options.timeout, resolve, reject), scope, {...options, ...{once: true}});
    })

}


function _handleSaga(event: string[], dispatcher: EventDispatcher, fn: (...args: any[]) => any, scope: any, options: IEventOptions) {
    let results: any[][] = [];

    for (let i = 0; i < event.length; i++) {
        results[i] = [];

        dispatcher.on(event[i], Util.sagaFn(results, i, fn, scope), null, options)
    }
}


function _handleRouting(dispatcher: EventDispatcher, handler: IHandler, event: string) {
    if (!dispatcher[RoutingKeysSymbol]) {
        dispatcher[RoutingKeysSymbol] = {};
        dispatcher[RoutingKeysCacheSymbol] = [];
    }

    handler.isRoutingKey = true;

    dispatcher[RoutingKeysSymbol][event] = {regex: RoutingKey.createRegex(event), key: event, cache: {}};

    dispatcher[RoutingKeysCacheSymbol] = Object.keys(dispatcher[RoutingKeysSymbol]);
}

function _getHandler(dispatcher: EventDispatcher, event: string) {
    if (!dispatcher[CallbacksSymbol]) {
        dispatcher[CallbacksSymbol] = {};
    }

    let handler = dispatcher[CallbacksSymbol][event];

    if (!handler) {
        handler = dispatcher[CallbacksSymbol][event] = {callbacks: [], isRoutingKey: false, order: false};
    }
    return handler;
}
