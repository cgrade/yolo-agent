import {IEventOptions} from "./IEventOptions";

export interface IEvent<T> {
    on(fn: (payload: T) => any, scope?: any,options?: IEventOptions): void

    un(fn: (payload: T) => any, scope?: any): void

    once(fn?: (payload: T) => any, scope?: any,options?: IEventOptions): Promise<any> | void

    iterator<T>(event: string | string[], options?: { limit?: number }):AsyncIterableIterator<T>
}
