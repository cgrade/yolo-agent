"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = exports.createResponse = exports.sendMiddleware = void 0;
const http = require("http");
const zlib = require("zlib");
const mime = require("mime");
const utils_1 = require("@appolo/utils");
const middleware_1 = require("./middleware");
const cookie_1 = require("./cookie");
const statusEmpty = {
    204: true,
    205: true,
    304: true
};
const emptyMethods = {
    HEAD: true,
};
let proto = http.ServerResponse.prototype;
proto.status = function (code) {
    this.statusCode = code;
    return this;
};
proto.contentType = function (type) {
    this.setHeader("Content-Type", type);
    return this;
};
proto.json = function (obj) {
    this.setHeader('Content-Type', "application/json; charset=utf-8");
    this.send(JSON.stringify(obj));
};
// proto.render = function (this:IResponse,path: string | string[], params?: any): Promise<void> {
//
//     this.sending = true;
//
//     if (arguments.length == 1 && typeof path !== "string") {
//         params = path;
//         path = "";
//     }
//
//     let paths = Array.isArray(path) ? path : [path];
//
//
//     if (!this.hasHeader("Content-Type")) {
//         this.setHeader("Content-Type", "text/html;charset=utf-8")
//     }
//
//     return this.req.app.$view.render(paths, params, this)
//         .then((str: string) => this.send(str))
//         .catch((e) => {
//             this.sending = false;
//             this.req.next(e)
//         })
// };
proto.set = proto.header = function (field, value) {
    if (arguments.length === 2) {
        this.setHeader(field, value);
    }
    else {
        let keys = Object.keys(field);
        for (let i = 0, length = keys.length; i < length; i++) {
            let key = keys[i];
            this.setHeader(key, field[key]);
        }
    }
    return this;
};
proto.cache = function (seconds) {
    this.setHeader("Cache-Control", `public, max-age=${seconds}`);
    return this;
};
proto.cookie = function (name, value, options) {
    let opts = options || {};
    let val = utils_1.Objects.isPlain(value) || Array.isArray(value) ? 'j:' + JSON.stringify(value) : String(value);
    if ('maxAge' in opts) {
        opts.expires = new Date(Date.now() + opts.maxAge);
        opts.maxAge /= 1000;
    }
    if (opts.path == null) {
        opts.path = '/';
    }
    this.append('Set-Cookie', cookie_1.Cookie.serialize(name, val, opts));
    return this;
};
proto.clearCookie = function (name, options) {
    let opts = options || {};
    opts.expires = new Date(1);
    opts.path = '/';
    this.cookie(name, '', opts);
    return this;
};
proto.redirect = function (path) {
    if (this.statusCode) {
        this.statusCode = 302;
    }
    this.setHeader("Location", path);
    this.send();
};
proto.get = function (field) {
    return this.getHeader(field);
};
proto.append = function (field, value) {
    let current = this.getHeader(field);
    if (!current) {
        return this.setHeader(field, value);
    }
    let val = Array.isArray(current)
        ? current.concat(value)
        : (Array.isArray(value) ? [current].concat(value) : [current, value]);
    return this.setHeader(field, val);
};
proto.gzip = function ({ min = 1000 } = {}) {
    let old = this.send, $self = this;
    this.send = function (data) {
        if (!data) {
            old.call($self, data);
            return;
        }
        this.sending = true;
        data = checkHeaders.call(this, data);
        if (data.length < min) {
            old.call($self, data);
            return;
        }
        zlib.gzip(data, (err, gziped) => {
            if (err) {
                old.call($self, data);
                return;
            }
            $self.setHeader('Content-Encoding', "gzip");
            old.call($self, gziped);
        });
    };
    return this;
};
proto.contentType = proto.type = function contentType(type) {
    let ct = type.indexOf('/') === -1
        ? mime.getType(type)
        : type;
    return this.set('Content-Type', ct);
};
proto.jsonp = function (data) {
    let body = data;
    if (this.req.method == "GET" && this.req.query["callback"]) {
        if (!this.getHeader('Content-Type')) {
            this.setHeader('X-Content-Type-Options', 'nosniff');
            this.setHeader('Content-Type', 'text/javascript');
        }
        let callback = this.req.query["callback"].replace(/[^\[\]\w$.]/g, '');
        body = JSON.stringify(data)
            .replace(/\u2028/g, '\\u2028')
            .replace(/\u2029/g, '\\u2029');
        body = `/**/ typeof ${callback} === 'function' && ${callback}(${body});`;
    }
    this.send(body);
};
function checkHeaders(data) {
    if (!this.hasHeader("Content-Type")) {
        if (typeof data === 'string' || this.getHeader("Content-Encoding") == "gzip") {
            this.setHeader("Content-Type", "text/plain;charset=utf-8");
        }
        else if (Buffer.isBuffer(data)) {
            this.setHeader("Content-Type", "application/octet-stream");
        }
        else {
            data = JSON.stringify(data);
            this.setHeader("Content-Type", "application/json; charset=utf-8");
        }
    }
    return data;
}
function send(data) {
    this.sending = true;
    let isEmptyStatusCode = statusEmpty[this.statusCode || (this.statusCode = 200)];
    //send empty
    if (isEmptyStatusCode || data == undefined) {
        this.setHeader('Content-Length', '0');
        this.end();
        return;
    }
    data = checkHeaders.call(this, data);
    this.setHeader('Content-Length', Buffer.byteLength(data, 'utf8'));
    this.end(data);
}
function sendMiddleware(middlewares, middlewaresError, data) {
    this.send = send.bind(this);
    (0, middleware_1.handleMiddleware)(this.req, this, middlewares, middlewaresError, 0, null, data);
}
exports.sendMiddleware = sendMiddleware;
proto.send = send;
function createResponse(request, response) {
    let res = response;
    res.req = request;
    return res;
}
exports.createResponse = createResponse;
exports.Response = http.ServerResponse;
//# sourceMappingURL=response.js.map