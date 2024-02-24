export interface IEventOptions {
    once?: boolean,
    await?: boolean,
    parallel?: boolean
    timeout?: number,
    order?: number
    saga?: boolean
}


export interface ICallback {
    fn: (...args: any[]) => any,
    scope?: any,
    options?: IEventOptions
}

export interface IHandler {
    callbacks: ICallback[],
    isRoutingKey: boolean
    order: boolean
}


export interface IDispatcherOptions {
    await?: boolean,
    parallel?: boolean
}


export type CallbackArray = {
    callback: ICallback,
    args: any[]
}[]

