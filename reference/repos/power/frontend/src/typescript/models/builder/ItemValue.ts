import {ITransform, IValueOption} from "../../../classes";

export default class ItemValue {

    _id: number;
    _value: string;
    _description: string;
    _valueOption: IValueOption;
    _color: any;

    constructor(value?: ITransform) {
        this._id = value?.id ?? 0;
        this._value = value?.value ?? '';
        this._description = value?.description ?? '';
        this._valueOption = value?.source as IValueOption;
        this._color = value?.color;
    }

    hasValue() { return this._id || this._value || this._description; }

    getId() { return this._id; }
    getValue() { return this._value; }
    getDescription() { return this._description; }
    getFormsValue(): any { if (this.getId()) return this.getId(); }

    getValueOption(): IValueOption { return this._valueOption; }
}