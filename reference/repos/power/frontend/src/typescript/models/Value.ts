export default class Value
{
    get() { return this._model._format(this._value); }

    _value: any;
    set(value: any) { this._value = value; return this; }

    _model: any;
    model(value: any) { this._model = value; return this; }
}