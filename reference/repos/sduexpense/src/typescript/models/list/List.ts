import {ListItem} from "../../index";
import Section from "../builder/Section";
import Default from "../builder/Default";
import Action from "../Action";
import ListHeader from "./ListHeader";

export default class List extends Default {

    _random: any;

    constructor() {
        super('List');
    }

    clearSelf() {
        this._defaultObject = undefined;
        try {
            this.tsxClear();
            window.localStorage.removeItem(`autocomplete:${this._key}`);
        } catch (e) { console.log(e) }
    }

    defaultFromCache() {
        let store = window.localStorage.getItem(`list:${this._key}`);
        this._defaultObject = store ? JSON.parse(store) : this._defaultObject;
        return this;
    }

    section(section: Section) {
        super.section(section);
        Object.keys(this._actions).forEach(r => {
            this._actions[r].section(section);
            this._actions[r]._class = 'List'
            this._actions[r]._key = this._actions[r]._key ?? this._actions[r]._label.toLowerCase();
        });
    }

    getDefaultFilter()
    {
        let filter = {};

        this._headerPrepend.forEach((h: ListHeader) => {
            let cachedFilter = window.localStorage.getItem(`filter:${h._title}`);
            if (cachedFilter) filter[h._key] = JSON.parse(cachedFilter);
        })

        return filter;
    }

    setItems(args?: any) : ListItem[]
    {
        this._random = Math.round(Math.random() * 1000);
        let data =
            args
            ?? this._get?._data
            ?? this._get?._data?.data
            ?? this._defaultObject.dataSource
            ?? [];

        data = Array.isArray(data) ? data : [];

        data = data.map((r: any, index: number) => {
            r['key'] = `${this._unique(r)}-${index}-${this._random}`;
            r['index'] = index;
            if (this._append) this._append.forEach((a: any) => r[a.key] = a.value(r))
            return r;
        });

        return data.map((r: any) => new ListItem(r, this))
    }

    /** Cycle Hooks are called by the .tsx and either next() or stop() should be called */

    /** On-functions are called by the .tsx and set by the builder */

    _onRecordWasEdited: (v: ListItem) => void = (v: ListItem) => { return v; };
    onRecordWasEdited(v: any) { this._onRecordWasEdited = v; return this; };

    _onRecordWasSaved: (v: ListItem) => void = (v: ListItem) => { return v; };
    onRecordWasSaved(v: any) { this._onRecordWasSaved = v; return this; };

    _rowClassName: any;
    rowClassName(v: string) { this._rowClassName = v; return this; }

    _onRowClicked: (e: any, v: any, i: number | undefined) => void = (e: any, v: any, i: number | undefined) => { return v; };
    onRowClicked(v: any) { this._onRowClicked = v; return this; };

    /** Component-return functions. */

    tsxSetExpandable: any = () => {};
    tsxSetMenu: any = () => {};

    setRecord: any = () => {};
    getHeaders: any = () => {};
    getRecords: any = () => {
        console.log('List: getRecords() not implemented before the component is set.');
        return this.setItems();
    };
    getDeletedKeys: any = () => {};
    getEditingKeys: any = () => {};
    clearDeletedKeys: any = () => {};
    clearExpandedKeys: any = () => {};
    setRecordValue: any = () => {};
    setExpandableRowRender: any = () => {};
    editRecord: any = () => {};
    deleteRecord: any = () => {};
    removeRecord: any = () => {};
    removeRecords: any = () => {};
    moveRecord: any = () => {};

    /** Builder-functions */

    _unique: any = (v) => v;
    unique(v: any) { this._unique = v; return this; }

    _append: any = [];
    appends(v: any) { this._append.push(v); return this; }
    append(v: any) { this._append = v; return this; }

    _editable: any = [];
    editable(v: string[]) { this._editable = v; return this; }

    _filterable: any;
    filterable(v: string[]) { this._filterable = v; return this; }

    _emptyIcon: any;
    emptyIcon(v: any) { this._emptyIcon = v; return this; }

    _emptyText: any;
    emptyText(v: any) { this._emptyText = v; return this; }

    _emptyColumn: any;
    emptyColumn(v: any) { this._emptyColumn = v; return this; }

    /** Menu */

    _menu: any;
    _menuSection: any;
    _menuSectionActive: any;

    menu(v: any) { this._menu = v; return this; }
    menuSection(v: any) { this._menuSection = v; return this; }
    menuSectionActive(v: any) { this._menuSectionActive = v; return this; }

    /** Expandable */

    _expandable: any;
    _expandableSingles: boolean = false;
    _expandableSection: any;
    _expandableSectionActive: any;
    _expandableByClick: any = false;
    _expandableExpandAll: any = false;

    expandable(v: any) { this._expandable = v; return this; }
    expandableSingles() { this._expandableSingles = true; return this; }
    expandableSection(v: any) { this._expandableSection = v; return this; }
    expandableSectionActive(v: any) { this._expandableSectionActive = v; return this; }
    expandableByClick() { this._expandableByClick = true; return this; }
    expandableExpandAll() { this._expandableExpandAll = true; return this; }

    _addDummyColumn: boolean = false;
    addDummyColumn(value: boolean) { this._addDummyColumn = value; return this; }

    _headerMaxWidth: any[] = [];
    headerMaxWidth(width: any[]) { this._headerMaxWidth = width; return this; }

    _headerPrepend: any = [];
    headerPrepend(v: any) { if (!this._headerPrepend.some((r: ListHeader) => v._key === r._key)) this._headerPrepend.push(v); return this; }

    _headerAppend: any = [];
    headerAppend(v: any) { if (!this._headerAppend.some((r: ListHeader) => v._key === r._key)) this._headerAppend.push(v); return this; }

    _headerFilter: string[] = [];
    headerFilter(filter: string[]) { this._headerFilter = filter; return this; }

    _headerWidth: any = {};
    headerWidth(v: any) { this._headerWidth = v; return this; }

    _headerHide: string[] = [];
    hideHeader(v: string[]) { return this.headerHide(v) };
    headerHide(v: string[]) { this._headerHide = v; return this; }

    _headerCreate: boolean = true;
    headerCreate(value: boolean) { this._headerCreate = value; return this; }

    _header: boolean = true;
    header(value: boolean) { this._header = value; return this; }

    _footer: boolean = true;
    footer(value: boolean) { this._footer = value; return this; }

    _dense: boolean = false;
    dense(value: boolean) { this._dense = value; return this; }

    _bordered: boolean = false;
    bordered() { this._bordered = true; return this; }

    _actions: any = [];
    actions(action: Action) { this._actions.push(action); return this; }

    _draggable: boolean = true;
    draggable(value: boolean) { this._draggable = value; return this; }

    _pageSize: number = 20;
    pageSize(v: number) { this._pageSize = v; return this; }

    _selectableFormat: any;
    selectableFormat(v: any) {
        this._selectableFormat = v;
        return this;
    }

    _selectableOnChange: any;
    selectableOnChange(v: any) {
        this._selectableOnChange = v;
        return this;
    }

    _selectable: any;
    _selectableModel: any;
    selectable(v: string) {
        this._selectable = v;
        this._selectableModel = new Default().key(v);
        return this;
    }
}
