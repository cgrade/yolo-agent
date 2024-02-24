"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ip = void 0;
class Ip {
    static intToIp(int, parts) {
        let ip = [], part;
        while (parts > 0) {
            part = Math.floor(int / Math.pow(256, parts - 1));
            ip.push(part);
            int = int - Math.pow(256, parts - 1) * part;
            parts--;
        }
        return ip.join('.');
    }
    static calcIpScore(ip) {
        let score = 0;
        let parts = (ip || "").split('.');
        for (let i = 0, length = parts.length; i < length; i++) {
            score = (score * 256) + (parseInt(parts[i], 10) || 0);
        }
        return score;
    }
    static isValidIp(val) {
        return val && val.split('.').length === 4;
    }
    static isValidIpRegex(ip) {
        let regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return regex.test(ip);
    }
    static isValidGeoLat(lat) {
        return lat && lat <= 90 && lat >= -90;
    }
    static isValidGeoLon(lon) {
        return lon && lon <= 180 && lon >= -180;
    }
}
exports.Ip = Ip;
//# sourceMappingURL=ip.js.map