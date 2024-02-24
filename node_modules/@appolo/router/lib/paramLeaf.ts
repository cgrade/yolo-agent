import {LeafType, Methods} from "./enums";
import {Leaf, Params} from "./leaf";
import {IOptions} from "./IOptions";

export class ParamLeaf extends Leaf {

    private _paramName: string;

    constructor(part: string,options:IOptions) {
        super(part,options);

        this._paramName = this._part.substr(1);
    }

    public readonly Type = LeafType.Param;

    public check(parts: string[], index: number, params: Params): Leaf {

        if (index == parts.length) {
            return null;
        }

        let part = parts[index];


        if (this._handler && index == parts.length - 1) {
            params[this._paramName] = this._options.decodeUrlParams ? decodeURIComponent(part):part;
            return this;
        }

        let found = this._checkLeafs(parts, index, params);

        if (found) {
            params[this._paramName] = part;
            return found;
        }
    }

}