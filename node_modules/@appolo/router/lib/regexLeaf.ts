import {LeafType} from "./enums";
import {Leaf, Params} from "./leaf";
import {Util} from "./util";
import {IOptions} from "./IOptions";
import pathToRegexp = require('path-to-regexp');

export class RegexLeaf extends Leaf {

    private _regex: RegExp;
    private _regexFull: RegExp;
    private _paramNames: string[];
    private _paramNamesFull: string[];
    private _isAny: boolean;

    public readonly Type = LeafType.Regex;

    constructor(part: string, parts: string[], index: number, options: IOptions) {
        super(part, options);

        let keys = [], keyFull = [];

        this._regex = pathToRegexp.pathToRegexp(Util.convertWildCard(this._part), keys);

        let fullPath = Util.joinByIndexWithWildCard(index, parts);

        this._regexFull = pathToRegexp.pathToRegexp(fullPath, keyFull);

        this._paramNames = keys.map(item => item.name);
        this._paramNamesFull = keyFull.map(item => item.name);

        this._isAny = part == "*";
    }


    public check(parts: string[], index: number, params: Params): Leaf {

        // if (index == parts.length) {
        //     return this._handler ? this:null;
        // }

        let part = parts[index];


        // if(this._leafs.length == 0 && this._handler){
        //     return this._checkFullPath(index,parts,params)
        // }

        let regexMatch = this._isAny ? [] :this._regex.exec(part);

        if (!regexMatch) {
            return null;
        }

        if (this._handler && index == parts.length - 1) {
            this._addParams(params, this._paramNames, regexMatch);
            return this;
        }

        let found = this._checkLeafs(parts, index, params);

        if (found) {
            this._addParams(params, this._paramNames, regexMatch);
            return found;
        }

        if (regexMatch && this._handler) {
            return this._checkFullPath(index, parts, params)

        }
    }

    private _checkFullPath(index: number, parts: string[], params: Params): Leaf {
        let regexMatch = this._regexFull.exec(Util.joinByIndex(index, parts));

        if (regexMatch) {
            this._addParams(params, this._paramNamesFull, regexMatch);
            return this;
        }

        return null;
    }

    private _addParams(params: Params, keys: string[], values: string[]) {
        if(!values.length){
            return;
        }
        let decode = this._options.decodeUrlParams;
        for (let i = 0, len = keys.length; i < len; i++) {
            params[keys[i]] = decode ? decodeURIComponent(values[i + 1]) : values[i + 1]
        }
    }

}
