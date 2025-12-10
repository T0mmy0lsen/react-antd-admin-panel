export default class CheckboxItem {

    constructor() {

    }

    _key: any;
    key(v: any) { this._key = v; return this; }

    _value: any;
    value(v: any) { this._value = v; return this; }

    _label: any;
    label(v: any) { this._label = v; return this; }

    getObject() {
        return ({
            label: this._label,
            value: this._value,
        })
    }
}