export default class Helpers {

    static getIndicesOf(searchStr, str, caseSensitive)
    {
        let searchStrLen = searchStr.length;
        if (searchStrLen == 0) return [];

        let startIndex = 0;
        let index: any;
        let indices: any = [];

        if (!caseSensitive) {
            str = str.toLowerCase();
            searchStr = searchStr.toLowerCase();
        }

        while ((index = str.indexOf(searchStr, startIndex)) > -1) {
            indices.push(index);
            startIndex = index + searchStrLen;
        }

        return indices;
    }

    static hash(value: any, length: number = 8) {
        value = Helpers.safeStringify(value);
        let hash: number = 5381;
        let index: number = value.length;
        while (index) hash = (hash * 33) ^ value.charCodeAt(--index);
        hash = hash >>> 0;
        return hash.toString(length);
    }

    static safeStringify(obj: any, indent: number = 2) {
        let cache: any = [];
        const retVal = JSON.stringify(
            obj,
            (value: string) =>
                typeof value === "object" && value !== null
                    ? cache.includes(value)
                    ? undefined // Duplicate reference found, discard key
                    : cache.push(value) && value // Store value in our collection
                    : value,
            indent
        );
        cache = null;
        return retVal;
    };

    static stamp() {
        return `S${new Date().getSeconds().toString()}-M${new Date().getMilliseconds().toString()}`;
    }

    static store(data: any, has: any, fallback: any)
    {
        return Helpers.inside(data, `c.request.store.${has}`, fallback);
    }

    static inside(data: any, has: any, fallback: any = undefined) : any {
        if (typeof has === 'string') has = has.split('.');
        let temp = data;
        let fail = false;
        has.forEach((r: any) => {
            if (!temp) fail = true;
            if (!fail && r in temp) {
                temp = temp[r];
            } else {
                temp = undefined;
            }
        });
        return temp ?? fallback;
    }
}