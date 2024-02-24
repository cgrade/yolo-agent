"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
const index_1 = require("@appolo/events/index");
class Events {
    constructor() {
        this.routeAdded = new index_1.Event();
        this.beforeServerClosed = new index_1.Event();
        this.afterServerClosed = new index_1.Event();
        this.beforeServerOpen = new index_1.Event();
        this.afterServerOpen = new index_1.Event();
    }
}
exports.Events = Events;
//# sourceMappingURL=events.js.map