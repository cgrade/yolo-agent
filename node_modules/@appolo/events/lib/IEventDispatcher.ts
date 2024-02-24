import {IEventOptions} from "./IEventOptions";

export interface IEventDispatcher {
    on(event: string, fn: (...args: any[]) => any, scope?: any, options?: IEventOptions): void
    once(event: string, fn?: (...args: any[]) => any, scope?: any, options?: IEventOptions): Promise<any> | void
    bubble(event: string, scope: IEventDispatcher)
    un(event: string, fn: (...args: any[]) => any, scope?: any): void
    fireEvent(event: string, ...args: any[]): void
    removeListenersByScope(scope: any): void
    removeAllListeners(): void
    hasListener(event: string, fn?: (...args: any[]) => any, scope?: any):boolean
}