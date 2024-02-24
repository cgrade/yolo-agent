"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.date = exports.DateJs = void 0;
class DateJs {
    constructor(date) {
        this._date = date ? new Date(date) : new Date();
    }
    toDate() {
        return this._date;
    }
    toISOString() {
        return this._date.toISOString();
    }
    add(value, unit = "millisecond") {
        let date = new Date(this._date.getTime() + this._getTime(value, unit));
        return new DateJs(date);
    }
    subtract(value, unit = "millisecond") {
        let date = new Date(this._date.getTime() - this._getTime(value, unit));
        return new DateJs(date);
    }
    utc() {
        let date = new Date(this._date.getTime() + (this._date.getTimezoneOffset() * 60000));
        return new DateJs(date);
    }
    unix() {
        return Math.floor(this._date.getTime() / 1000);
    }
    valueOf() {
        return this._date.getTime();
    }
    diff(date, unit = "millisecond") {
        let value = this._getTime(1, unit);
        return Math.ceil((this._date.getTime() - date.valueOf()) / value);
    }
    clone() {
        let date = new Date(this._date.getTime());
        return new DateJs(date);
    }
    startOf(unit) {
        let date = this.clone().toDate();
        switch (unit) {
            case "second":
                date.setUTCMilliseconds(0);
                break;
            case "minute":
                date.setUTCSeconds(0, 0);
                break;
            case "hour":
                date.setUTCMinutes(0, 0, 0);
                break;
            case "day":
                date.setUTCHours(0, 0, 0, 0);
                break;
            case "month":
                date = new Date(date.getUTCFullYear(), date.getUTCMonth(), 1);
                date.setUTCHours(0, 0, 0, 0);
                break;
            case "year":
                date = new Date(date.getUTCFullYear(), 0, 1);
                date.setUTCHours(0, 0, 0, 0);
                break;
        }
        return new DateJs(date);
    }
    endOf(unit) {
        let date = this.clone().toDate();
        switch (unit) {
            case "second":
                date.setUTCFullYear(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
                date.setUTCHours(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds() + 1, 0);
                break;
            case "minute":
                date.setUTCFullYear(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
                date.setUTCHours(date.getUTCHours(), date.getUTCMinutes() + 1, 0, 0);
                break;
            case "hour":
                date.setUTCFullYear(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
                date.setUTCHours(date.getUTCHours() + 1, 0, 0, 0);
                break;
            case "day":
                date.setUTCFullYear(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1);
                date.setUTCHours(0, 0, 0, 0);
                break;
            case "month":
                date.setUTCFullYear(date.getUTCFullYear(), date.getUTCMonth() + 1, 1);
                date.setUTCHours(0, 0, 0, 0);
                break;
            case "year":
                date.setUTCFullYear(date.getUTCFullYear() + 1, 0, 1);
                date.setUTCHours(0, 0, 0, 0);
                break;
        }
        return new DateJs(date);
    }
    _getTime(value, unit) {
        switch (unit) {
            case "second":
                value = value * 1000;
                break;
            case "minute":
                value = value * 1000 * 60;
                break;
            case "hour":
                value = value * 1000 * 60 * 60;
                break;
            case "day":
                value = value * 1000 * 60 * 60 * 24;
                break;
            case "month":
                value = value * 1000 * 60 * 60 * 24 * 30;
                break;
            case "year":
                value = value * 1000 * 60 * 60 * 24 * 365;
                break;
        }
        return value;
    }
}
exports.DateJs = DateJs;
function date(date) {
    return new DateJs(date);
}
exports.date = date;
//# sourceMappingURL=dateJs.js.map