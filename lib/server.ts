import {Agent} from "./agent";
import    fs = require('fs');
import    http = require('http');
import    https = require('https');

export class Server {
    public static createServer(app: Agent): http.Server | https.Server {
        let ssl = app.options.ssl;

        if (!ssl || !ssl.key || !ssl.cert) {
            return http.createServer( app.handle);
        }

        let options = {
            key: fs.readFileSync(ssl.key),
            cert: fs.readFileSync(ssl.cert)
        };

        return https.createServer(options, app.handle);
    }
}