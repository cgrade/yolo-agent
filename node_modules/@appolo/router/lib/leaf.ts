import {LeafType} from "./enums";
import {Util} from "./util";
import {LeafFactory} from "./leafFactory";
import {IOptions} from "./IOptions";

export interface Params {
    [index: string]: string
}


export abstract class Leaf {

    protected _leafs: Leaf[];
    protected _numLeafs: number;
    protected _handler: any;
    protected _part: string;
    protected _options: IOptions;

    public abstract readonly Type: LeafType;

    constructor(part: string, options) {
        this._leafs = [];
        this._numLeafs = 0;
        this._part = part;
        this._options = options
    }


    public get part(): string {
        return this._part
    }

    public remove(parts: string[], index: number = 0) {
        if (this._part == parts[index]) {
            if (index == parts.length - 1 && this._handler) {
                this._handler = null;
                return;
            }

            for (let j = 0; j < this._numLeafs; j++) {

                this._leafs[j].remove(parts, index + 1);
            }

        }
    }

    public add(parts: string[], index: number = 0): Leaf {
        if (parts.length == index) {
            return this;
        }

        let part = parts[index];

        let leaf: Leaf = this.leafs.find(leaf => leaf.part == part);

        if (!leaf) {
            leaf = require("./leafFactory").LeafFactory.createLeaf(part, parts, index, this._options);
            this._leafs.push(leaf);
            this._leafs = Util.sortBy(this._leafs, (item: Leaf) => item.Type);
            this._numLeafs = this._leafs.length;
        }

        return leaf.add(parts, index + 1)

    }

    public set handler(handler: any) {
        this._handler = handler;
    }

    public get handler(): any {
        return this._handler
    }

    public abstract check(parts: string[], index: number, params: Params): Leaf


    protected _checkLeafs(parts: string[], index: number, params: Params): Leaf {
        let len = this._numLeafs;

        for (let j = 0; j < len; j++) {

            let found = this._leafs[j].check(parts, index + 1, params);

            if (found) {
                return found;
            }
        }

        return null;
    }

    public get leafs(): Leaf[] {
        return this._leafs
    }
}
