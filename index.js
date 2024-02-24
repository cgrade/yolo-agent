"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAgent = exports.Events = exports.Hooks = exports.HooksTypes = exports.Methods = exports.Response = exports.Request = exports.NotFoundError = exports.UnauthorizedError = exports.InternalServerError = exports.BadRequestError = exports.HttpError = exports.Agent = void 0;
const agent_1 = require("./lib/agent");
var agent_2 = require("./lib/agent");
Object.defineProperty(exports, "Agent", { enumerable: true, get: function () { return agent_2.Agent; } });
var httpError_1 = require("./lib/errors/httpError");
Object.defineProperty(exports, "HttpError", { enumerable: true, get: function () { return httpError_1.HttpError; } });
var badRequestError_1 = require("./lib/errors/badRequestError");
Object.defineProperty(exports, "BadRequestError", { enumerable: true, get: function () { return badRequestError_1.BadRequestError; } });
var internalServerError_1 = require("./lib/errors/internalServerError");
Object.defineProperty(exports, "InternalServerError", { enumerable: true, get: function () { return internalServerError_1.InternalServerError; } });
var unauthorizedError_1 = require("./lib/errors/unauthorizedError");
Object.defineProperty(exports, "UnauthorizedError", { enumerable: true, get: function () { return unauthorizedError_1.UnauthorizedError; } });
var notFoundError_1 = require("./lib/errors/notFoundError");
Object.defineProperty(exports, "NotFoundError", { enumerable: true, get: function () { return notFoundError_1.NotFoundError; } });
var request_1 = require("./lib/request");
Object.defineProperty(exports, "Request", { enumerable: true, get: function () { return request_1.Request; } });
var response_1 = require("./lib/response");
Object.defineProperty(exports, "Response", { enumerable: true, get: function () { return response_1.Response; } });
var router_1 = require("@appolo/router");
Object.defineProperty(exports, "Methods", { enumerable: true, get: function () { return router_1.Methods; } });
var types_1 = require("./lib/types");
Object.defineProperty(exports, "HooksTypes", { enumerable: true, get: function () { return types_1.HooksTypes; } });
var hooks_1 = require("./lib/events/hooks");
Object.defineProperty(exports, "Hooks", { enumerable: true, get: function () { return hooks_1.Hooks; } });
var events_1 = require("./lib/events/events");
Object.defineProperty(exports, "Events", { enumerable: true, get: function () { return events_1.Events; } });
function createAgent(options) {
    return new agent_1.Agent(options);
}
exports.createAgent = createAgent;
function default_1(options) {
    return new agent_1.Agent(options);
}
exports.default = default_1;
//# sourceMappingURL=index.js.map