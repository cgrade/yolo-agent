# Appolo Agent
[![Build Status](https://travis-ci.com/shmoop207/appolo-agent.svg?branch=master)](https://travis-ci.org/shmoop207/appolo-agent) [![Dependencies status](https://david-dm.org/shmoop207/appolo-agent.svg)](https://david-dm.org/shmoop207/appolo-agent) [![NPM version](https://badge.fury.io/js/appolo-agent.svg)](https://badge.fury.io/js/appolo-agent)  [![npm Downloads](https://img.shields.io/npm/dm/appolo-agent.svg?style=flat)](https://www.npmjs.com/package/appolo-agent)
[![Known Vulnerabilities](https://snyk.io/test/github/shmoop207/appolo-agent/badge.svg)](https://snyk.io/test/github/shmoop207/appolo-agent)

Fast and simple http server build with typescript and [`appolo-route`](http://https://github.com/shmoop207/appolo-route)

## Installation:

```javascript
npm install @appolo/agent --save
```

## Usage:

```javascript
import {Agent} from '@appolo/agent'

await new Agent()
    .get("/test/:id/", (req: IRequest, res: IResponse) => {
        res.json({query: req.query, params: req.params})
    }).listen(3000);

```

## Agent
Options
- `port` - port number to agent will listen default `8080`
- `errorStack` - boolean print error stack on error default `false`
- `errorMessage` - boolean print error message default `true`
- `maxRouteCache` - max number of cached routes paths with lru cache default `1000`,
- `useRouteCache` - boolean use route path cache default `true`
- `decodeUrlParams` - boolean use` decodeURIComponent` on path params default `false`
- `qsParser` - module to use to parse querystring values `qs` | `querystring default `qs`
- `viewEngine` - like express view wngine
- `viewFolder` - view folder to search view paths default ``
- `viewCache` -  boolean cache view
- `viewExt`  - views file ext default `html`

```javascript
await new Agent({port:3000})
    .get("/test/:id/", (req: IRequest, res: IResponse) => {
        res.json({query: req.query, params: req.params})
    }).listen();
```


#### `get server(): http.Server | https.Server`
get node http server

#### `get router(): Router`
get router instance

#### `listen(port: number, cb?: Function): Promise<Agent>`
bind the agent to port
call callback if provided
return the agent instance

#### `close(): Promise<void>`
close the agent connection to http server and clean everything

## Routing
#### Static route
```javascript

let app  =  new Agent()
    .get("/test/test2", (req,res)=>res.send("working"));
    .post("/test/test2", (req,res)=>res.send("working post"));

```
#### Parametric route
```javascript

let router = new Agent()
    .get("/test/:userId/:userName", (req,res)=>res.send("working"));
```
#### Wildcard route
```javascript

let router = new Agent()
    .get("/*", (req,res)=>res.send("working"));
```
#### Regex route
same syntax as [path-to-regexp](https://github.com/pillarjs/path-to-regexp)
```javascript

let app = new Agent()
    .get("/test/:file(^\\d+).png", (req,res)=>res.send("working"));
```

#### get(path: string, ...handler: any[]): Agent
register new Route handler using Http.Get Method
#### post(path: string, ...handler: any[]): Agent
register new Route handler using Http.Post Method
#### put(path: string, ...handler: any[]): Agent
register new Route handler using Http.Put Method
#### patch(path: string, ...handler: any[]): Agent
register new Route handler using Http.Put Method
#### patch(path: string, ...handler: any[]): Agent
register new Route handler using Http.Patch Method
#### delete(path: string, ...handler: any[]): Agent
register new Route handler using Http.Delete Method
#### head(path: string, ...handler: any[]): Agent
register new Route handler using Http.Delete Method
#### add(method:Http.Methods, path: string, ...handler: any[]): Router
register new Route handler.
multi methods supported
```javascript

let agent = new Agent()
    .add("POST","/test/:param", someMiddleware(),(req,res)=>res.send("working"));
```
## Middlewares
the agent supports any express middleware or cusotom middalwares

```javascript
import favicon = require('static-favicon');
import bodyParser = require("body-parser");
import {IRequest,IResponse,NextFn}  from 'appolo-agent';

let agent = new Agent()
    .use(bodyParser.json());
    .use(function (req:IRequest, res: IResponse, next: NextFn) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        next();
    })
    .use(favicon());}
    .get("/test/:param", someMiddleware(),(req,res)=>res.send("working"));
```
## IRequest
the request object inherits from [http.incomingmessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage)
#### `req.query`
query params object
#### `req.body`
body parser params object
#### `req.params`
route params object
#### `req.hostname`
host name of the request
#### `req.path`
path name of the request
#### `req.secure`
boolean true is the request is https
#### `req.protocol`
protocol of the request `http` or `https`
#### `req.app`
instance of the agent
#### `req.get(name:string)`
#### `req.header(name:string)`
Returns the specified HTTP request header
```javascript
req.get('content-type'); // => "text/plain"
```
#### `req.is(type:string)`
Returns the matching content type if the incoming request’s “Content-Type” HTTP header field matches the MIME type specified by the type parameter. If the request has no body, returns null. Returns false otherwise.
```javascript
req.is('html');       // => 'html'
req.is('text/html');  // => 'text/html'
```

## IResponse
the response object inherits from [http.ServerResponse](https://nodejs.org/api/http.html#http_class_http_serverresponse)

#### `res.status(code: number): IResponse`
set response status code
```javascript
res.status(200).json({name:"value"});
```

#### `res.contentType(type: string): IResponse`
set response content type

#### `res.header(key: string, value: string): IResponse`
#### `res.set(key: string, value: string): IResponse`
set response header

#### `res.cache(seconds: number): IResponse
set `Cache-Control` header in seconds

#### `res.gzip(): IResponse`
compress the response with gzip and set `Content-Encoding` header to `gzip`

#### `res.redirect(path: string): void`
redirect the request to new path

#### `res.cookie(key: string, value: any, options?: cookie.CookieSerializeOptions): IResponse`
sets cookie name to value. The value parameter may be a string or object converted to JSON.
```javascript
res.cookie('name', 'test', { domain: '.example.com', path: '/admin', secure: true });
res.cookie('someName', '{someVal:1}', { expires: new Date(Date.now() + 900000), httpOnly: true });
```
#### `res.clearCookie(key: string, options?: cookie.CookieSerializeOptions): IResponse`
clears the cookie specified by name.
```javascript
res.cookie('name', 'tobi', { path: '/admin' });
res.clearCookie('name', { path: '/admin' });
```

#### `json(obj: object)`
sends a JSON response.
```javascript
res.json({name:"value"});
```

#### `jsonp(obj: object)`
Sends a JSON response with JSONP support. This method is identical to res.json(), except that it opts-in to JSONP callback support
```javascript
res.jsonp({name:"value"});
```

#### `render(path: string | string[], params?: any): Promise<void>``
#### `render(params?: any): Promise<void>`

render view html by path and params
```javascript
res.render('index');
res.render('/path/to/view');
res.render('index',{some:"data"});
```

#### `send(data?: string | Buffer| object)`
```javascript
res.send(new Buffer('some buffer'));
res.send({ some: 'data' });
res.send('<p>some html</p>');
res.status(404).send('not found');
res.status(500).send({ error: 'some error' });
```


## License
MIT
