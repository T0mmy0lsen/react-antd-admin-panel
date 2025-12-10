import Default from "./Default";

export default class Input extends Default {

    constructor() {
        super('Input');
    }

    _suffix: any;
    suffix(v?: any) {
        this._suffix = v; return this;
    }

    _onPressEnter: any = false;
    onPressEnter(v?: any) {
        this._onPressEnter = v ?? true; return this;
    }

    _autofocus: boolean = false;
    autofocus(v?: boolean) {
        this._autofocus = v ?? true; return this;
    }

    clearSelf() {
        this._defaultObject = undefined;
        try {
            this.tsxClear();
            window.localStorage.removeItem(`radio:${this._key}`);
        } catch (e) { console.log(e) }
    }
}