import {Arrays} from "@appolo/utils"
import mime = require("mime")

export class Typeis {
    public static isType(contentType: string, ...types: (string | string[])[]): boolean | string {
        let typesFlat: string[] = [];

        if (!contentType) {
            return false;
        }

        contentType = (contentType.split(";")[0]).toLowerCase()

        types.forEach(type => Array.isArray(type) ? typesFlat.push(...type) : typesFlat.push(type));

        if (!types || !types.length || !contentType) {
            return contentType || false
        }

        for (let i = 0; i < typesFlat.length; i++) {

            let type = (typesFlat[i]);

            let typeNormalize = Typeis.normalize(type);

            if(typeNormalize){
                typeNormalize = typeNormalize.toLowerCase()
            }

            if (Typeis.mimeMatch(typeNormalize, contentType)) {

                return (type[0] === '+' || type.indexOf('*') !== -1)
                    ? contentType
                    : type
            }
        }

        return false
    }

    private static normalize(type: string): string | false {
        if (typeof type !== 'string') {
            return false
        }

        switch (type) {
            case 'urlencoded':
                return 'application/x-www-form-urlencoded'
            case 'multipart':
                return 'multipart/*'
        }

        if (type[0] === '+') {
            return '*/*' + type
        }

        return type.indexOf('/') === -1
            ? mime.getType(type) || false
            : type
    }

    private static mimeMatch(expected: string | false, actual: string): boolean {

        if (!expected) {
            return false
        }

        let actualParts = actual.split('/')
        let expectedParts = expected.split('/')

        if (actualParts.length !== 2 || expectedParts.length !== 2) {
            return false
        }

        if (expectedParts[0] !== '*' && expectedParts[0] !== actualParts[0]) {
            return false
        }

        if (expectedParts[1].substr(0, 2) === '*+') {
            return expectedParts[1].length <= actualParts[1].length + 1 &&
                expectedParts[1].substr(1) === actualParts[1].substr(1 - expectedParts[1].length)
        }

        return !(expectedParts[1] !== '*' && expectedParts[1] !== actualParts[1]);
    }
}
