import {Numbers} from "../index";
import {IRetry} from "./promises/interfaces";

export class Time {

    public static Second = 1000;
    public static Minute = Time.Second * 60;
    public static Hour = Time.Minute * 60;
    public static Day = Time.Hour * 24;
    public static Week = Time.Day * 7;
    public static Month = Time.Week * 4;
    public static Year = Time.Day * 365.25;

    public static currentTimeInterval(interval: number): number {
        return Math.floor(Date.now() / interval) * interval
    }

    public static unix(): number {
        return Math.floor(Date.now() / 1000);
    }

    public static timeMili(time?: [number, number]): number {
        let t = process.hrtime(time);
        return (t[0] * 1e3) + (t[1] / 1e6);
    }

    public static timeMicro(time?: [number, number]): number {
        let t = process.hrtime(time);
        return t[0] * 1000000 + t[1] / 1000;
    }

    public static milisecPretty(ms: number): string {
        let msAbs = Math.abs(ms);
        if (msAbs >= Time.Day) {
            return Math.round(ms / Time.Day) + 'd';
        }
        if (msAbs >= Time.Hour) {
            return Math.round(ms / Time.Hour) + 'h';
        }
        if (msAbs >= Time.Minute) {
            return Math.round(ms / Time.Minute) + 'm';
        }
        if (msAbs >= Time.Second) {
            return Math.round(ms / Time.Second) + 's';
        }
        return ms + 'ms';
    }

    public static milisecHuman(ms: number): string {
        let str = '';
        let date = new Date(ms),
            days = date.getUTCDate() - 1,
            hours = date.getUTCHours(),
            minutes = date.getUTCMinutes(),
            seconds = date.getUTCSeconds(),
            milli = date.getUTCMilliseconds();

        days && (str += `${days} days, `);
        (hours || str) && (str += `${hours} hours, `);
        (minutes || str) && (str += `${minutes} minutes, `);
        (seconds || str) && (str += `${seconds} seconds, `);
        str += `${milli} milli`;

        return str;
    }

    public static durationIntToString(durationSeconds: number): string {
        return new Date(durationSeconds * 1000).toISOString().substr(11, 8);
    }

    public static daysInCurrentMonth() {
        const d = new Date();
        d.setDate(0); // goes back to end of previous month
        return d.getDate();
    }

    public static calcBackOff(retry: number, params: IRetry): number {
        let delay = 0;

        if (params.linear) {
            delay += params.linear * retry;
        }

        if (params.exponential) {
            delay += Math.pow(params.exponential, retry);
        }

        if (params.random) {
            delay += Numbers.random(0, params.random)
        }

        if (params.fixed) {
            delay += params.fixed
        }

        if (params.min) {
            delay = Math.max(params.min, delay)
        }

        if (params.max) {
            delay = Math.min(params.max, delay)
        }

        return Math.round(delay);
    }


}
