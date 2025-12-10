import {Get, Section} from "../../../typescript";

export default class DefaultItem {

    setLoading: any = () => {};
    key: any;

    fetch() {
        this._get.get(this);
    }

    onThen(v: any) {
        if (this._get) this._get.onThen(v)
    }

    onCatch(v: any) {
        if (this._get) this._get.onCatch(v)
    }

    constructor(r: any, merge: boolean = true)
    {
        if (!r) return;
        this.object(r);
        let ignore = Object.keys(this);
        if (merge) Object.keys(r).forEach(k => {
            if (!ignore.includes(k) || k[0] === '_' || ['index', 'key'].includes(k)) {
                // @ts-ignore
                this[k] = r[k]
            } else {
                // console.log(`Ignores key ${k} since this will overwrite a ListItem variable.`)
            }
        });
    }

    _get: any | Get;
    get(v: Get) { this._get = v; return this; }

    _parent: any;
    parent(v: any) { this._parent = v; return this; }

    _object: any;
    object(v: any) { this._object = v; return this; }

    _objects: any = {};
    objects(v: any) { this._objects = v; return this; }

    _render: any;
    render(v: any) { this._render = v; return this; }

    _section: any | Section;
    section(v: Section) { this._section = v; return this; }

    _editable: boolean = false;
    editable(v?: boolean) { this._editable = v ? v : !v; return this; }

    _autoFocus: boolean = false;
    autoFocus(v?: boolean) { this._autoFocus = v ? v : !v; return this; }

    _placeholder: string = '';
    placeholder(v: string) { this._placeholder = v; return this; }

}