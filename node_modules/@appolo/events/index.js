"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = exports.CallbacksSymbol = exports.EventDispatcher = void 0;
var eventDispatcher_1 = require("./lib/eventDispatcher");
Object.defineProperty(exports, "EventDispatcher", { enumerable: true, get: function () { return eventDispatcher_1.EventDispatcher; } });
var consts_1 = require("./lib/consts");
Object.defineProperty(exports, "CallbacksSymbol", { enumerable: true, get: function () { return consts_1.CallbacksSymbol; } });
var event_1 = require("./lib/event");
Object.defineProperty(exports, "Event", { enumerable: true, get: function () { return event_1.Event; } });
//# sourceMappingURL=index.js.map