import Default from "./Default";

export default class Button extends Default {

    env: any;

    constructor() {
        super('Button')
        this.env = JSON.parse(window.localStorage.getItem('env') ?? '{}');
        this.middle();
    }

    _trigger: boolean = false;
    trigger() { this._trigger = true; return this; }

    setLoading: any = () => {};
    tsxSetType: any = () => {};
    tsxSetStyle: any = () => {};

    round() { this.shape('round'); return this; }
    small() { this.sizeString('small'); return this; }
    middle() { this.sizeString('middle'); return this; }

    _loadable: boolean = false;
    loadable(v: boolean) { this._loadable = v; return this; }

    _icon: any;
    icon(v: any) { this._icon = v; return this; }

    _fontawesome: any;
    fontawesome(v: any) { this._fontawesome = v; return this; }

    _shape: any;
    shape(value: string) { this._shape = value; return this; }

    _link: boolean = false;
    link(value?: boolean) { this._link = (!value) ? true : value; return this; }

    _danger: boolean = false;
    danger(value?: boolean) {this._danger = (!value) ? true : value; return this; }

    _block: boolean = false;
    block(value?: boolean) {this._block = (!value) ? true : value; return this; }

    _ignoreClear: boolean = false;
    ignoreClear(value?: boolean) {
        this._ignoreClear = (!value) ? true : value;
        return this;
    }

    _primary: boolean = false;
    primary(value?: boolean) {
        this._primary = (!value) ? true : value;
        return this;
    }

    _menu: boolean = false;
    menu(value?: boolean) {
        this._menu = (!value) ? true : value;
        return this;
    }
}