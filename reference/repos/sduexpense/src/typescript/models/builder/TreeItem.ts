import DefaultItem from "./DefaultItem";

export default class TreeItem extends DefaultItem {

    constructor(r?: any, merge?: boolean) {
        super(r, merge);
    }

    leaf(v?: boolean) { this.isLeaf = v ? v : !v; return this; }

    _show: boolean = true;
    show(v: boolean) { this._show = v; return this; }

    _disabled: boolean = false;
    disabled(v: boolean) { this._disabled = v; return this; }

    _canBeLoaded: boolean = true;
    canBeLoaded(v: boolean) { this._canBeLoaded = v; return this; }

    _canBeEdited: boolean = true;
    canBeEdited(v: boolean) { this._canBeEdited = v; return this; }

    _label: any;
    label(v: string) { this._label = v; return this; }

    _id: any;
    id(v: any) { this._id = v; return this.index(v); }
    index(v: any) { this.key = v; return this; }

    key: string | number = 0;
    title: any;
    isLeaf: boolean = false;
    children: TreeItem[] = [];
}