import {Arrays} from "./arrays";
import {ChainObject} from "./chainObject";

export class Chain<K> {
    constructor(private _value: any[]) {

    }

    public arrayify(val: any): this {
        this._value = Arrays.arrayify(this._value);
        return this
    }

    public clone(): this {
        this._value = Arrays.clone(this._value);
        return this;
    }

    public compact(): this {
        this._value = Arrays.compact(this._value);
        return this;
    }

    public removeBy<S = K>(criteria: (value: S, i?: number) => boolean): this {
        Arrays.removeBy(this._value, criteria);
        return this;
    }

    public remove(item: K): this {
        Arrays.remove(this._value, item)

        return this;
    }

    public chunk(size: number): this {
        this._value = Arrays.chunk(this._value, size);
        return this;
    }

    public flat<S = K>(): Chain<S> {
        this._value = Arrays.flat(this._value);
        return this as any;
    }

    public flatDeep<S = K>(depth: number = 1): Chain<S> {
        this._value = Arrays.flatDeep(this._value, depth);
        return this as any;
    }

    public sortBy<S = K>(criteria: (value: S) => any): this {
        this._value = Arrays.sortBy(this._value, criteria);
        return this;
    }

    public sort(): this {
        this._value = Arrays.sort(this._value);
        return this;
    }

    public zip(...args: Array<Array<K>>): this {
        this._value = Arrays.zip(this._value, ...args);
        return this;
    }


    public uniqBy<S = K>(criteria: (value: S, i?: number) => any): this {
        this._value = Arrays.uniqBy(this._value, criteria);
        return this
    }

    public uniq(): this {
        this._value = Arrays.uniq(this._value);
        return this
    }

    public sum(): number {
        return Arrays.sum(this._value);
    }

    public sumBy<S = K>(criteria: (value: S, i?: number) => any): number {
        return Arrays.sumBy(this._value, criteria);
    }

    public difference<S = K>(arr2: S[]): this {
        this._value = Arrays.difference(this._value, arr2);
        return this
    }

    public differenceBy<S = K>(arr2: S[], criteria: (value: S, i?: number) => any): this {
        this._value = Arrays.differenceBy(this._value, arr2, criteria);
        return this
    }

    public map<U, S = K>(predicate: (value: S, index: number, array: S[]) => U): Chain<U> {
        this._value = this._value.map(predicate);
        return this as any
    }

    public filter<S = K>(predicate: (value: S, index?: number, array?: S[]) => boolean): this {
        this._value = this._value.filter(predicate);
        return this
    }

    public find<S = K>(predicate: (value: S, index?: number, array?: S[]) => boolean): S | undefined {
        return this._value.find(predicate);
    }

    public forEach<S = K>(predicate: (value: S, index?: number, array?: S[]) => void): void {
        this._value.forEach(predicate);
    }

    public includes<S = K>(searchElement: S, fromIndex?: number): boolean {
        return this._value.includes(searchElement, fromIndex);
    }

    public indexOf<S = K>(searchElement: S, fromIndex?: number): number {
        return this._value.indexOf(searchElement, fromIndex);
    }

    public every<S = K>(predicate: (value: S, index: number, array: S[]) => boolean): boolean {
        return this._value.every(predicate);
    }

    public some<S = K>(predicate: (value: S, index: number, array: S[]) => boolean): boolean {
        return this._value.some(predicate);
    }

    public concat(...items: (K)[][]): this {
        this._value = this._value.concat(...items);

        return this;
    }

    public shift<S = K>(): S {
        return this._value.shift() as S
    }

    public pop<S = K>(): S {
        return this._value.pop() as S
    }

    public length(): number {
        return this._value.length
    }

    public push<S = K>(...items: S[]): this {

        this._value.push(...items);

        return this;
    }

    public unshift<S = K>(...items: S[]): this {

        this._value.unshift(...items);

        return this;
    }

    public keyBy<S = K>(key?: string | ((item: S, index: number) => string)): { [index: string]: S } {
        return Arrays.keyBy(this._value, key)
    }

    public groupBy<S = K>(key: string | number | ((item: S) => string | number)): { [index: string]: S[] } {

        return Arrays.groupBy(this._value, key);
    }

    public random<S = K>(): S {
        return Arrays.random(this._value);
    }

    public randomItems<S = K>(count: number = 1): S[] {
        return Arrays.randomItems(this._value, count);
    }

    public value<S = K>(): S[] {
        return this._value as S[]
    }
}
export function _<K>(arr: K[]): Chain<K>
export function _<K extends object>(arr: K): ChainObject<K>
export function _<K = any>(arr: K[]): Chain<K> | ChainObject<any> {
    return Array.isArray(arr) ? new Chain<K>(arr) : new ChainObject<any>(arr as any)
}
