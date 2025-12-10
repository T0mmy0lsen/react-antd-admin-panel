import Default from "./Default";

export default class Autocomplete extends Default {

    constructor() {
        super('Autocomplete');
    }

    _format: any = (v: any) => v.object?.id ?? console.log('Autocomplete: you should implement a format function.');

    clearSelf() {
        this._defaultObject = undefined;
        try {
            this.tsxClear();
            window.localStorage.removeItem(`autocomplete:${this._key}`);
        } catch (e) { console.log(e) }
    }

    defaultFromCache() {
        try {
            let store = window.localStorage.getItem(`autocomplete:${this._key}`);
            this._defaultObject = store ? JSON.parse(store) : this._defaultObject;
        } catch (e) { console.log(e) }
        return this;
    }
}