"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const sinonChai = require("sinon-chai");
const typeis_1 = require("../lib/typeis");
const cookie_1 = require("../lib/cookie");
chai.use(sinonChai);
let should = chai.should();
describe("Unit Type is", function () {
    it('should return valid typeis', function () {
        typeis_1.Typeis.isType("text/html; charset=utf-8", ['text/*']).should.be.eq("text/html");
        typeis_1.Typeis.isType("text/HTML; charset=utf-8", ['text/*']).should.be.eq("text/html");
        typeis_1.Typeis.isType("text/html", ['text/html/']).should.be.eq(false);
        typeis_1.Typeis.isType("text/html", [undefined, null]).should.be.eq(false);
        //Typeis.isType("text/html**",['text/*']).should.be.eq(false)
        typeis_1.Typeis.isType("text/HTML; charset=utf-8", 'text/text', 'text/html').should.be.eq("text/html");
        typeis_1.Typeis.isType("image/png", ['png']).should.be.eq('png');
        typeis_1.Typeis.isType("image/png", ['.png']).should.be.eq('.png');
        typeis_1.Typeis.isType("image/png", ['image/png']).should.be.eq('image/png');
        typeis_1.Typeis.isType("image/png", ['image/*']).should.be.eq('image/png');
        typeis_1.Typeis.isType("image/png", ['*/png']).should.be.eq('image/png');
        typeis_1.Typeis.isType("image/png", ['jpeg']).should.be.eq(false);
        typeis_1.Typeis.isType("image/png", ['.jpeg']).should.be.eq(false);
        typeis_1.Typeis.isType("image/png", ['image/jpeg']).should.be.eq(false);
        typeis_1.Typeis.isType("image/png", ['text/*']).should.be.eq(false);
        typeis_1.Typeis.isType("image/png", ['*/jpeg']).should.be.eq(false);
        typeis_1.Typeis.isType("image/png", ['bogus']).should.be.eq(false);
        typeis_1.Typeis.isType("image/png", ['something/bogus*']).should.be.eq(false);
        typeis_1.Typeis.isType('image/png', ['png']).should.be.eq('png');
        typeis_1.Typeis.isType('image/png', '.png').should.be.eq('.png');
        typeis_1.Typeis.isType('image/png', ['text/*', 'image/*']).should.be.eq('image/png');
        typeis_1.Typeis.isType('image/png', ['image/*', 'text/*']).should.be.eq('image/png');
        typeis_1.Typeis.isType('image/png', ['image/*', 'image/png']).should.be.eq('image/png');
        typeis_1.Typeis.isType('image/png', 'image/png', 'image/*').should.be.eq('image/png');
        typeis_1.Typeis.isType('image/png', ['jpeg']).should.be.eq(false);
        typeis_1.Typeis.isType('image/png', ['.jpeg']).should.be.eq(false);
        typeis_1.Typeis.isType('image/png', ['text/*', 'application/*']).should.be.eq(false);
        typeis_1.Typeis.isType('image/png', ['text/html', 'text/plain', 'application/json']).should.be.eq(false);
        typeis_1.Typeis.isType('application/vnd+json', '+json').should.be.eq('application/vnd+json');
        typeis_1.Typeis.isType('application/vnd+json', 'application/vnd+json').should.be.eq('application/vnd+json');
        typeis_1.Typeis.isType('application/vnd+json', 'application/*+json').should.be.eq('application/vnd+json');
        typeis_1.Typeis.isType('application/vnd+json', '*/vnd+json').should.be.eq('application/vnd+json');
        typeis_1.Typeis.isType('application/vnd+json', 'application/json').should.be.eq(false);
        typeis_1.Typeis.isType('application/vnd+json', 'text/*+json').should.be.eq(false);
        typeis_1.Typeis.isType('text/html', '*/*').should.be.eq('text/html');
        typeis_1.Typeis.isType('text/xml', '*/*').should.be.eq('text/xml');
        typeis_1.Typeis.isType('application/json', '*/*').should.be.eq('application/json');
        typeis_1.Typeis.isType('application/vnd+json', '*/*').should.be.eq('application/vnd+json');
        typeis_1.Typeis.isType('multipart/form-data', ['multipart/*']).should.be.eq('multipart/form-data');
        typeis_1.Typeis.isType('multipart/form-data', ['multipart']).should.be.eq('multipart');
        typeis_1.Typeis.isType('application/x-www-form-urlencoded', ['urlencoded']).should.be.eq('urlencoded');
        typeis_1.Typeis.isType('application/x-www-form-urlencoded', ['json', 'urlencoded']).should.be.eq('urlencoded');
        typeis_1.Typeis.isType('application/x-www-form-urlencoded', ['urlencoded', 'json']).should.be.eq('urlencoded');
    });
});
describe("Cookies", function () {
    it('should serialize', function () {
        cookie_1.Cookie.serialize('foo', 'bar', { path: '/' }).should.be.eq('foo=bar; Path=/');
        cookie_1.Cookie.serialize('foo', 'bar', { secure: true }).should.be.eq('foo=bar; Secure');
        cookie_1.Cookie.serialize('foo', 'bar', { secure: false }).should.be.eq('foo=bar');
        cookie_1.Cookie.serialize('foo', 'bar', { domain: 'example.com' }).should.be.eq('foo=bar; Domain=example.com');
        cookie_1.Cookie.serialize.bind(null, 'foo', 'bar', { domain: 'example.com\n' }).should.throw(/option domain is invalid/);
        cookie_1.Cookie.serialize.bind(null, 'foo', 'bar', { maxAge: 'buzz' }).should.throw(/option maxAge is invalid/);
        cookie_1.Cookie.serialize.bind(null, 'foo', 'bar', { expires: Date.now() }).should.throw(/option expires is invalid/);
        cookie_1.Cookie.serialize('foo', 'bar', { httpOnly: true }).should.be.eq('foo=bar; HttpOnly');
        cookie_1.Cookie.serialize('foo', 'bar', { maxAge: 1000 }).should.be.eq('foo=bar; Max-Age=1000');
        cookie_1.Cookie.serialize('foo', 'bar', { maxAge: 0 }).should.be.eq('foo=bar; Max-Age=0');
        cookie_1.Cookie.serialize('foo', 'bar', { maxAge: null }).should.be.eq('foo=bar');
        cookie_1.Cookie.serialize('foo', 'bar', { expires: new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900)) }).should.be.eq('foo=bar; Expires=Sun, 24 Dec 2000 10:30:59 GMT');
        cookie_1.Cookie.serialize('foo', 'bar', { sameSite: true }).should.be.eq('foo=bar; SameSite=Strict');
        cookie_1.Cookie.serialize('foo', 'bar', { sameSite: 'strict' }).should.be.eq('foo=bar; SameSite=Strict');
        cookie_1.Cookie.serialize('foo', 'bar', { sameSite: 'lax' }).should.be.eq('foo=bar; SameSite=Lax');
        cookie_1.Cookie.serialize('foo', 'bar', { sameSite: 'none' }).should.be.eq('foo=bar; SameSite=None');
        cookie_1.Cookie.serialize('foo', 'bar', { sameSite: false }).should.be.eq('foo=bar');
        cookie_1.Cookie.serialize('foo', '+', { sameSite: false }).should.be.eq('foo=%2B');
    });
});
//# sourceMappingURL=unit.js.map