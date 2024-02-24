"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const enums_1 = require("./enums");
const tree_1 = require("./tree");
const util_1 = require("./util");
class Router {
    constructor(options) {
        this._forest = {};
        this._staticRoutes = {};
        this._cachedRoutes = {};
        this._options = Object.assign({
            useCache: true,
            decodeUrlParams: false,
            maxCacheSize: 10000
        }, options || {});
        this._useCache = this._options.useCache;
        this.reset();
    }
    reset() {
        Object.keys(enums_1.Methods)
            .forEach(method => this._forest[method] = new tree_1.Tree(this._options));
        Object.keys(enums_1.Methods)
            .forEach(method => this._staticRoutes[method] = {});
        Object.keys(enums_1.Methods)
            .forEach(method => this._cachedRoutes[method] = new Map());
    }
    get(path, handler) {
        return this.add(enums_1.Methods.GET, path, handler);
    }
    post(path, handler) {
        return this.add(enums_1.Methods.POST, path, handler);
    }
    put(path, handler) {
        return this.add(enums_1.Methods.PUT, path, handler);
    }
    patch(path, handler) {
        return this.add(enums_1.Methods.PATCH, path, handler);
    }
    delete(path, handler) {
        return this.add(enums_1.Methods.DELETE, path, handler);
    }
    head(path, handler) {
        return this.add(enums_1.Methods.HEAD, path, handler);
    }
    add(method, path, handler) {
        path = util_1.Util.removeHeadSlash(path);
        this._add(method, path, handler);
        return this;
    }
    _add(method, path, handler) {
        path = util_1.Util.removeTailSlash(path);
        let parts = path.split("/");
        let methods = Array.isArray(method) ? method : [method];
        methods.forEach(method => {
            let tree = this._forest[method];
            let leaf = tree.add(parts);
            leaf.handler = handler;
            if (util_1.Util.isStaticRoute(path)) {
                this._staticRoutes[method][`/${path}`] = handler;
                this._staticRoutes[method][`/${path}/`] = handler;
            }
        });
        return this;
    }
    remove(method, path) {
        path = util_1.Util.removeTailSlash(path);
        path = util_1.Util.removeHeadSlash(path);
        let methods = Array.isArray(method) ? method : [method];
        let parts = path.split("/");
        methods.forEach(method => {
            let tree = this._forest[method];
            tree.remove(parts, 0);
            if (util_1.Util.isStaticRoute(path)) {
                delete this._staticRoutes[method][`/${path}`];
                delete this._staticRoutes[method][`/${path}/`];
            }
            this._cachedRoutes[method].delete(`/${path}`);
            this._cachedRoutes[method].delete(`/${path}/`);
        });
    }
    find(method, path) {
        let staticRote = this._staticRoutes[method][path];
        if (staticRote) {
            return { handler: staticRote, params: {} };
        }
        let map = this._cachedRoutes[method];
        if (this._useCache) {
            let cached = map.get(path);
            if (cached) {
                return { handler: cached.handler, params: cached.params };
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
        let dto = { params, handler: found.handler };
        map.set(path, dto);
        if (map.size > this._options.maxCacheSize) {
            map.delete(map.keys().next().value);
        }
        return dto;
    }
}
exports.Router = Router;
//# sourceMappingURL=router.js.map