import Default from "./Default";
import ItemValue from "./ItemValue";
import {ITransform, IValue} from "../../../classes";

export default class Autocomplete extends Default {

    constructor() {
        super('Autocomplete');
        this._value.getFormsValue = () => parseInt(this._value.getValue());
    }

    default(v: IValue): this {
        if (!v) return this;
        this.setObject(new ItemValue({
            id: v.value_option?.id ?? v.value_boolean.id,
            value: v.value_option?.id.toString() ?? v.value_boolean.id.toString(),
            description: v.value_option?.value ?? v.value_boolean.value,
            source: v.value_option
        }));
        this._fields = [this._value.getValueOption()];
        this._fieldsOriginal = this._fields;
        return super.default(v);
    }

    _format: any = (v: ItemValue) => {
        return v.getId();
    }

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