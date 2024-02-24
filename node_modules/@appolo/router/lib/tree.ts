import {LeafType, Methods} from "./enums";
import {Leaf, Params} from "./leaf";
import {IOptions} from "./IOptions";

export class Tree extends Leaf {

    constructor(options:IOptions) {
        super("",options);
    }

    public readonly Type = LeafType.Tree;

    public check(parts: string[], index: number, params: Params): Leaf {



        return this._checkLeafs(parts, index, params)
    }

    public remove(parts: string[], index: number = 0){
        for (let j = 0; j < this._numLeafs; j++) {

            this._leafs[j].remove(parts, index);
        }
    }

}