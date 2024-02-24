export class Ip {
    public static intToIp(int: number, parts: number): string {
        let ip = [], part;

        while (parts > 0) {
            part = Math.floor(int / Math.pow(256, parts - 1));
            ip.push(part);
            int = int - Math.pow(256, parts - 1) * part;
            parts--;
        }

        return ip.join('.');
    }

    public static calcIpScore(ip: string): number {
        let score = 0;
        let parts = (ip || "").split('.');

        for (let i = 0, length = parts.length; i < length; i++) {
            score = (score * 256) + (parseInt(parts[i], 10) || 0);
        }

        return score;
    }

    public static isValidIp(val: string): boolean {
        return val && val.split('.').length === 4;
    }

    public static isValidIpRegex(ip: string): boolean {
        let regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

        return regex.test(ip);
    }

    public static isValidGeoLat(lat: number) {
        return lat && lat <= 90 && lat >= -90;
    }

    public static isValidGeoLon(lon: number) {
        return lon && lon <= 180 && lon >= -180;
    }
}
