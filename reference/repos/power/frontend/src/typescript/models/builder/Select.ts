import Default from "./Default";
import ItemValue from "./ItemValue";
import {ITransform, IValue, IValueOption} from "../../../classes";

export default class Select extends Default {

    constructor() {
        super('Select');
    }

    default(v: IValue): this {
        if (!v) return this;
        this.setObject(new ItemValue({
            id: v.value_option?.id ?? v.value_boolean.id,
            value: v.value_option?.id.toString() ?? v.value_boolean.id.toString(),
            description: v.value_option?.value ?? v.value_boolean.value,
            source: v
        }));
        return super.default(v);
    }

    addMoreOriginal(v: IValueOption[]): this {
        if (!v) return this;
        this._fieldsOriginal = v.map((v: any) => new ItemValue(({
            id: v.id,
            value: v.id.toString(),
            description: v.value,
            source: v
        })))
        return this;
    }

    addMore(v: IValueOption[]): this {
        if (!v) return this;
        return super.addMore(v.map((v: any) => new ItemValue(({
            id: v.id,
            value: v.id.toString(),
            description: v.value,
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
            window.localStorage.removeItem(`radio:${this._key}`);
        } catch (e) { console.log(e) }
    }

    defaultFromCache() {
        let store = window.localStorage.getItem(`select:${this._key}`);
        this._defaultObject = store ? JSON.parse(store) : this._defaultObject;
        return this;
    }
}