"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseCreate = void 0;
const promises_1 = require("./promises");
class PromiseCreate {
    constructor(fn) {
        this.fn = fn;
    }
    timeout(timeout) {
        let fn = this.fn;
        this.fn = () => promises_1.Promises.timeout(fn(), timeout);
        return this;
    }
    delay(time) {
        let fn = this.fn;
        this.fn = () => promises_1.Promises.delay(time).then(() => fn());
        return this;
    }
    retry(options = 1) {
        let fn = this.fn;
        this.fn = () => promises_1.Promises.retry(fn, options);
        return this;
    }
    run() {
        return this.fn();
    }
    runTo() {
        return promises_1.Promises.to(this.fn());
    }
}
exports.PromiseCreate = PromiseCreate;
//# sourceMappingURL=promiseCreate.js.map