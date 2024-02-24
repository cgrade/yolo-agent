"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = exports.createRequest = void 0;
const http = require("http");
const url_1 = require("url");
const util_1 = require("./util");
const typeis_1 = require("./typeis");
let proto = http.IncomingMessage.prototype;
proto.is = function (...types) {
    return typeis_1.Typeis.isType(this.headers['content-type'], ...types);
};
proto.get = proto.header = function (name) {
    let nameLower = name.toLowerCase();
    switch (nameLower) {
        case 'referer':
        case 'referrer':
            return this.headers.referrer
                || this.headers.referer;
        default:
            return this.headers[nameLower];
    }
};
defineGetter(proto, 'protocol', function () {
    let protocol = this.connection.encrypted
        ? 'https'
        : 'http';
    let header = this.headers['x-forwarded-proto'] || protocol;
    let headerArr = header.split(',');
    return headerArr[0].trim();
});
defineGetter(proto, 'secure', function () {
    return this.protocol === 'https';
});
defineGetter(proto, 'originalUrl', function () {
    return this.url;
});
defineGetter(proto, 'ips', function () {
    if (!this.app || !this.app.options.trustProxy) {
        return [];
    }
    return util_1.Util.detectIpFromHeaders(this) || [];
});
defineGetter(proto, 'ip', function () {
    return this.ips[0] || util_1.Util.detectIpFromConnectionOrSocket(this) || "";
});
defineGetter(proto, 'path', function () {
    return (0, url_1.parse)(this.url).pathname;
});
defineGetter(proto, 'fullUrl', function () {
    return `${this.protocol}://${this.hostname}${this.url}`;
});
defineGetter(proto, 'hostname', function () {
    let host = this.headers['x-forwarded-host'];
    if (!host) {
        host = this.headers['host'];
    }
    if (!host) {
        return "";
    }
    return host.split(",")[0].trim();
});
function defineGetter(obj, name, getter) {
    Object.defineProperty(obj, name, {
        configurable: true,
        enumerable: true,
        get: getter,
        set: function (value) {
            this["_" + name] = value;
        }
    });
}
function createRequest(request) {
    let req = request;
    return req;
}
exports.createRequest = createRequest;
exports.Request = http.IncomingMessage;
//# sourceMappingURL=request.js.map