import http = require('http');
import zlib = require('zlib');
import mime = require('mime');
import {IRequest} from "./request";
import {Objects, Arrays} from "@appolo/utils";
import {handleMiddleware} from "./middleware";
import {Util} from "./util";
import {Cookie, CookieSerializeOptions} from "./cookie";

const statusEmpty = {
    204: true,
    205: true,
    304: true
};
const emptyMethods = {
    HEAD: true,
};


export interface IResponse extends  IAppResponse {


}

interface IAppResponse extends http.ServerResponse{
    req: IRequest
    sending: boolean

    status(code: number): IResponse

    contentType(type: string): IResponse

    header(key: string, value: string): IResponse

    set(key: string, value: string): IResponse

    json(obj: object)

    jsonp(obj: object)

    send(data?: string | Buffer | any)

    gzip(options?: { min?: number }): IResponse

    cache(seconds: number): IResponse

    cookie(key: string, value: any, options?: CookieSerializeOptions): IResponse

    clearCookie(key: string, options?: CookieSerializeOptions): IResponse

    redirect(path: string): void
}

let proto: any = http.ServerResponse.prototype;

proto.status = function (code: number): IResponse {
    this.statusCode = code;
    return this
};

proto.contentType = function (type: string): IResponse {
    this.setHeader("Content-Type", type);
    return this;
};

proto.json = function (obj: any) {
    this.setHeader('Content-Type', "application/json; charset=utf-8");
    this.send(JSON.stringify(obj))
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

proto.set = proto.header = function (field: string | { [index: string]: string }, value?: number | string | string[]): IResponse {

    if (arguments.length === 2) {
        this.setHeader(field, value);

    } else {
        let keys = Object.keys(field);
        for (let i = 0, length = keys.length; i < length; i++) {
            let key = keys[i];
            this.setHeader(key, field[key]);
        }
    }

    return this
};

proto.cache = function (seconds: number) {
    this.setHeader("Cache-Control", `public, max-age=${seconds}`);

    return this;
};

proto.cookie = function (name: string, value: any, options?: CookieSerializeOptions): IResponse {
    let opts: CookieSerializeOptions = options || {};

    let val: string = Objects.isPlain(value) || Array.isArray(value) ? 'j:' + JSON.stringify(value) : String(value);

    if ('maxAge' in opts) {
        opts.expires = new Date(Date.now() + opts.maxAge);
        opts.maxAge /= 1000;
    }

    if (opts.path == null) {
        opts.path = '/';
    }

    this.append('Set-Cookie', Cookie.serialize(name, val, opts));

    return this;
};

proto.clearCookie = function (name: string, options?: CookieSerializeOptions): IResponse {
    let opts: CookieSerializeOptions = options || {};
    opts.expires = new Date(1);
    opts.path = '/';

    this.cookie(name, '', opts);

    return this;
}

proto.redirect = function (path: string): void {

    if (this.statusCode) {
        this.statusCode = 302;
    }
    this.setHeader("Location", path);
    this.send()
}

proto.get = function (field: string): string | string[] {
    return this.getHeader(field);
};

proto.append = function (field: string, value: string): IResponse {
    let current = this.getHeader(field);

    if (!current) {
        return this.setHeader(field, value)
    }
    let val: string[] = Array.isArray(current)
        ? current.concat(value)
        : (Array.isArray(value) ? [current].concat(value) : [current, value]);

    return this.setHeader(field, val);
};


proto.gzip = function ({min = 1000}: { min?: number } = {}) {

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

proto.contentType = proto.type = function contentType(type: string) {
    let ct = type.indexOf('/') === -1
        ? mime.getType(type)
        : type;

    return this.set('Content-Type', ct);
};

proto.jsonp = function (data: any) {
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

function checkHeaders(data: string | Buffer | any) {
    if (!this.hasHeader("Content-Type")) {
        if (typeof data === 'string' || this.getHeader("Content-Encoding") == "gzip") {
            this.setHeader("Content-Type", "text/plain;charset=utf-8");
        } else if (Buffer.isBuffer(data)) {
            this.setHeader("Content-Type", "application/octet-stream");
        } else {
            data = JSON.stringify(data);
            this.setHeader("Content-Type", "application/json; charset=utf-8");
        }
    }
    return data;
}

function send(data?: string | Buffer | any) {

    this.sending = true;

    let isEmptyStatusCode = statusEmpty[this.statusCode || (this.statusCode = 200)];

    //send empty
    if (isEmptyStatusCode || data == undefined) {
        this.setHeader('Content-Length', '0');
        this.end();
        return
    }

    data = checkHeaders.call(this, data);

    this.setHeader('Content-Length', Buffer.byteLength(data as string, 'utf8'));

    this.end(data);
}

export function sendMiddleware(middlewares, middlewaresError, data?: string | Buffer) {
    this.send = send.bind(this);
    handleMiddleware(this.req, this, middlewares, middlewaresError, 0, null, data);
}

proto.send = send;

export function createResponse(request: http.IncomingMessage, response: http.ServerResponse): IResponse {
    let res = response as IResponse;
    (res as any).req = request as IRequest;
    return res;
}

export let Response = http.ServerResponse;
