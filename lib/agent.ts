import {IOptions} from "./IOptions";
import {Methods, Router} from '@appolo/router';
import {IRequest} from "./request";
import {IEvent, Event} from "@appolo/events";
import {Arrays, Enums, Promises, Objects} from "@appolo/utils";
import {Util} from "./util";
import {
    HooksTypes,
    IHook, IHooks,
    IRouteHandler, MiddlewareHandlerData, MiddlewareHandler, MiddlewareHandlerError,
    MiddlewareHandlerErrorOrAny,
    MiddlewareHandlerOrAny,
    MiddlewareHandlerParams
} from "./types";
import {Server} from "./server";
import {Hooks} from "./events/hooks";
import {
    errorMiddleware,
    handleMiddleware,
    handleMiddlewareError,
    notFoundMiddleware
} from "./middleware";
import {EventDispatcher, IEventOptions} from "@appolo/events";
import {IApp, RouteAddedEvent} from "./IApp";
import {Defaults} from "./defaults";
import http = require('http');
import https = require('https');
import url = require('url');
import querystring = require('querystring');
import {IResponse, sendMiddleware} from "./response";
import {Events} from "./events/events";

export class Agent implements IApp {

    private _middlewares: MiddlewareHandlerOrAny[];
    private _middlewaresNotFound: MiddlewareHandlerOrAny[];
    private _middlewaresError: MiddlewareHandlerErrorOrAny[];

    private _server: http.Server | https.Server;
    private _router: Router;
    private _options: IOptions;
    private _qsParse: (path: string) => any;
    private _urlParse: (path: string) => ({ query: string, pathname?: string });
    private _requestApp: IApp;
    private _routes: Map<string, IRouteHandler>;
    private _isInitialized: boolean = false;
    private _events: Events;
    private _hooks: Hooks;

    private _onSentHook: IHook[] = []
    private _onResponseHook: IHook[] = []


    public constructor(options?: IOptions) {

        this._options = Objects.defaults(options || {}, Defaults);


        this._middlewares = [];
        this._middlewaresError = [];
        this._routes = new Map();

        this._router = new Router({
            useCache: this._options.useRouteCache,
            maxCacheSize: this._options.maxRouteCache,
            decodeUrlParams: this._options.decodeUrlParams
        });


        this._server = Server.createServer(this);

        this._requestApp = this;
        this._events = new Events();
        this._hooks = new Hooks();
    }

    private _initialize() {

        if (this._isInitialized) {
            return;
        }

        this._qsParse = this._options.qsParser || querystring.parse;
        this._urlParse = this._options.urlParser === "fast" ? Util.parseUrlFast : url.parse;


        this._middlewaresError.push(errorMiddleware);

        this._middlewaresNotFound = [...this._middlewares, notFoundMiddleware];

        for (let handler of this._routes.values()) {
            this._initializeHandler(handler);
        }

        this._onSentHook = this.hooks.hooks[HooksTypes.OnSend];
        this._onResponseHook = this.hooks.hooks[HooksTypes.OnResponse];

        this._isInitialized = true;
    }

    public get hooks(): Hooks {
        return this._hooks;
    }

    public get events(): Events {
        return this._events;
    }

    private _initializeHandler(handler: IRouteHandler) {

        Object.keys(this._hooks.hooks).forEach(hookName =>
            handler.hooks[hookName] = [...this._hooks.hooks[hookName], ...(handler.hooks[hookName] || [])]);

        if (handler.hooks.onSend.length) {
            handler.hooks.onSend.push(function (data, req, res, next) {
                res.send(data)
            });
        }

        handler.middlewares = [
            ...handler.hooks.onRequest as MiddlewareHandlerOrAny[],
            ...this._middlewares,
            ...handler.hooks.preMiddleware as MiddlewareHandlerOrAny[],
            ...handler.middlewares.slice(0, -1),
            ...handler.hooks.preHandler as MiddlewareHandlerOrAny[],
            handler.middlewares[handler.middlewares.length - 1]
        ];
        handler.errors = [
            ...handler.hooks.onError,
            ...handler.errors,
            ...this._middlewaresError];

        handler.hasResponseHook = !!handler.hooks.onResponse.length;
        handler.hasSendHook = !!handler.hooks.onSend.length
    }

    public set requestApp(app: IApp) {
        this._requestApp = app;
    }


    public handle = (request: http.IncomingMessage, response: http.ServerResponse) => {
        let $self = this, req: IRequest = request as any, res = response as any;
        try {

            let {query, pathname} = $self._urlParse(req.url);

            res.req = req;
            req.query = query.length ? $self._qsParse(query) : {};
            req.pathName = pathname;
            req.originUrl = req.url;
            req.app = $self._requestApp;

            let route = this._router.find(req.method as Methods, req.pathName);

            if (!route) {
                this._handleNotFound(response, req, res);
                return;
            }

            let handler: IRouteHandler = route.handler;

            if (handler.hasSendHook) {
                res.send = sendMiddleware.bind(res, handler.hooks.onSend, this._middlewaresError)
            }

            if (handler.hasResponseHook) {
                response.once("finish", function () {
                    handleMiddleware(req, res, handler.hooks.onResponse, []);
                })
            }

            req.params = route.params;
            req.route = handler.route;

            handleMiddleware(req, res, handler.middlewares, handler.errors);

        } catch (e) {
            handleMiddlewareError(req, res, this._middlewaresError, e);
        }
    };

