import {NextFn} from "../../lib/types";
import {IResponse} from "../../lib/response";
import {IRequest} from "../../lib/request";

export function cors (req: IRequest, res: IResponse, next: NextFn) {
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
    } else {
        next();
    }


}