"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = exports.notFoundMiddleware = exports.handleMiddlewareError = exports.handleMiddleware = void 0;
const httpError_1 = require("./errors/httpError");
const errorHandler_1 = require("./errorHandler");
const internalServerError_1 = require("./errors/internalServerError");
function handleMiddleware(req, res, middlewares, errorsMiddleware, num = 0, err, data) {
    if (err) {
        return handleMiddlewareError(req, res, errorsMiddleware, err);
    }
    if (num == middlewares.length) {
        return;
    }
    let fn = middlewares[num];
    let next = req.next = createNext(req, res, middlewares, errorsMiddleware, num);
    try {
        let result = data ? fn(data, req, res, next) : fn(req, res, next);
        if (result && typeof result.then == "function") {
            result.then(() => next()).catch(next);
        }
    }
    catch (e) {
        next(e);
    }
}
exports.handleMiddleware = handleMiddleware;
function createNext(req, res, middlewares, errorsMiddleware, num) {
    let called = false;
    return function (e, data) {
        if (!called) {
            called = true;
            handleMiddleware(req, res, middlewares, errorsMiddleware, num + 1, e, data);
        }
    };
}
function createNextErr(req, res, middlewares, err, num) {
    let called = false;
    return function (e) {
        if (!called) {
            called = true;
            handleMiddlewareError(req, res, middlewares, e, num + 1);
        }
    };
}
function handleMiddlewareError(req, res, middlewares, err, num = 0) {
    if (num == middlewares.length) {
        return;
    }
    let fn = middlewares[num];
    let next = req.next = createNextErr(req, res, middlewares, err, num);
    try {
        let result = fn(err, req, res, next);
        if (result && typeof result.then == "function") {
            result.then(() => next()).catch(next);
        }
    }
    catch (e) {
        next(e);
    }
}
exports.handleMiddlewareError = handleMiddlewareError;
function notFoundMiddleware(req, res, next) {
    next(new httpError_1.HttpError(404, `Cannot ${req.method} ${req.pathName}`));
}
exports.notFoundMiddleware = notFoundMiddleware;
function errorMiddleware(e, req, res, next) {
    if (res.headersSent || res.sending) {
        return;
    }
    let err = e || new internalServerError_1.InternalServerError();
    if (!err["__HttpError__"]) {
        err = new internalServerError_1.InternalServerError(err);
    }
    res.statusCode = errorHandler_1.ErrorHandler.getStatusCode(err);
    let msg = errorHandler_1.ErrorHandler.getErrorMessage(err, res.statusCode, req.app.options.errorMessage, req.app.options.errorStack);
    res.json(msg);
}
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=middleware.js.map