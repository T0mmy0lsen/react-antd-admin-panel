import Default from "./Default";

export default class Select extends Default {

    constructor() {
        super('Select');
    }

    _format: any = (v: any) => v.value;

    _options: any;
    options(v: any) { this._options = v; return this; }

    _dataSource: any;
    dataSource(v: any) {
        this._dataSource = v;
        this._fields = this._options(v);
        return this;
    }

    clearSelf() {
        this._defaultObject = undefined;
        try {
            this.tsxClear();
            window.localStorage.removeItem(`radio:${this._key}`);
        } catch (e) { console.log(e) }
    }

    defaultFromCache() {
        let store = window.localStorage.getItem(`select:${this._key}`);
        this._defaultObject = store ? JSON.parse(store) : this._defaultObject;
        return this;
    }
}