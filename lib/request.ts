import http = require('http');
import {parse} from "url";
import {NextFn} from "./types";
import {IApp} from "./IApp";
import {Util} from "./util";
import {Typeis} from "./typeis";


export interface IRequest extends http.IncomingMessage, AppRequest {

}

interface AppRequest {
    query?: { [index: string]: any }
    app: IApp;
    route: any;
    body?: { [index: string]: any }
    params?: { [index: string]: any }
    next?: NextFn
    pathName: string
    originUrl: string;
    ip: string;

    is(types: string | string[]): boolean

    get(name: string): string

    header(name: string): string

    protocol: string
    hostname: string
    secure: boolean
    pathname: boolean
    fullUrl: string

}

let proto = (http.IncomingMessage.prototype as any);


proto.is = function (...types: (string | string[])[]) {

    return Typeis.isType(this.headers['content-type'], ...types);
};


proto.get = proto.header = function (name: string) {

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

    return Util.detectIpFromHeaders(this) || []

});

defineGetter(proto, 'ip', function () {
    return this.ips[0] || Util.detectIpFromConnectionOrSocket(this) || "";
});

defineGetter(proto, 'path', function () {
    return parse(this.url).pathname;
});

defineGetter(proto, 'fullUrl', function () {
    return `${this.protocol}://${this.hostname}${this.url}`
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


export function createRequest(request: http.IncomingMessage): IRequest {
    let req = request as IRequest;
    return req;
}

export let Request = http.IncomingMessage;
