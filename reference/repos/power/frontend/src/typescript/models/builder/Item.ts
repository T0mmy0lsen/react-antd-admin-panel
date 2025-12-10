import {ReactNode} from "react";
import {Access} from "../../index";

export default class Item {

    propsToAdd = ['id', 'text', 'render', 'style', 'object'];

    constructor(
        key: any,
        value?: any,
        title?: ReactNode,
        text?: ReactNode
    ) {
        this.key(key);
        this.value(value ?? this._key);
        this.title(title ?? this._value);
    }

    _id: any;
    id(v: any) { this._id = v; return this; }

    _key: any;
    key(v: any) { this._key = v; return this; }

    _text: any;
    text(v: any) { this._text = v; return this; }

    _type: any;
    type(v: any) { this._type = v; return this; }

    _icon: any;
    icon(v: any) { this._icon = v; return this; }

    _value: any;
    value(v: any) { this._value = `${v}`; return this; }

    _style: any;
    style(v: any) { this._style = v; return this; }

    _title: any;
    title(v: any) { this._title = v ? (isNaN(v) ? v[0].toUpperCase() + v.substr(1) : `${v}`) : undefined; return this; }

    _object: any;
    object(v: any) { this._object = v; return this; }

    _render: any;
    render(v: any) { this._render = v; return this; }

    _access: any;
    access(v: any) { this._access = v; return this; }

    _description: any;
    description(v: string) { this._description = v; return this; }

    _disabled: any;
    disabled(v: any) { this._disabled = v; return this; }

    _callback: any;
    callback(v: any) { this._callback = v; return this; }

    getData() {
        return this._object;
    }

    getObject() {
        let addProps: any = {};
        // @ts-ignore
        this.propsToAdd.forEach((r: string) => { if (this[`_${r}`]) addProps[r] = this[`_${r}`] });
        return ({ ...{
            id: this._id,
            key: this._key,
            value: this._value,
            label: this._render?.(),
            title: this._title,
            object: this,
        }, ...addProps })
    }
}