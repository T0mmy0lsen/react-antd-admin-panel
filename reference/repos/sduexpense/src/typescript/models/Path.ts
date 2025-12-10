export default class Path {
    _matchedPath: any;
    _actualPath: any;
    _params: any;
    _search: any = undefined;
    _query: any = undefined;
    _route: any = undefined;

    constructor(object: {
        route?: any,
        search?: any,
        params?: any,
        actualPath?: any,
        matchedPath?: any,
    }) {
        if (object.search) {
            const params = new URLSearchParams(object.search);
            let paramObj: any = {};
            params.forEach((value: string, key: string) => {
                paramObj[key] = value;
            });

            this._query = paramObj;
            this._search = object.search;
        }

        this._route = object.route ?? undefined;
        this._params = object.params ?? undefined;
        this._actualPath = object.actualPath ?? undefined;
        this._matchedPath = object.matchedPath ?? undefined;
    }

    copy() {
        return new Path({
            route: this._route,
            search: this._search,
            params: this._params,
            actualPath: this._actualPath,
            matchedPath: this._matchedPath,
        });
    }
}