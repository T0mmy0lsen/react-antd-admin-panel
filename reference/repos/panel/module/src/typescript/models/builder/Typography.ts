import Default from "./Default";

export default class Typography extends Default {

    constructor() {
        super('Typography');
    }

    _strong: boolean = false;
    strong() { this._strong = true; return this; }

    _copyable: any;
    copyable() { this._copyable = true; return this; }
}