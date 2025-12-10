import Default from "./Default";
import ItemValue from "./ItemValue";

export default class Input extends Default {

    constructor() {
        super('Input');
        this._value.getFormsValue = () => this._value.getValue();
    }

    accessItemValue(v: any) {
        if (!this._value) console.error('Function setGetFormsValue() needs to be called after default()')
        v(this._value);
        return this;
    }

    default(v: any): this {
        this.setValue(v);
        return super.default(v);
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

    _copyable: boolean = false;
    copyable(v?: boolean) {
        this._copyable = v ?? true; return this;
    }
}