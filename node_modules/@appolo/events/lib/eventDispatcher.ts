"use strict";

import {ICallback, IEventOptions, IHandler} from "./IEventOptions";
import {IEventDispatcher} from "./IEventDispatcher";
import {Iterator} from "./iterator";
import {Util} from "./util";
import {CallbacksSymbol, RoutingKeysCacheSymbol, RoutingKeysSymbol} from "./consts";
import {fireEvent, fireEventAsync} from "./methods/fireEvent";
import {on, once} from "./methods/on";
import {un} from "./methods/un";
import {hasListener, listenerCount, removeAllListeners, removeListenersByScope} from "./methods/listeners";

export class EventDispatcher implements IEventDispatcher {

    constructor(private readonly _eventDispatcherOptions?: { await?: boolean, parallel?: boolean }) {
        this._eventDispatcherOptions = Object.assign({}, {await: false, parallel: true}, this._eventDispatcherOptions)
    }

    protected [CallbacksSymbol]: { [index: string]: IHandler };
    protected [RoutingKeysSymbol]: { [index: string]: { key: string, regex: RegExp, cache: { [index: string]: boolean } } };

    public on(event: string | string[], fn: (...args: any[]) => any, scope?: any, options?: IEventOptions): void {
        return on(this, this._eventDispatcherOptions, event, fn, scope, options)
    }

    public once(event: string | string[], fn?: (...args: any[]) => any, scope?: any, options: IEventOptions = {}): Promise<any> | void {

        return once(this,event,fn,scope,options)
    }

    public bubble(event: string, scope: IEventDispatcher) {
        this.on(event, (...args: any[]) => scope.fireEvent(event, ...args))
    }

    public un(event: string | string[], fn: (...args: any[]) => any, scope?: any): void {
        return un(this, event, fn, scope);
    }

    public async fireEventAsync(event: string, ...args: any[]): Promise<any> {
        return fireEventAsync(this, event, args);
    }

    public fireEvent(event: string, ...args: any[]): void {
        return fireEvent(this, event, args)
    }

    public removeListenersByScope(scope: any): void {

        return removeListenersByScope(this, scope);
    }

    public removeAllListeners(): void {
        return removeAllListeners(this);
    }

    public hasListener(event: string, fn ?: (...args: any[]) => any, scope ?: any): boolean {
        return hasListener(this, event, fn, scope);
    }

    public listenerCount(event: string): number {
        return listenerCount(this, event);
    }

    public iterator<T>(event: string | string[], options?: { limit?: number }): AsyncIterableIterator<T> {
        let iterator = new Iterator<T>(this, event, options);

        return iterator.iterate()
    }
}

