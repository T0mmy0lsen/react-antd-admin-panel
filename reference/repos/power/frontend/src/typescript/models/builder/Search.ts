import Default from "./Default";

export default class Search extends Default {

    _search: string = '';

    constructor() {
        super('Search')
    }

    search() {
        return this._search;
    }
}