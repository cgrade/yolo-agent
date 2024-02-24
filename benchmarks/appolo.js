"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
function one(req, res, next) {
    req.one = true;
    next();
}
function two(req, res, next) {
    req.two = true;
    next();
}
(0, index_1.createAgent)({}).use(one).use(two)
    .get('/test/', (req, res) => {
    res.send(`hello world`);
})
    .listen(3000, () => {
    console.log("running agent");
});
//# sourceMappingURL=appolo.js.map