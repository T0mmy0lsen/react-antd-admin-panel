import Default from "./Default";
import ItemValue from "./ItemValue";
import {IValue, IValueOption} from "../../../classes";

export default class Selections extends Default {

    constructor() {
        super('Selections');
    }

    default(v: IValue[]): this {
        if (!v) return this;
        return super.default(v);
    }

    addMore(v: IValueOption[]): this {
        return super.addMore(v.map((v: any) => new ItemValue(({
            id: v.id,
            value: v.id.toString(),
            description: v.value,
            color: v.fields.find((f: any) => f.key === 'color')?.value,
            source: v
        }))))
    }
    _color: (i: ItemValue) => any = () => {};
    color(v: any) { this._color = v; return this; }
}