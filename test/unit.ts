import chai = require("chai");
import sinon = require("sinon");
import sinonChai = require("sinon-chai");
import {Typeis} from "../lib/typeis";
import {Cookie} from "../lib/cookie";

chai.use(sinonChai);
let should = chai.should();

describe("Unit Type is", function () {

    it('should return valid typeis', function () {


        Typeis.isType("text/html; charset=utf-8", ['text/*']).should.be.eq("text/html")
        Typeis.isType("text/HTML; charset=utf-8", ['text/*']).should.be.eq("text/html")
        Typeis.isType("text/html", ['text/html/']).should.be.eq(false)
        Typeis.isType("text/html", [undefined, null]).should.be.eq(false)
        //Typeis.isType("text/html**",['text/*']).should.be.eq(false)

        Typeis.isType("text/HTML; charset=utf-8", 'text/text', 'text/html').should.be.eq("text/html")

        Typeis.isType("image/png", ['png']).should.be.eq('png')
        Typeis.isType("image/png", ['.png']).should.be.eq('.png')
        Typeis.isType("image/png", ['image/png']).should.be.eq('image/png')
        Typeis.isType("image/png", ['image/*']).should.be.eq('image/png')
        Typeis.isType("image/png", ['*/png']).should.be.eq('image/png')

        Typeis.isType("image/png", ['jpeg']).should.be.eq(false)
        Typeis.isType("image/png", ['.jpeg']).should.be.eq(false)
        Typeis.isType("image/png", ['image/jpeg']).should.be.eq(false)
        Typeis.isType("image/png", ['text/*']).should.be.eq(false)
        Typeis.isType("image/png", ['*/jpeg']).should.be.eq(false)

        Typeis.isType("image/png", ['bogus']).should.be.eq(false)
        Typeis.isType("image/png", ['something/bogus*']).should.be.eq(false)

        Typeis.isType('image/png', ['png']).should.be.eq('png')
        Typeis.isType('image/png', '.png').should.be.eq('.png')
        Typeis.isType('image/png', ['text/*', 'image/*']).should.be.eq('image/png')
        Typeis.isType('image/png', ['image/*', 'text/*']).should.be.eq('image/png')
        Typeis.isType('image/png', ['image/*', 'image/png']).should.be.eq('image/png')
        Typeis.isType('image/png', 'image/png', 'image/*').should.be.eq('image/png')

        Typeis.isType('image/png', ['jpeg']).should.be.eq(false)
        Typeis.isType('image/png', ['.jpeg']).should.be.eq(false)
        Typeis.isType('image/png', ['text/*', 'application/*']).should.be.eq(false)
        Typeis.isType('image/png', ['text/html', 'text/plain', 'application/json']).should.be.eq(false)

        Typeis.isType('application/vnd+json', '+json').should.be.eq('application/vnd+json')
        Typeis.isType('application/vnd+json', 'application/vnd+json').should.be.eq('application/vnd+json')
        Typeis.isType('application/vnd+json', 'application/*+json').should.be.eq('application/vnd+json')
        Typeis.isType('application/vnd+json', '*/vnd+json').should.be.eq('application/vnd+json')
        Typeis.isType('application/vnd+json', 'application/json').should.be.eq(false)
        Typeis.isType('application/vnd+json', 'text/*+json').should.be.eq(false)

        Typeis.isType('text/html', '*/*').should.be.eq('text/html')
        Typeis.isType('text/xml', '*/*').should.be.eq('text/xml')
        Typeis.isType('application/json', '*/*').should.be.eq('application/json')
        Typeis.isType('application/vnd+json', '*/*').should.be.eq('application/vnd+json')


        Typeis.isType('multipart/form-data', ['multipart/*']).should.be.eq('multipart/form-data')
        Typeis.isType('multipart/form-data', ['multipart']).should.be.eq('multipart')

        Typeis.isType('application/x-www-form-urlencoded', ['urlencoded']).should.be.eq('urlencoded')
        Typeis.isType('application/x-www-form-urlencoded', ['json', 'urlencoded']).should.be.eq('urlencoded')
        Typeis.isType('application/x-www-form-urlencoded', ['urlencoded', 'json']).should.be.eq('urlencoded')


    })


})

describe("Cookies", function () {

    it('should serialize', function () {
        Cookie.serialize('foo', 'bar', {path: '/'}).should.be.eq('foo=bar; Path=/');
        Cookie.serialize('foo', 'bar', {secure: true}).should.be.eq('foo=bar; Secure');
        Cookie.serialize('foo', 'bar', {secure: false}).should.be.eq('foo=bar');
        Cookie.serialize('foo', 'bar', {domain: 'example.com'}).should.be.eq('foo=bar; Domain=example.com');
        Cookie.serialize.bind(null,'foo', 'bar', {domain: 'example.com\n'}).should.throw(/option domain is invalid/);
        Cookie.serialize.bind(null,'foo', 'bar', {maxAge: 'buzz'}).should.throw(/option maxAge is invalid/);
        Cookie.serialize.bind(null,'foo', 'bar', {expires: Date.now()}).should.throw(/option expires is invalid/);

        Cookie.serialize('foo', 'bar', { httpOnly: true}).should.be.eq('foo=bar; HttpOnly');
        Cookie.serialize('foo', 'bar', { maxAge: 1000}).should.be.eq('foo=bar; Max-Age=1000');
        Cookie.serialize('foo', 'bar', { maxAge: 0}).should.be.eq('foo=bar; Max-Age=0');
        Cookie.serialize('foo', 'bar', { maxAge: null}).should.be.eq('foo=bar');

        Cookie.serialize('foo', 'bar', { expires: new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900))}).should.be.eq('foo=bar; Expires=Sun, 24 Dec 2000 10:30:59 GMT');

        Cookie.serialize('foo', 'bar', { sameSite: true}).should.be.eq('foo=bar; SameSite=Strict');
        Cookie.serialize('foo', 'bar', { sameSite: 'strict'}).should.be.eq('foo=bar; SameSite=Strict');
        Cookie.serialize('foo', 'bar', { sameSite: 'lax'}).should.be.eq('foo=bar; SameSite=Lax');
        Cookie.serialize('foo', 'bar', { sameSite: 'none'}).should.be.eq('foo=bar; SameSite=None');
        Cookie.serialize('foo', 'bar', { sameSite: false}).should.be.eq('foo=bar');

        Cookie.serialize('foo', '+', { sameSite: false}).should.be.eq('foo=%2B');

    })
})
