import Default from "./Default";

export default class Multiple extends Default {

    env: any;

    constructor() {
        super('Multiple')
        this.env = JSON.parse(window.localStorage.getItem('env') ?? '{}');
    }

    _headers: any;
    headers(v: any) { this._headers = v; return this; }

    _headerHide: any = [];
    headerHide(v: any) { this._headerHide = v; return this; }

    _orderable: boolean = true;
    orderable(v: boolean) { this._orderable = v; return this; }
}