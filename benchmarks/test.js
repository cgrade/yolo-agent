"use strict";
// import benchmark = require('benchmark');
// import {IRequest} from "../lib/request";
// import {IResponse} from "../lib/response";
// import {MiddlewareHandler, MiddlewareHandlerError} from "../lib/types";
// import {handleMiddlewareError} from "../lib/middleware";
//
// let suite = new benchmark.Suite();
//
// export function handleMiddleware1(req: IRequest, res: IResponse, middlewares: MiddlewareHandler[], errorsMiddleware: MiddlewareHandlerError[], err?: Error) {
//
//     if (err) {
//         req.next = null;
//         return handleMiddlewareError(req, res, errorsMiddleware, err);
//     }
//
//     let next = req.next;
//
//     if (!next) {
//         next = req.next = handleMiddleware1.bind(null, req, res, middlewares, errorsMiddleware)
//
//         next.index = 0;
//     }
//
//     let index = next.index;
//
//     if (index == middlewares.length) {
//         return;
//     }
//
//     let fn = middlewares[index];
//
//     next.index = index + 1;
//
//
//     try {
//         fn(req, res, next);
//     } catch (e) {
//         req.next = null;
//         handleMiddlewareError(req, res, errorsMiddleware, e);
//     }
// }
//
// function handleMiddleware2(req: IRequest, res: IResponse, middlewares: MiddlewareHandler[], errorsMiddleware: MiddlewareHandlerError[],num: number=0, err?: Error) {
//
//     if (err) {
//         return handleMiddlewareError(req, res, errorsMiddleware, err);
//     }
//
//     if (num == middlewares.length) {
//         return;
//     }
//
//     let fn = middlewares[num];
//
//     let next: any = req.next = handleMiddleware2.bind(null, req, res, middlewares, errorsMiddleware,num + 1);
//     // let next: any = req.next = function (err){
//     //     handleMiddleware2( req, res, middlewares, errorsMiddleware,num + 1,err);
//     // }
//
//
//     try {
//         fn(req, res, next);
//     } catch (e) {
//         handleMiddlewareError(req, res, errorsMiddleware, e);
//     }
//
// }
//
//
// let middelwares = [function (req, res, next) {
//     next()
// }, function (req, res, next) {
//     next()
// }]
//
//
// suite.add('handleMiddleware1', {
//     defer: false,
//     fn: function (deferred) {
//         handleMiddleware1({}, {}, middelwares, [])
//     }
// });
//
// suite.add('handleMiddleware2', {
//     defer: false,
//     fn: function (deferred) {
//         handleMiddleware2({}, {}, middelwares, [])
//     }
// });
//
//
// suite
//     .on('cycle', (event) => {
//         console.log(String(event.target))
//         if (event.target.error)
//             console.error(event.target.error)
//     })
//     .on('error', (event) => {
//         console.log(String(event.target))
//         if (event.target.error)
//             console.error(event.target.error)
//     })
//
//     .run({async: true})
//# sourceMappingURL=test.js.map