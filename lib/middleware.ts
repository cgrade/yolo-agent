import {IResponse} from "./response";
import {IRequest} from "./request";
import {MiddlewareHandlerData, MiddlewareHandler, MiddlewareHandlerError, NextFn} from "./types";
import {HttpError} from "./errors/httpError";
import {ErrorHandler} from "./errorHandler";
import {InternalServerError} from "./errors/internalServerError";
import {Event} from "@appolo/events";


export function handleMiddleware(req: IRequest, res: IResponse, middlewares: (MiddlewareHandler | MiddlewareHandlerData)[], errorsMiddleware: MiddlewareHandlerError[], num: number = 0, err?: Error, data?: any) {

    if (err) {
        return handleMiddlewareError(req, res, errorsMiddleware, err);
    }

    if (num == middlewares.length) {
        return;
    }


    let fn = middlewares[num];

    let next: any = req.next = createNext(req, res, middlewares, errorsMiddleware, num);

    try {
        let result = data ? (fn as MiddlewareHandlerData)(data, req, res, next) : (fn as MiddlewareHandler)(req, res, next);

        if (result && typeof result.then == "function") {
            result.then(() => next()).catch(next)
        }

    } catch (e) {
        next(e)
    }

}

function createNext(req: IRequest, res: IResponse, middlewares: (MiddlewareHandler | MiddlewareHandlerData)[], errorsMiddleware: MiddlewareHandlerError[], num: number ) {
    let called = false;
    return function (e, data) {
        if (!called) {
            called = true;
            handleMiddleware(req, res, middlewares, errorsMiddleware, num + 1, e, data);

        }
    }
}

function createNextErr(req: IRequest, res: IResponse, middlewares: MiddlewareHandlerError[], err: Error, num: number) {
    let called = false;
    return function (e) {
        if (!called) {
            called = true;
            handleMiddlewareError(req, res, middlewares,  e, num + 1);

        }
    }
}


export function handleMiddlewareError(req: IRequest, res: IResponse, middlewares: MiddlewareHandlerError[], err: Error, num: number = 0) {

    if (num == middlewares.length) {
        return;
    }

    let fn = middlewares[num];

    let next: any = req.next = createNextErr(req, res, middlewares, err, num);

    try {
        let result = fn(err, req, res, next);

        if (result && typeof result.then == "function") {
            result.then(() => next()).catch(next)
        }
    } catch (e) {
        next(e);
    }

}

export function notFoundMiddleware(req: IRequest, res: IResponse, next: NextFn) {
    next(new HttpError(404, `Cannot ${req.method} ${req.pathName}`))
}

export function errorMiddleware(e: Error | HttpError, req: IRequest, res: IResponse, next: NextFn) {

    if (res.headersSent || res.sending) {
        return;
    }

    let err: HttpError = e as HttpError || new InternalServerError();

    if(!err["__HttpError__"]){
        err = new InternalServerError(err);
    }

    res.statusCode = ErrorHandler.getStatusCode(err);

    let msg = ErrorHandler.getErrorMessage(err, res.statusCode,req.app.options.errorMessage,req.app.options.errorStack);

    res.json(msg);
}


