
export default class ListHeader {

    constructor(obj?: any) {
        if (obj) Object.keys(obj).forEach((o: any) => {
            // @ts-ignore
            if (typeof this[o] === 'function') this[o](obj[o])
        });
        this._object = obj;
    }



    _object: any;
    object(v: string) { this._object = v; return this; }

    _default: any;
    default(v: any) { this._default = v; return this; }

    _onChange: any;
    onChange(v: any) { this._onChange = v; return this; }

    // When dataIndex / key is set, the value of the dataIndex in the object is send to the render-function as 'value'.

    _key: any;
    key(v: string) { this._key = v; return this; }

    _type: string = 'Input';
    type(v: string) { this._type = v; return this; }

    _items: any = [];
    items(v: any) { this._items = v; return this; }

    _title: any;
    title(v: string) { this._title = v; return this; }

    _rowClassName: any;
    rowClassName(v: string) { this._rowClassName = v; return this; }

    _width: any;
    width(v: string) { this._width = v; return this; }

    _editable: any = false;
    editable(v?: boolean) { this._editable = v ? v : !v; return this; }

    _disabled: any = false;
    disabled(v?: boolean) { this._disabled = v ? v : !v; return this; }

    _sortable: any;
    sortable(v?: boolean) { this._sortable = v ? v : !v; return this; }

    _filterable: boolean = false;
    filterable(v?: boolean) { this._filterable = v ? v : !v; return this; }

    _searchable: boolean = false;
    searchable(v?: boolean) { this._searchable = v ? v : !v; return this; }

    _render: any;
    _renderCustom: any;
    render(v: (value: any, object: any) => any) { this._renderCustom = v; return this; }

    // List.tsx will call this to get the header object.
    getObject()
    {
        let addProps: any = {};

        if (this._width) addProps['width'] = this._width;

        return { ...addProps, ...{
            key: this._key,
            type: this._type,
            title: this._title ?? this._key[0].toUpperCase() + this._key.substr(1) ?? 'Title',
            items: this._items,
            dataIndex: this._key,
            editable: this._editable,
            sortable: this._sortable,
            filterable: this._filterable,
            searchable: this._searchable,
            render: (v: any, o: any) => this._render(v, o)
        }}
    }
}