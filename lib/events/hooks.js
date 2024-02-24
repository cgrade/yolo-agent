"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hooks = void 0;
const types_1 = require("../types");
const index_1 = require("@appolo/utils/index");
class Hooks {
    constructor() {
        this._hooks = {};
        index_1.Enums.enumValues(types_1.HooksTypes).forEach(hook => this._hooks[hook] = []);
    }
    get hooks() {
        return this._hooks;
    }
    onError(...hook) {
        this.addHook(types_1.HooksTypes.OnError, ...hook);
        return this;
    }
    onRequest(...hook) {
        this.addHook(types_1.HooksTypes.OnRequest, ...hook);
        return this;
    }
    onPreMiddleware(...hook) {
        this.addHook(types_1.HooksTypes.PreMiddleware, ...hook);
        return this;
    }
    onPreHandler(...hook) {
        this.addHook(types_1.HooksTypes.PreHandler, ...hook);
        return this;
    }
    onResponse(...hook) {
        this.addHook(types_1.HooksTypes.OnResponse, ...hook);
        return this;
    }
    onSend(...hook) {
        this.addHook(types_1.HooksTypes.OnSend, ...hook);
        return this;
    }
    addHook(name, ...hook) {
        this._hooks[name].push(...hook);
        return this;
    }
}
exports.Hooks = Hooks;
//# sourceMappingURL=hooks.js.map