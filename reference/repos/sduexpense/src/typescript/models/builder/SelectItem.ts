import {ReactNode} from "react";

export default class SelectItem {

    propsToAdd = ['id', 'text'];

    constructor(
        key: string,
        value?: any,
        title?: ReactNode,
        text?: ReactNode
    ) {
        this.key(key);
        this.value(value ?? key);
        this.title(title
            ?? (value && value[0].toUpperCase() + value.substr(1))
            ?? (key && key[0].toUpperCase() + key.substr(1))
        );
    }

    _id: any;
    id(v: string) { this._id = v; return this; }

    _key: any;
    key(v: string) { this._key = v; return this; }

    _value: any;
    value(v: string) { this._value = v; return this; }

    _text: any;
    text(v: any) { this._text = v; return this; }

    _title: any;
    title(v: any) { this._title = v; return this; }

    _render: any;
    render(v: any) { this._render = v; return this; }

    getObject() {
        let addProps: any = {};
        // @ts-ignore
        this.propsToAdd.forEach((r: string) => { if (this[`_${r}`]) addProps[r] = this[`_${r}`] });
        return ({ ...{
            key: this._key,
            value: this._value,
            title: this._title,
        }, ...addProps })
    }
}