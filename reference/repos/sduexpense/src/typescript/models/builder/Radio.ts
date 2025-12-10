import Default from "./Default";

export default class Radio extends Default {

    constructor() {
        super('Radio');
    }

    _format: any = (v: any) => v.value;

    clearSelf() {
        this._defaultObject = undefined;
        try {
            this.tsxClear();
            window.localStorage.removeItem(`radio:${this._key}`);
        } catch (e) { console.log(e) }
    }

    defaultFromCache() {
        let store = window.localStorage.getItem(`radio:${this._key}`);
        this._defaultObject = store ? JSON.parse(store) : this._defaultObject;
        return this;
    }
}