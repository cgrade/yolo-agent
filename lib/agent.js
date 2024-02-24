"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = void 0;
const router_1 = require("@appolo/router");
const utils_1 = require("@appolo/utils");
const util_1 = require("./util");
const types_1 = require("./types");
const server_1 = require("./server");
const hooks_1 = require("./events/hooks");
const middleware_1 = require("./middleware");
const defaults_1 = require("./defaults");
const http = require("http");
const url = require("url");
const querystring = require("querystring");
const response_1 = require("./response");
const events_1 = require("./events/events");
class Agent {
    constructor(options) {
        this._isInitialized = false;
        this._onSentHook = [];
        this._onResponseHook = [];
        this.handle = (request, response) => {
            let $self = this, req = request, res = response;
            try {
                let { query, pathname } = $self._urlParse(req.url);
                res.req = req;
                req.query = query.length ? $self._qsParse(query) : {};
                req.pathName = pathname;
                req.originUrl = req.url;
                req.app = $self._requestApp;
                let route = this._router.find(req.method, req.pathName);
                if (!route) {
                    this._handleNotFound(response, req, res);
                    return;
                }
                let handler = route.handler;
                if (handler.hasSendHook) {
                    res.send = response_1.sendMiddleware.bind(res, handler.hooks.onSend, this._middlewaresError);
                }
                if (handler.hasResponseHook) {
                    response.once("finish", function () {
                        (0, middleware_1.handleMiddleware)(req, res, handler.hooks.onResponse, []);
                    });
                }
                req.params = route.params;
                req.route = handler.route;
                (0, middleware_1.handleMiddleware)(req, res, handler.middlewares, handler.errors);
            }
            catch (e) {
                (0, middleware_1.handleMiddlewareError)(req, res, this._middlewaresError, e);
            }
        };
        this._options = utils_1.Objects.defaults(options || {}, defaults_1.Defaults);
        this._middlewares = [];
        this._middlewaresError = [];
        this._routes = new Map();
        this._router = new router_1.Router({
            useCache: this._options.useRouteCache,
            maxCacheSize: this._options.maxRouteCache,
            decodeUrlParams: this._options.decodeUrlParams
        });
        this._server = server_1.Server.createServer(this);
        this._requestApp = this;
        this._events = new events_1.Events();
        this._hooks = new hooks_1.Hooks();
    }
    _initialize() {
        if (this._isInitialized) {
            return;
        }
        this._qsParse = this._options.qsParser || querystring.parse;
        this._urlParse = this._options.urlParser === "fast" ? util_1.Util.parseUrlFast : url.parse;
        this._middlewaresError.push(middleware_1.errorMiddleware);
        this._middlewaresNotFound = [...this._middlewares, middleware_1.notFoundMiddleware];
        for (let handler of this._routes.values()) {
            this._initializeHandler(handler);
        }
        this._onSentHook = this.hooks.hooks[types_1.HooksTypes.OnSend];
        this._onResponseHook = this.hooks.hooks[types_1.HooksTypes.OnResponse];
        this._isInitialized = true;
    }
    get hooks() {
        return this._hooks;
    }
    get events() {
        return this._events;
    }
    _initializeHandler(handler) {
        Object.keys(this._hooks.hooks).forEach(hookName => handler.hooks[hookName] = [...this._hooks.hooks[hookName], ...(handler.hooks[hookName] || [])]);
        if (handler.hooks.onSend.length) {
            handler.hooks.onSend.push(function (data, req, res, next) {
                res.send(data);
            });
        }
        handler.middlewares = [
            ...handler.hooks.onRequest,
            ...this._middlewares,
            ...handler.hooks.preMiddleware,
            ...handler.middlewares.slice(0, -1),
            ...handler.hooks.preHandler,
            handler.middlewares[handler.middlewares.length - 1]
        ];
        handler.errors = [
            ...handler.hooks.onError,
            ...handler.errors,
            ...this._middlewaresError
        ];
        handler.hasResponseHook = !!handler.hooks.onResponse.length;
        handler.hasSendHook = !!handler.hooks.onSend.length;
    }
    set requestApp(app) {
        this._requestApp = app;
    }
    _handleNotFound(response, req, res) {
        if (this._onSentHook.length) {
            res.send = response_1.sendMiddleware.bind(res, this._onSentHook, this._middlewaresError);
        }
        if (this._onResponseHook.length) {
            let onResponseHook = this._onResponseHook;
            response.once("finish", function () {
                (0, middleware_1.handleMiddleware)(req, res, onResponseHook, []);
            });
        }
        (0, middleware_1.handleMiddleware)(req, res, this._middlewaresNotFound, this._middlewaresError);
    }
    get options() {
        return this._options;
    }
    get(path, ...handler) {
        return this.add(router_1.Methods.GET, path, handler);
    }
    post(path, ...handler) {
        return this.add(router_1.Methods.POST, path, handler);
    }
    put(path, ...handler) {
        return this.add(router_1.Methods.PUT, path, handler);
    }
    patch(path, ...handler) {
        return this.add(router_1.Methods.PATCH, path, handler);
    }
    delete(path, ...handler) {
        return this.add(router_1.Methods.DELETE, path, handler);
    }
    head(path, ...handler) {
        return this.add(router_1.Methods.HEAD, path, handler);
    }
    all(path, ...handler) {
        this.add(router_1.Methods.GET, path, handler)
            .add(router_1.Methods.PATCH, path, handler)
            .add(router_1.Methods.POST, path, handler)
            .add(router_1.Methods.PUT, path, handler)
            .add(router_1.Methods.DELETE, path, handler)
            .add(router_1.Methods.HEAD, path, handler);
        return this;
    }
    add(method, path, handlers, route, hooks) {
        handlers = utils_1.Arrays.flat(handlers.map(handler => Array.isArray(handler) ? handler : [handler]));
        let result = utils_1.Arrays.partition(handlers, handler => handler.length <= 3);
        let middlewares = result[0];
        let errors = result[1];
        let dto = this._addRouteToRouter(method, path, middlewares, errors, route, hooks);
        if (method != router_1.Methods.HEAD) {
            this._addRouteToRouter(router_1.Methods.HEAD, path, middlewares.slice(), errors.slice(), route, utils_1.Objects.clone(hooks));
        }
        if (method != router_1.Methods.OPTIONS) {
            this._addRouteToRouter(router_1.Methods.OPTIONS, path, middlewares.slice(0, -1), errors.slice(), route, utils_1.Objects.clone(hooks));
        }
        this._events.routeAdded.fireEvent({
            method: method,
            path,
            handler: dto
        });
        return this;
    }
    _addRouteToRouter(method, path, middlewares, errors, route, hooks) {
        let dto = {
            middlewares,
            errors,
            route,
            method,
            path,
            hooks: hooks || {}
        };
        let routeKey = `${method}#${path}`;
        let routeHandler = this._routes.get(routeKey);
        if (routeHandler) {
            routeHandler.errors.push(...errors);
            routeHandler.middlewares.push(...middlewares);
        }
        else {
            this._router.add(method, path, dto);
            this._routes.set(routeKey, dto);
        }
        if (this._isInitialized) {
            this._initializeHandler(dto);
        }
        return dto;
    }
    use(path, ...fn) {
        if (typeof path === "string") {
            return this.all(path, ...fn);
        }
        else {
            fn.unshift(path);
        }
        let result = utils_1.Arrays.partition(fn, handler => handler.length <= 3);
        if (result[0].length) {
            this._middlewares.push(...result[0]);
        }
        if (result[1].length) {
            this._middlewaresError.push(...result[1]);
        }
        return this;
    }
    error(...fn) {
        this._middlewaresError.push(...fn);
        return this;
    }
    get server() {
        return this._server;
    }
    get router() {
        return this._router;
    }
    async close() {
        try {
            this._events.beforeServerClosed.fireEvent();
            await utils_1.Promises.fromCallback(c => this._server.close(c));
            this._events.afterServerClosed.fireEvent();
        }
        catch (e) {
            if (e.message !== "Not running" && e.code !== "ERR_SERVER_NOT_RUNNING") {
                throw e;
            }
        }
    }
    async listen(port, cb) {
        this._initialize();
        await this._events.beforeServerOpen.fireEvent();
        await utils_1.Promises.fromCallback(c => this._server.listen(port, c));
        await this._events.afterServerOpen.fireEvent();
        (cb) && cb(this);
        return this;
    }
    decorate(fn) {
        fn(http.IncomingMessage.prototype, http.ServerResponse.prototype, this._requestApp.constructor.prototype);
    }
}
exports.Agent = Agent;
//# sourceMappingURL=agent.js.map