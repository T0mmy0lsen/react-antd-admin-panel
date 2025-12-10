import Default from "./Default";
import {ITransform, IValue, IValueOption} from "../../../classes";
import ItemValue from "./ItemValue";
import {findByKey} from "../../../helpers";

export default class Selection extends Default {

    constructor() {
        super('Selection');
        this._value.getFormsValue = () => parseInt(this._value.getValue());
    }

    default(v: IValue): this {
        if (!v) return this;
        this.setObject(new ItemValue({
            id: v.value_option?.id ?? v.value_boolean.id,
            value: v.value_option?.id.toString() ?? v.value_boolean.id.toString(),
            description: v.value_option?.value ?? v.value_boolean.value
        }));
        return super.default(v);
    }

    addMore(v: IValueOption[]): this {
        return super.addMore(v.map((v: any) => new ItemValue(({
            id: v.id,
            value: v.id.toString(),
            description: v.value,
            color: findByKey(v.fields, 'color')?.value,
            source: v
        }))))
    }

    _format: any = (v: ItemValue) => {
        return v.getId();
    }

    clearSelf() {
        this._defaultObject = undefined;
        try {
            this.tsxClear();
            window.localStorage.removeItem(`selection:${this._key}`);
        } catch (e) { console.log(e) }
    }

    defaultFromCache() {
        let store = window.localStorage.getItem(`selection:${this._key}`);
        this._defaultObject = store ? JSON.parse(store) : this._defaultObject;
        return this;
    }

    _color: (i: ItemValue) => any = () => {};
    color(v: any) { this._color = v; return this; }
}