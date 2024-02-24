export interface CookieSerializeOptions {


    domain?: string;

    encode?(value: string): string;

    expires?: Date;

    httpOnly?: boolean;

    maxAge?: number;

    path?: string;

    sameSite?: true | false | 'lax' | 'strict' | 'none';

    secure?: boolean;

}

export class Cookie {
    public static serialize(name: string, val: string, options?: CookieSerializeOptions) {
        let opt = options || {},
            enc = opt.encode || encodeURIComponent,
            fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;


        if (typeof enc !== 'function') {
            throw new TypeError('option encode is invalid');
        }

        if (!fieldContentRegExp.test(name)) {
            throw new TypeError('argument name is invalid');
        }

        let value = enc(val);

        if (value && !fieldContentRegExp.test(value)) {
            throw new TypeError('argument val is invalid');
        }

        let str = name + '=' + value;

        if (null != opt.maxAge) {
            let maxAge = opt.maxAge - 0;

            if (isNaN(maxAge) || !isFinite(maxAge)) {
                throw new TypeError('option maxAge is invalid')
            }

            str += '; Max-Age=' + Math.floor(maxAge);
        }

        if (opt.domain) {
            if (!fieldContentRegExp.test(opt.domain)) {
                throw new TypeError('option domain is invalid');
            }

            str += '; Domain=' + opt.domain;
        }

        if (opt.path) {
            if (!fieldContentRegExp.test(opt.path)) {
                throw new TypeError('option path is invalid');
            }

            str += '; Path=' + opt.path;
        }

        if (opt.expires) {
            if (typeof opt.expires.toUTCString !== 'function') {
                throw new TypeError('option expires is invalid');
            }

            str += '; Expires=' + opt.expires.toUTCString();
        }

        if (opt.httpOnly) {
            str += '; HttpOnly';
        }

        if (opt.secure) {
            str += '; Secure';
        }

        if (opt.sameSite) {
            let sameSite = typeof opt.sameSite === 'string'
                ? opt.sameSite.toLowerCase() : opt.sameSite;

            switch (sameSite) {
                case true:
                    str += '; SameSite=Strict';
                    break;
                case 'lax':
                    str += '; SameSite=Lax';
                    break;
                case 'strict':
                    str += '; SameSite=Strict';
                    break;
                case 'none':
                    str += '; SameSite=None';
                    break;
                default:
                    throw new TypeError('option sameSite is invalid');
            }
        }

        return str;
    }
}