    private _handleNotFound(response: http.ServerResponse, req: IRequest, res: IResponse) {
        if (this._onSentHook.length) {
            res.send = sendMiddleware.bind(res, this._onSentHook, this._middlewaresError)
        }

        if (this._onResponseHook.length) {
            let onResponseHook = this._onResponseHook;
            response.once("finish", function () {
                handleMiddleware(req, res, onResponseHook, []);
            })
        }
        handleMiddleware(req, res, this._middlewaresNotFound, this._middlewaresError);
    }

    public get options(): IOptions {
        return this._options;
    }

    public get(path: string, ...handler: MiddlewareHandlerParams[]): this {

        return this.add(Methods.GET, path, handler);
    }

    public post(path: string, ...handler: MiddlewareHandlerParams[]): this {
        return this.add(Methods.POST, path, handler);
    }

    public put(path: string, ...handler: MiddlewareHandlerParams[]): this {
        return this.add(Methods.PUT, path, handler);
    }

    public patch(path: string, ...handler: MiddlewareHandlerParams[]): this {
        return this.add(Methods.PATCH, path, handler);
    }

    public delete(path: string, ...handler: MiddlewareHandlerParams[]): this {
        return this.add(Methods.DELETE, path, handler);
    }

    public head(path: string, ...handler: MiddlewareHandlerParams[]): this {
        return this.add(Methods.HEAD, path, handler);
    }

    public all(path: string, ...handler: MiddlewareHandlerParams[]): this {
        this.add(Methods.GET, path, handler)
            .add(Methods.PATCH, path, handler)
            .add(Methods.POST, path, handler)
            .add(Methods.PUT, path, handler)
            .add(Methods.DELETE, path, handler)
            .add(Methods.HEAD, path, handler);

        return this;
    }

    public add(method: keyof typeof Methods, path: string, handlers: MiddlewareHandlerParams[], route?: any, hooks?: IHooks): this {

        handlers = Arrays.flat<MiddlewareHandlerParams>(handlers.map(handler => Array.isArray(handler) ? handler : [handler]));

        let result = Arrays.partition(handlers, handler => handler.length <= 3);

        let middlewares = result[0] as MiddlewareHandlerOrAny[];
        let errors = result[1] as MiddlewareHandlerErrorOrAny[];

        let dto = this._addRouteToRouter(method, path, middlewares, errors, route, hooks);

        if (method != Methods.HEAD) {
            this._addRouteToRouter(Methods.HEAD, path, middlewares.slice(), errors.slice(), route, Objects.clone(hooks));
        }

        if (method != Methods.OPTIONS) {
            this._addRouteToRouter(Methods.OPTIONS, path, middlewares.slice(0, -1), errors.slice(), route, Objects.clone(hooks));
        }

        (this._events.routeAdded as Event<RouteAddedEvent>).fireEvent({
            method: method as Methods,
            path,
            handler: dto
        });
        return this;
    }

    private _addRouteToRouter(method: keyof typeof Methods, path: string, middlewares: MiddlewareHandlerOrAny[], errors: MiddlewareHandlerErrorOrAny[], route: any, hooks: IHooks): IRouteHandler {

        let dto: IRouteHandler = {
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
        } else {
            this._router.add(method, path, dto);
            this._routes.set(routeKey, dto);
        }


        if (this._isInitialized) {
            this._initializeHandler(dto);
        }

        return dto;
    }

    public use(path?: string | MiddlewareHandlerParams, ...fn: MiddlewareHandlerParams[]): this {

        if (typeof path === "string") {
            return this.all(path, ...fn)
        } else {
            fn.unshift(path)
        }

        let result = Arrays.partition(fn, handler => handler.length <= 3);

        if (result[0].length) {
            this._middlewares.push(...result[0] as MiddlewareHandlerOrAny[]);
        }

        if (result[1].length) {
            this._middlewaresError.push(...result[1]);
        }

        return this
    }

    error(...fn: MiddlewareHandlerErrorOrAny[]): this {
        this._middlewaresError.push(...fn);
        return this
    }

    public get server(): http.Server | https.Server {
        return this._server
    }

    public get router(): Router {
        return this._router;
    }

    public async close(): Promise<void> {
        try {

            (this._events.beforeServerClosed as Event<void>).fireEvent();

            await Promises.fromCallback(c => this._server.close(c));

            (this._events.afterServerClosed as Event<void>).fireEvent();


        } catch (e) {
            if (e.message !== "Not running" && e.code !== "ERR_SERVER_NOT_RUNNING") {
                throw e;
            }
        }
    }

    public async listen(port: number, cb?: Function): Promise<Agent> {
        this._initialize();

        await (this._events.beforeServerOpen as Event<void>).fireEvent();

        await Promises.fromCallback(c => this._server.listen(port, c as any));

        await (this._events.afterServerOpen as Event<void>).fireEvent();

        (cb) && cb(this);

        return this;
    }


    public decorate(fn: (req: http.IncomingMessage, res: http.ServerResponse, app: IApp) => void) {
        fn(http.IncomingMessage.prototype, http.ServerResponse.prototype, this._requestApp.constructor.prototype)
    }
}
