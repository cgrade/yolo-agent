import {IResponse} from "./response";
import {IRequest} from "./request";
import {Methods} from "@appolo/router";

export type MiddlewareHandler = ((req: IRequest, res: IResponse, next: NextFn) => any)
export type MiddlewareHandlerData = ((data:any, req: IRequest, res: IResponse, next: NextFn) => any)
export type MiddlewareHandlerAny = ((req: any, res: any, next: any) => any)

export type MiddlewareHandlerOrAny = MiddlewareHandler | MiddlewareHandlerAny;

export type MiddlewareHandlerError = ((e: any, req: IRequest, res: IResponse, next: NextFn) => any)
export type MiddlewareHandlerAnyError = ((e: any, req: any, res: any, next: any) => any)

export type MiddlewareHandlerErrorOrAny = MiddlewareHandlerError | MiddlewareHandlerAnyError


export type MiddlewareHandlerParams = MiddlewareHandlerOrAny | MiddlewareHandlerErrorOrAny


export interface IRouteHandler {
    path: string
    method: keyof typeof Methods
    middlewares: MiddlewareHandlerOrAny[]
    errors: MiddlewareHandlerErrorOrAny[]
    route: any,
    hooks: IHooks
    hasSendHook?:boolean
    hasResponseHook?:boolean
}

export interface NextFn {
    (err?: Error,data?:any): void

    run?: boolean
    index?: number
}

export enum HooksTypes {
    "OnRequest" = "onRequest",
    "PreMiddleware" = "preMiddleware",
    "PreHandler" = "preHandler",
    "OnError" = "onError",
    "OnSend" = "onSend",
    "OnResponse" = "onResponse"
}

export type IHook = MiddlewareHandler | MiddlewareHandlerData | MiddlewareHandlerError

export type IHooks = { [K in HooksTypes]?: IHook[] };


