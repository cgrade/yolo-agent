import {Objects} from "./objects";
import {Chain} from "./chain";

export class ChainObject<K extends object> {
    constructor(private _value: object) {

    }

    public pick<U extends keyof K>(...pick: U[]): this {
        this._value = Objects.pick(this._value as any, ...pick);
        return this
    }

    public omit<U extends keyof K>(...omit: U[]): this {
        this._value = Objects.omit(this._value as any, ...omit);
        return this
    }

    public invert<K extends { [index: string]: any }>(): ChainObject<K> {
        this._value = Objects.invert(this._value);
        return this
    }


    public replaceFormatJson(data: { [index: string]: any }): this {
        this._value = Objects.replaceFormatJson(this._value, data);
        return this;
    }

    public defaults<T>(...args: Partial<T>[]): this {
        this._value = Objects.defaults(this._value, ...args) as any;

        return this
    }

    public defaultsDeep<T>(...args: Partial<T>[]): this {
        this._value = Objects.defaultsDeep(this._value, ...args) as any;

        return this
    }

    public cloneDeep<T>(...args: Partial<T>[]): this {
        this._value = Objects.cloneDeep(this._value) as any;

        return this
    }

    public clone(): this {
        this._value = Objects.clone(this._value);
        return this;
    }

    public cloneFast(): this {
        this._value = Objects.cloneFast(this._value);
        return this;
    }

    public compact(): this {
        this._value = Objects.compact(this._value);
        return this;
    }

    public tryStringifyJSON(): string {
        return Objects.tryStringifyJSON(this._value);

    }

    public get<T>(path: string, defValue?: T): T {
        return Objects.get(this._value, path, defValue);

    }

    public set(path: string, value?: any): this {
        Objects.set(this._value, path, value);

        return this
    }

    public has(path: string): boolean {
        return Objects.has(this._value, path);
    }

    public keys(): Chain<string> {
        return new Chain(Object.keys(this._value))
    }

    public values<T>(): Chain<T> {
        return new Chain(Object.values(this._value))
    }

    public assign(...sources: any[]): this {
        Object.assign(this._value, ...sources)
        return this;
    }

    public forEach<T>(criteria: (value: T, i?: number | string) => void): this {
        Object.keys(this._value).forEach(key => criteria(this._value[key], key));

        return this;
    }

    public value<S = K>(): S {
        return this._value as any
    }
}


