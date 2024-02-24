import {IOptions} from "./lib/IOptions";
import {Agent} from "./lib/agent";
import {HooksTypes, MiddlewareHandler, MiddlewareHandlerAny, MiddlewareHandlerParams, NextFn} from "./lib/types";
import {NotFoundError} from "./lib/errors/notFoundError";
import {UnauthorizedError} from "./lib/errors/unauthorizedError";
import {CookieSerializeOptions} from "./lib/cookie";

export {Agent} from './lib/agent';
export {IApp} from './lib/IApp';
export {HttpError} from './lib/errors/httpError';
export {BadRequestError} from './lib/errors/badRequestError';
export {InternalServerError} from './lib/errors/internalServerError';
export {UnauthorizedError} from './lib/errors/unauthorizedError';
export {NotFoundError} from './lib/errors/notFoundError';
export {IRequest, Request} from './lib/request';
export {IResponse, Response} from './lib/response';
export {Methods} from '@appolo/router';
export {IOptions} from "./lib/IOptions";
export {CookieSerializeOptions} from "./lib/cookie";
export {
    MiddlewareHandlerParams,
    MiddlewareHandler,
    MiddlewareHandlerAny,
    NextFn,
    MiddlewareHandlerErrorOrAny,
    MiddlewareHandlerOrAny,HooksTypes
} from './lib/types'
export {Hooks} from './lib/events/hooks';
export {Events} from './lib/events/events';
export function createAgent(options?: IOptions) {
    return new Agent(options)
}

export default function (options?: IOptions) {
    return new Agent(options);
}
