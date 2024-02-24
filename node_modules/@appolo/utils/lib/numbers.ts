export class Numbers {
    public static toFixed(number: number | string, precision: number = 0): number {
        let pow = Math.pow(10, precision);
        return (Math.round((number as number) * pow) / pow);
    }

    public static random(min: number, max?: number, floating: boolean = false): number {

        if (max === undefined) {
            max = min;
            min = 0;
        }

        let isInt = !floating && Number.isInteger(min) && Number.isInteger(min);

        if (isInt) {
            return Numbers.randomInt(min, max);
        }

        min = Math.min(min, max);
        max = Math.max(max, max);
        return (Math.random() * (max - min + 1)) + min;
    }

    public static isNumber(str: any): str is Number {
        return (typeof str === 'number' || str instanceof Number);
    }

    public static randomInt(min: number, max?: number): number {

        if (max === undefined) {
            max = min;
            min = 0;
        }


        min = Math.ceil(Math.min(min, max));
        max = Math.floor(Math.max(min, max));
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public static isValidRandom(num: number): boolean {
        return Numbers.random(1, num) == num
    }

    public static round(value: number, step: number): number {
        step || (step = 1.0);
        let inv = 1.0 / step;
        return Math.round(value * inv) / inv;
    }

    public static diff(a: number, b: number): number {
        if (a === 0) {
            return 0;
        }
        const diff = a - b;
        return diff / a;
    }

    public static format(num:number):string{
        return new Intl.NumberFormat().format(num)
    }
}
