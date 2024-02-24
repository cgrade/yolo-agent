import {HooksTypes, IHook, IHooks, MiddlewareHandler, MiddlewareHandlerData, MiddlewareHandlerError} from "../types";
import {Enums} from "@appolo/utils/index";

export class Hooks {

    private _hooks: IHooks = {};

    constructor() {
        Enums.enumValues<HooksTypes>(HooksTypes).forEach(hook => this._hooks[hook] = []);

    }

    public get hooks():IHooks {
        return this._hooks;
    }

    public onError(...hook: MiddlewareHandlerError[]):this {
        this.addHook(HooksTypes.OnError,...hook);
        return this
    }

    public onRequest(...hook: MiddlewareHandler[]):this {
        this.addHook(HooksTypes.OnRequest,...hook);
        return this
    }

    public onPreMiddleware(...hook: MiddlewareHandler[]):this {
        this.addHook(HooksTypes.PreMiddleware,...hook);
        return this;
    }

    public onPreHandler(...hook: MiddlewareHandler[]):this {
        this.addHook(HooksTypes.PreHandler,...hook);
        return this
    }

    public onResponse(...hook: MiddlewareHandler[]):this {
        this.addHook(HooksTypes.OnResponse,...hook);
        return this
    }

    public onSend(...hook: MiddlewareHandlerData[]):this {
        this.addHook(HooksTypes.OnSend,...hook);
        return this
    }

    public addHook(name: HooksTypes.OnError, ...hook: MiddlewareHandlerError[]): this
    public addHook(name: HooksTypes.OnResponse | HooksTypes.PreMiddleware | HooksTypes.PreHandler | HooksTypes.OnRequest, ...hook: MiddlewareHandler[]): this
    public addHook(name: HooksTypes.OnSend, ...hook: MiddlewareHandlerData[]): this
    public addHook(name: HooksTypes, ...hook: IHook[]): this {

        this._hooks[name].push(...hook);

        return this
    }


}
