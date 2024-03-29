"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const Table = require('cli-table');
const autocannon = require('autocannon');
let child, instance;
(async function () {
    switch (process.env.TYPE) {
        case "express":
            child = (0, child_process_1.exec)('node ./benchmarks/express.js');
            console.log("running express");
            break;
        case "fastify":
            child = (0, child_process_1.exec)('node ./benchmarks/fastify.js');
            console.log("running fastify");
            break;
        case "tinyhttp":
            child = (0, child_process_1.exec)('node ./benchmarks/tinyhttp.js');
            console.log("running tinyhttp");
            break;
        default:
            console.log("running appolo");
            child = (0, child_process_1.exec)('node ./benchmarks/appolo.js');
    }
    child.stdout.on('data', function (data) {
        run();
    });
    child.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });
})();
function run() {
    const instance = autocannon({
        url: 'http://localhost:3000/test/',
        connections: 100,
        pipelining: 10,
        duration: 10
    });
    instance.on('done', (result) => {
        let table = new Table({
            head: ['name', 'average', 'min', 'max']
        });
        table.push(["Latency", result.latency.average, result.latency.min, result.latency.max], ["Req/Sec", result.requests.average, result.requests.min, result.requests.max]);
        console.log(table.toString());
        setTimeout(() => {
            child.removeAllListeners();
            child.kill();
            process.exit(0);
        }, 10);
    });
    process.once('SIGINT', () => kill());
}
function kill() {
    process.kill(child.pid);
    instance.stop();
}
//# sourceMappingURL=benchmarks.js.map