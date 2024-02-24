import {IOptions} from "./IOptions";
import {Methods} from "./enums";
import {Tree} from "./tree";
import {Util} from "./util";
import {Params} from "./leaf";

export class Router {


    private _forest: { [index: string]: Tree } = {};

    private _staticRoutes: { [index: string]: { [index: string]: any } } = {};
    private _cachedRoutes: { [index: string]: Map<string, { params: Params, handler: any }> } = {};
    private readonly _options: IOptions;
    private readonly _useCache: boolean;

    public constructor(options?: IOptions) {

        this._options = Object.assign({
            useCache: true,
            decodeUrlParams: false,
            maxCacheSize: 10000
        }, options || {});

        this._useCache = this._options.useCache;

        this.reset();
    }

    public reset() {
        Object.keys(Methods)
            .forEach(method => this._forest[method] = new Tree(this._options));

        Object.keys(Methods)
            .forEach(method => this._staticRoutes[method] = {});

        Object.keys(Methods)
            .forEach(method => this._cachedRoutes[method] = new Map<string, { params: Params, handler: any }>());

    }

    public get(path: string, handler: any): this {
        return this.add(Methods.GET, path, handler);
    }

    public post(path: string, handler: any): this {
        return this.add(Methods.POST, path, handler);
    }

    public put(path: string, handler: any): this {
        return this.add(Methods.PUT, path, handler);
    }

    public patch(path: string, handler: any): this {
        return this.add(Methods.PATCH, path, handler);
    }

    public delete(path: string, handler: any): this {
        return this.add(Methods.DELETE, path, handler);
    }

    public head(path: string, handler: any): this {
        return this.add(Methods.HEAD, path, handler);
    }

    public add(method: keyof typeof Methods | (keyof typeof Methods)[], path: string, handler: any): this {

        path = Util.removeHeadSlash(path);

        this._add(method, path, handler);

        return this;
    }

    private _add(method: keyof typeof Methods | (keyof typeof Methods)[], path: string, handler: any): this {
        path = Util.removeTailSlash(path);

        let parts = path.split("/");

        let methods = Array.isArray(method) ? method : [method];

        methods.forEach(method => {
            let tree = this._forest[method];

            let leaf = tree.add(parts);

            leaf.handler = handler;

            if (Util.isStaticRoute(path)) {
                this._staticRoutes[method][`/${path}`] = handler;
                this._staticRoutes[method][`/${path}/`] = handler;
            }
        });

        return this
    }

    public remove(method: keyof typeof Methods | (keyof typeof Methods)[], path: string) {
        path = Util.removeTailSlash(path);
        path = Util.removeHeadSlash(path);

        let methods = Array.isArray(method) ? method : [method];

        let parts = path.split("/");

        methods.forEach(method => {

            let tree = this._forest[method];

            tree.remove(parts, 0);

            if (Util.isStaticRoute(path)) {
                delete this._staticRoutes[method][`/${path}`];
                delete this._staticRoutes[method][`/${path}/`];
            }

            this._cachedRoutes[method].delete(`/${path}`);
            this._cachedRoutes[method].delete(`/${path}/`);
        });
    }

    public find(method: keyof typeof Methods, path: string): { params: Params, handler: any } {

        let staticRote = this._staticRoutes[method][path];

        if (staticRote) {
            return {handler: staticRote, params: {}}
        }

        let map = this._cachedRoutes[method];

        if (this._useCache) {
            let cached = map.get(path);

            if (cached) {
                return {handler: cached.handler, params: cached.params}
            }
        }

        let parts = path.split("/");

        //remove "/"
        if (parts[parts.length - 1] == "") {
            parts.pop();
        }

        let tree = this._forest[method];

        let params = {};

        let found = tree.check(parts, 0, params);

        if (!found) {
            return null;
        }

        let dto = {params, handler: found.handler};

        map.set(path, dto);

        if(map.size > this._options.maxCacheSize){
            map.delete(map.keys().next().value)
        }

        return dto;
    }

}
