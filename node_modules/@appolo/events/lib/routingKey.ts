

export class RoutingKey {
    private static readonly Rules: [RegExp, string][] = [
        [new RegExp('\\.', 'g'), '\\.'],
        [new RegExp('\\*', 'g'), '([\\w|-]+)'],
        [new RegExp('#', 'g'), '([\\w|.|-]*)']
    ];

    private static readonly RegexRoute = new RegExp("\\*|#");

    public static isRoutingRoute(key: string): boolean {
        return this.RegexRoute.test(key);
    }

    public static test(pattern: string, key: string): boolean {
        const regex = this.createRegex(pattern);
        return regex.test(key)
    }


    public static createRegex(pattern: string): RegExp {
        for (let i = 0, len = this.Rules.length; i < len; i++) {
            let rule = this.Rules[i];

            pattern = pattern.replace(rule[0], rule[1])
        }

        let regex = new RegExp(`^${pattern}$`);

        return regex
    }
}

