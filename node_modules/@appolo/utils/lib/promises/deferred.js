"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deferred = void 0;
class Deferred {
    constructor() {
        this._promise = new Promise((resolve, reject) => {
            this._resolveSelf = resolve;
            this._rejectSelf = reject;
        });
    }
    get promise() {
        return this._promise;
    }
    resolve(val) {
        this._resolveSelf(val);
    }
    reject(reason) {
        this._rejectSelf(reason);
    }
}
exports.Deferred = Deferred;
//# sourceMappingURL=deferred.js.map