import chai = require("chai");
import sinon = require("sinon");
import sinonChai = require("sinon-chai");
import request = require("supertest");
import chaiHttp = require('chai-http');
import bodypaser = require('body-parser');
import consolidate = require('consolidate');
import {createAgent, Hooks} from "../index"
import {IRequest} from "../lib/request";
import {IResponse} from "../lib/response";
import {Agent} from "../lib/agent";
import {cors} from "./mock/corsMiddleware";
import {HttpError} from "../lib/errors/httpError";

chai.use(chaiHttp);
chai.use(sinonChai);
let should = chai.should();

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time))
}


describe("e2e", () => {
    let app: Agent;

    beforeEach(() => {
        app = createAgent();
    });

    afterEach(async () => {
        await app.close()
    });

    describe('params', function () {
        it('should call route with params', async () => {
            await app
                .get("/test/params/:id/:name/", (req: IRequest, res: IResponse) => {
                    res.json({query: req.query, params: req.params})
                })
                .listen(3000);

            let res = await request(app.handle)
                .get(`/test/params/aaa/bbb?test=${encodeURIComponent("http://www.cnn.com")}`);


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.query.test.should.be.eq("http://www.cnn.com");
            res.body.params.name.should.be.eq("bbb");
            res.body.params.id.should.be.eq("aaa");
        });

        it('should call route with ip x-forwarded-for', async () => {
            await app
                .get("/test/params/:id/:name/", (req: IRequest, res: IResponse) => {
                    res.json({query: req.query, params: req.params, ip: req.ip})
                })
                .listen(3000);

            let res = await request(app.handle)
                .get(`/test/params/aaa/bbb?test=${encodeURIComponent("http://www.cnn.com")}`).set("x-forwarded-for", "1.3.4.5,4.5.6.7");


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.ip.should.be.eq("1.3.4.5");

        });

        it('should call route with ip x-forwarded-for', async () => {
            await app
                .get("/test/params/:id/:name/", (req: IRequest, res: IResponse) => {
                    res.json({query: req.query, params: req.params, ip: req.ip})
                })
                .listen(3000);

            let res = await request(app.handle)
                .get(`/test/params/aaa/bbb?test=${encodeURIComponent("http://www.cnn.com")}`);


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.ip.should.be.eq("::ffff:127.0.0.1");

        });

        it('should call  with params url encoded ', async () => {
            let app = await createAgent({decodeUrlParams: true})
                .get("/test/params/:id/:name/", (req: IRequest, res: IResponse) => {
                    res.json({query: req.query, params: req.params})
                })
                .listen(3000);

            let res = await request(app.handle)
                .get(`/test/params/aaa/${encodeURIComponent("http://www.cnn.com")}`);


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.params.name.should.be.eq("http://www.cnn.com");
            res.body.params.id.should.be.eq("aaa");

            await app.close();
        })
    });

    describe('middalwares', function () {
        it("should add middlwrare to exists route", async function () {
            app.use("/test/params/:id/:name/", (req: IRequest, res: IResponse, next) => {
                req.query["test"] = "aa";
                next();
            })
                .get("/test/params/:id/:name/", (req: IRequest, res: IResponse) => {
                    res.json({query: req.query})
                })
                .listen(3000);

            let res = await request(app.handle)
                .get(`/test/params/aaa/bbb}`);

            res.body.query.test.should.be.eq("aa");

        });
    })

    describe('json', function () {
        it('should call route with json', async () => {

            await app
                .get("/test/json", (req: IRequest, res: IResponse) => {
                    res.json({query: req.query})
                })
                .listen(3000);

            let res = await request(app.handle)
                .get('/test/json/?aaa=bbb&ccc=ddd');

            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.query.should.be.ok;
            res.body.query.aaa.should.be.eq("bbb");
            res.body.query.ccc.should.be.eq("ddd");

        });

        it('should call route with post json', async () => {

            await app.use(bodypaser.json())
                .post("/test/json", (req: IRequest, res: IResponse) => {
                    res.json({body: req.body})
                })
                .listen(3000);


            let res = await request(app.handle)
                .post('/test/json/')
                .send({aaa: "bbb", ccc: "ddd"})

            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.body.should.be.ok;
            res.body.body.aaa.should.be.eq("bbb");
            res.body.body.ccc.should.be.eq("ddd");

        });

    });


    describe('buffer', function () {
        it('should call route with gzip json', async () => {

            let arr = new Array(1000)
            arr.fill(1)

            await app
                .get("/test/json", (req: IRequest, res: IResponse) => {
                    res.gzip().json({query: req.query, data: arr})
                })

                .listen(3000);

            let res = await request(app.handle)
                .get('/test/json/?aaa=bbb&ccc=ddd');

            res.should.to.have.status(200);
            res.should.to.be.json;
            res.header["content-encoding"].should.be.eq("gzip")
            res.header["content-length"].should.be.eq("78")

            should.exist(res.body);

            res.body.query.should.be.ok;
            res.body.query.aaa.should.be.eq("bbb");
            res.body.query.ccc.should.be.eq("ddd");

        });

        it('should not call route with gzip', async () => {

            await app

                .get("/test/json", (req: IRequest, res: IResponse) => {
                    res.gzip().send({query: req.query} as any)
                })
                .listen(3000);

            let res = await request(app.handle)
                .get('/test/json/?aaa=bbb&ccc=ddd');

            res.should.to.have.status(200);
            res.should.to.be.json;
            should.not.exist(res.header["content-encoding"])
            res.header["content-length"].should.be.eq("35")

            should.exist(res.body);

            res.body.query.should.be.ok;
            res.body.query.aaa.should.be.eq("bbb");
            res.body.query.ccc.should.be.eq("ddd");

        });

        it('should call route with gzip empty', async () => {

            await app

                .get("/test/json", (req: IRequest, res: IResponse) => {
                    res.gzip().send(null);
                })
                .listen(3000);

            let res = await request(app.handle)
                .get('/test/json/?aaa=bbb&ccc=ddd');

            res.should.to.have.status(200);

            res.header["content-length"].should.be.eq("0");


        });

        it('should call route with post json', async () => {

            await app.use(bodypaser.json())
                .post("/test/json", (req: IRequest, res: IResponse) => {
                    res.json({body: req.body})
                })
                .listen(3000);


            let res = await request(app.handle)
                .post('/test/json/')
                .send({aaa: "bbb", ccc: "ddd"})

            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.body.should.be.ok;
            res.body.body.aaa.should.be.eq("bbb");
            res.body.body.ccc.should.be.eq("ddd");

        });

    });

    describe('should call async middleware', function () {
        it('should  async  middleware resolve', async () => {

            await app.use(async (req, res, next) => {

            }).use((req, res, next) => {
                res.send("ok")
            })
                .listen(3000);

            let res = await request(app.handle)
                .get('/');

            res.should.to.have.status(200);
            res.text.should.be.eq('ok')
        });

        it('should  async  middleware resolve and next', async () => {

            await app.use(async (req, res, next) => {
                next();
            }).use(async (req, res, next) => {

            }).use((req, res, next) => {
                res.send("ok")
            })
                .listen(3000);

            let res = await request(app.handle)
                .get('/');

            res.should.to.have.status(200);
            res.text.should.be.eq('ok')
        });

        it('should  async  middleware resolve and error', async () => {

            await app.use(async (req, res, next) => {
                next();
            }).use(async (req, res, next) => {
                await new Promise(resolve => setTimeout(resolve, 1));

                throw new HttpError(500, "async error")
            }).use((req, res, next) => {
                res.send("ok")
            })
                .listen(3000);

            let res = await request(app.handle)
                .get('/');

            res.should.to.have.status(500);
            res.body.message.should.be.eq('async error')
        });
    })


    describe('should call route with methods options head', function () {
        it('should  call  Options', async () => {

            await app.use(cors)
                .listen(3000);

            let res = await request(app.handle)
                .options('/test/params/aaa/bbb/?user_name=11');

            res.should.to.have.status(204);
            res.header["access-control-allow-origin"].should.be.eq('*');
            res.header["content-length"].should.be.eq('0');

            res.text.should.be.eq("")
        });

        it('should  call  Middleware error', async () => {

            await app.use(function (req, res, next) {
                next(new Error("test error"))
            })
                .listen(3000);

            let res = await request(app.handle)
                .get('/test/params/aaa/bbb/?user_name=11');

            res.should.to.have.status(500);


            res.text.should.be.eq('{"statusCode":500,"message":"Internal Server Error","error":"test error"}')
        });

        it('should  call  Middleware error with stack', async () => {
            app = createAgent({errorStack: true})
            await app.use(function (req, res, next) {
                next(new Error("test error"))
            })
                .listen(3000);

            let res = await request(app.handle)
                .get('/test/params/aaa/bbb/?user_name=11');

            res.should.to.have.status(500);


            res.body.error.should.include('Error: test error')
        });


        it('should  call use with path', async () => {

            await app.use("/test/test", function (req, res, next) {
                res.send("aaa")
            }).listen(3000);

            let res = await request(app.handle)
                .get('/test/test');

            res.should.to.have.status(200);


            res.text.should.be.eq('aaa')
        });

        it('should  call  Middleware http Error', async () => {

            await app.use(function (req, res, next) {
                next(new HttpError(404, "test", null, {test: 1}))
            })
                .listen(3000);

            let res = await request(app.handle)
                .get('/test/params/aaa/bbb/?user_name=11');

            res.should.to.have.status(404);


            res.body.test.should.be.eq(1)
        });

        it('should  call not found http Error', async () => {

            await app.get("aa/bb")
                .listen(3000);

            let res = await request(app.handle)
                .get('/test/');

            res.should.to.have.status(404);

            res.text.should.be.eq("{\"statusCode\":404,\"message\":\"Cannot GET /test/\"}")
        });

        it('should call controller Head', async () => {

            await app
                .use(cors)
                .head("/test/params/:name/:name2", (req: IRequest, res: IResponse) => {
                    res.json({
                        working: true,
                        user_name: req.query.user_name,
                    })
                })
                .listen(3000);


            let res = await
                request(app.handle)
                    .head('/test/params/aaa/bbb/?user_name=11');

            res.should.to.have.status(200);
            res.header["access-control-allow-origin"].should.be.eq('*');
            res.header["content-length"].should.be.eq('33');
            res.header["content-type"].should.be.eq('application/json; charset=utf-8');

            should.not.exist(res.text);
        });


        it('should call controller empty response', async () => {


            await app
                .use(cors)
                .get("/test/params/empty/:name/:name2", (req: IRequest, res: IResponse) => {
                    res.status(204).send();
                })
                .listen(3000);

            let res = await request(app.handle)
                .get('/test/params/empty/aaa/bbb/?user_name=11');

            res.should.to.have.status(204);
            res.header["access-control-allow-origin"].should.be.eq('*');
            res.header["content-length"].should.be.eq('0');
            should.not.exist(res.header["content-type"]);

            res.text.should.be.eq("");
        });


        it("Should  and get route", async () => {
            app = createAgent();

            await app.get("/test/1", (req: IRequest, res: IResponse) => {
                res.send("working")
            }).listen(3000)

            let result = await request(app.handle).get("/test/1")

            result.text.should.eq("working")

        });

        it("Should  and head route", async () => {
            app = createAgent();

            await app.get("/test/1", (req: IRequest, res: IResponse) => {
                res.send("working")
            }).listen(3000)

            let result = await request(app.handle).head("/test/1")
            result.status.should.be.eq(200);
            should.not.exist(result.text)
            result.header["content-length"].should.be.eq('7');
        });

    });

    describe('events', function () {
        it('should fire events', async () => {

            app = createAgent({});

            let spy = sinon.spy();

            app.events.routeAdded.once(spy);
            app.events.beforeServerOpen.once(spy);
            app.events.beforeServerClosed.once(spy);
            app.events.afterServerOpen.once(spy);
            app.events.afterServerClosed.once(spy);

            await app
                .get("/test/params/:id/:name/", (req: IRequest, res: IResponse) => {
                    res.json({query: req.query, params: req.params})
                })
                .listen(3000);

            let res = await request(app.handle)
                .get(`/test/params/aaa/bbb?test=${encodeURIComponent("http://www.cnn.com")}`);


            res.should.to.have.status(200);
            res.should.to.be.json;

            await app.close();


            spy.should.callCount(5)


        });
    })

    describe('errors', function () {
        it('should throw valid errors', async () => {

            app = createAgent();

            await app.get("/test/error", (req: IRequest, res: IResponse) => {
                throw new HttpError(400, "test error", new HttpError(500, "inner error", null, null, 999))
            }).listen(3000)

            let result = await request(app.handle).get("/test/error");

            result.status.should.be.eq(400);
            result.body.code.should.be.eq(999);
            result.body.message.should.be.eq("test error");
            result.body.error.should.be.eq("inner error");


        });


        it('should throw custom valid errors', async () => {

            app = createAgent();

            app.use(function (err, req, res, next) {
                res.status(500);
                res.send('error')
            })

            app.get("/test/error", (req: IRequest, res: IResponse) => {
                throw new HttpError(400, "test error")
            });

            await app.listen(3000);

            let result = await request(app.handle).get("/test/error");

            result.status.should.be.eq(500);
            result.text.should.be.eq("error");

        });

        it('should throw custom not found', async () => {

            app = createAgent();

            app.use(function (err, req, res, next) {
                if (err.statusCode == 404) {
                    res.statusCode = 404;
                    res.send('error 404')
                    return;
                }

                next(err);

            });

            app.get("/test/error", (req: IRequest, res: IResponse) => {
                throw new HttpError(400, "test error")
            });

            await app.listen(3000);

            let result = await request(app.handle).get("/test/error2");

            result.status.should.be.eq(404);
            result.text.should.be.eq("error 404");

            let result2 = await request(app.handle).get("/test/error");

            result2.status.should.be.eq(400);
            result2.text.should.be.eq("{\"statusCode\":400,\"message\":\"test error\"}");

        });

    })

    describe('hooks', function () {
        it('should handle send hook', async () => {

            app = createAgent();

            app.get("/test/send", (req: IRequest, res: IResponse) => {
                res.send({a: "bb"})
            });

            app.hooks.onSend(function (data, req, res, next) {
                data.a = "aaa";
                next(null, data)
            });

            await app.listen(3000);

            let result = await request(app.handle).get("/test/send");

            result.status.should.be.eq(200);
            result.body.a.should.be.eq("aaa");


        });

        it('should handle on response hook', async () => {

            app = createAgent();

            app.get("/test/send", (req: IRequest, res: IResponse) => {
                res.send({a: "bb"})
            });

            let spy = sinon.spy();

            app.hooks.onResponse(() => spy());

            await app.listen(3000);

            let result = await request(app.handle).get("/test/send");

            spy.should.have.been.calledOnce

        });

        it('should handle on response hook 404', async () => {

            app = createAgent();

            app.get("/test/send", (req: IRequest, res: IResponse) => {
                res.send({a: "bb"})
            });

            let spy = sinon.spy();

            app.hooks.onResponse((req, res) => {
                spy()
            });

            await app.listen(3000);

            let result = await request(app.handle).get("/test/send2");

            spy.should.have.been.calledOnce

        });

        it('should handle pre middleware  hook', async () => {

            app = createAgent();

            app.get("/test/send", (req: IRequest, res: IResponse) => {
                res.send({a: "aa", ...req.query})
            });

            let spy = sinon.spy();

            app.hooks.onPreMiddleware(function (req, res, next) {
                req.query = {b: "bb"};
                next();
            });

            await app.listen(3000);

            let result = await request(app.handle).get("/test/send");

            result.status.should.be.eq(200);
            result.body.a.should.be.eq("aa");
            result.body.b.should.be.eq("bb");

        });

        it('should handle pre middleware async  hook', async () => {

            app = createAgent();

            app.get("/test/send", (req: IRequest, res: IResponse) => {
                res.send({a: "aa", ...req.query})
            });


            app.hooks.onPreMiddleware(async function (req, res) {
                await new Promise(resolve => setTimeout(resolve, 1))
                req.query = {b: "bb"};
            });

            await app.listen(3000);

            let result = await request(app.handle).get("/test/send");

            result.status.should.be.eq(200);
            result.body.a.should.be.eq("aa");
            result.body.b.should.be.eq("bb");

        });

        it('should handle pre middleware async hook with error', async () => {

            app = createAgent();

            app.get("/test/send", (req: IRequest, res: IResponse) => {
                res.send({a: "aa", ...req.query})
            });


            app.hooks.onPreMiddleware(async function (req, res) {
                await new Promise(resolve => setTimeout(resolve, 1))
                throw new HttpError(500, "some error")
            });

            await app.listen(3000);

            let result = await request(app.handle).get("/test/send");

            result.status.should.be.eq(500);
            result.body.message.should.be.eq("some error");

        });

        it('should handle on request  hook', async () => {

            app = createAgent();

            app.get("/test/send", (req: IRequest, res: IResponse) => {
                res.send({a: "aa", ...req.query})
            });

            app.hooks.onRequest(function (req, res, next) {
                req.query = {b: "bb"};
                next();
            });

            await app.listen(3000);

            let result = await request(app.handle).get("/test/send");

            result.status.should.be.eq(200);
            result.body.a.should.be.eq("aa");
            result.body.b.should.be.eq("bb");

        });
    })


});

