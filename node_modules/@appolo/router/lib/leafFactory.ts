import {Util} from "./util";
import {RegexLeaf} from "./regexLeaf";
import {ParamLeaf} from "./paramLeaf";
import {StaticLeaf} from "./staticLeaf";
import {IOptions} from "./IOptions";

export class LeafFactory{
    public static createLeaf(part: string, parts: string[], index: number,options:IOptions){
        if (Util.isRegex(part)) {
            return new RegexLeaf(part,parts,index,options);
        }
        else if(Util.isParam(part)){
            return new ParamLeaf(part,options);
        } else {
            return new StaticLeaf(part,options);
        }

    }
}