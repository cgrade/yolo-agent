"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cors = void 0;
function cors(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || '*');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Cache-Control", "max-age=0, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("P3P", 'CP="CURa ADMa DEVa PSAo PSDo OUR BUS UNI PUR INT DEM STA PRE COM NAV OTC NOI DSP COR"');
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, PATCH, DELETE, HEAD, OPTIONS");
    res.setHeader("Allow", "GET, PUT, PATCH, DELETE, HEAD, OPTIONS");
    //
    // intercept OPTIONS method
    if (req.method == 'OPTIONS') {
        res.setHeader('Content-Length', '0');
        res.statusCode = 204;
        res.end();
    }
    else {
        next();
    }
}
exports.cors = cors;
//# sourceMappingURL=corsMiddleware.js.map