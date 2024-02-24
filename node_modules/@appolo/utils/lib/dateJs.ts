import {Chain} from "./chain";

export type TimeUnit = "millisecond" | "second" | "minute" | "hour" | "day" | "month" | "year"

export class DateJs {
    private _date: Date

    constructor(date?: string | number | Date) {
        this._date = date ? new Date(date) : new Date()
    }

    public toDate(): Date {
        return this._date;
    }

    public toISOString(): string {
        return this._date.toISOString();
    }

    public add(value: number, unit: TimeUnit = "millisecond"): DateJs {

        let date = new Date(this._date.getTime() + this._getTime(value, unit))

        return new DateJs(date);
    }

    public subtract(value: number, unit: TimeUnit = "millisecond"): DateJs {

        let date = new Date(this._date.getTime() - this._getTime(value, unit))

        return new DateJs(date);
    }

    public utc(): DateJs {
        let date = new Date(this._date.getTime() + (this._date.getTimezoneOffset() * 60000));
        return new DateJs(date);
    }

    public unix(): number {
        return Math.floor(this._date.getTime() / 1000);
    }

    public valueOf(): number {
        return this._date.getTime()
    }

    public diff(date: DateJs, unit: TimeUnit = "millisecond"): number {

        let value = this._getTime(1, unit)

        return Math.ceil((this._date.getTime() - date.valueOf()) / value);
    }

    public clone(): DateJs {
        let date = new Date(this._date.getTime())
        return new DateJs(date);
    }

    public startOf(unit: TimeUnit):DateJs {
        let date = this.clone().toDate();
        switch (unit) {
            case "second":
                date.setUTCMilliseconds(0)
                break;
            case "minute":
                date.setUTCSeconds(0, 0)
                break;

            case "hour":
                date.setUTCMinutes(0, 0, 0)
                break;

            case "day":
                date.setUTCHours(0, 0, 0, 0)
                break;
            case "month":
                date = new Date(date.getUTCFullYear(), date.getUTCMonth(), 1)
                date.setUTCHours(0, 0, 0, 0)
                break;
            case "year":
                date = new Date(date.getUTCFullYear(), 0, 1)
                date.setUTCHours(0, 0, 0, 0)
                break;
        }

        return new DateJs(date);
    }

    public endOf(unit: TimeUnit):DateJs {
        let date = this.clone().toDate();
        switch (unit) {
            case "second":
                date.setUTCFullYear(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
                date.setUTCHours(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds() + 1, 0)
                break;
            case "minute":
                date.setUTCFullYear(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
                date.setUTCHours(date.getUTCHours(), date.getUTCMinutes() + 1, 0, 0)
                break;

            case "hour":
                date.setUTCFullYear(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
                date.setUTCHours(date.getUTCHours() + 1, 0, 0, 0)
                break;

            case "day":
                date.setUTCFullYear(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1)
                date.setUTCHours(0, 0, 0, 0)
                break;
            case "month":
                date.setUTCFullYear(date.getUTCFullYear(), date.getUTCMonth() + 1, 1)
                date.setUTCHours(0, 0, 0, 0)
                break;
            case "year":
                date.setUTCFullYear(date.getUTCFullYear() + 1, 0, 1)
                date.setUTCHours(0, 0, 0, 0)
                break;
        }


        return  new DateJs(date);
    }

    private _getTime(value: number, unit: TimeUnit) {
        switch (unit) {
            case "second":
                value = value * 1000
                break;
            case "minute":
                value = value * 1000 * 60
                break;

            case "hour":
                value = value * 1000 * 60 * 60
                break;

            case "day":
                value = value * 1000 * 60 * 60 * 24
                break;
            case "month":
                value = value * 1000 * 60 * 60 * 24 * 30
                break;
            case "year":
                value = value * 1000 * 60 * 60 * 24 * 365
                break;
        }

        return value;
    }


}

export function date(date?: string | number | Date): DateJs {
    return new DateJs(date);
}

