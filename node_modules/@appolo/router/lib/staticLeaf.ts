import {LeafType, Methods} from "./enums";
import {Leaf, Params} from "./leaf";
import {IOptions} from "./IOptions";

export class StaticLeaf extends Leaf {

    public readonly Type:LeafType = LeafType.Static;


    constructor(part: string,options:IOptions) {
        super(part,options);
    }


    public check(parts: string[], index: number, params: Params): Leaf {


        let part = parts[index];

        if (part != this._part) {

            return null;
        }

        if (this._handler && index == parts.length - 1) {
            return this;
        }

        return this._checkLeafs(parts, index , params)
    }

}