
export class Util {

    private static readonly RegexChars = ["?", "(", "+", "*", "-"];

    public static isRegex(path: string): boolean {

        return this.RegexChars.some( char => path.includes(char)) || path.indexOf(":") != path.lastIndexOf(":");
    }

    public static isStaticRoute(path): boolean {
        return !Util.isRegex(path) && ![":"].some( char => path.includes(char));
    }

    public static isParam(path: string): boolean {

        return path.charCodeAt(0) == 58
    }

    public static removeTailSlash(path: string): string {
        return path.charCodeAt(path.length - 1) === 47 ? path.slice(0, -1) : path;

    }

    public static removeHeadSlash(path: string): string {
        return path.charCodeAt(0) === 47 ? path.slice(1) : path;
    }

    public static convertWildCard(part: string): string {

        if (part == "*") {
            return "(.*)"
        }

        if (part.endsWith("*")) {
            return part.slice(0, -1) + "(.*)"
        }


        return part
    }

    public static joinByIndex(index: number, parts: string[]): string {
        let part = "";
        for (let i = index, len = parts.length; i < len; i++) {
            part += parts[i];

            if (i < len - 1) {
                part += "/"
            }
        }

        return part
    }

    public static joinByIndexWithWildCard(index: number, parts: string[]): string {
        let part = "";
        for (let i = index, len = parts.length; i < len; i++) {
            part += Util.convertWildCard(parts[i]);

            if (i < len - 1) {
                part += "/"
            }
        }

        return part
    }

    public static sortBy<T>(arr: T[], criteria: (value: T) => any): T[] {
        arr = arr.slice(0);

        arr.sort((a, b) => {
            let valueA = criteria(a), valueB = criteria(b);
            return (valueA > valueB) ? 1 : ((valueB > valueA) ? -1 : 0);
        });

        return arr;
    }
}
