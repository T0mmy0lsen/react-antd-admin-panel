import Main from "../main";

export default class User {

    constructor(r: any) {
        if (!r) return;
        this.object(r);
        let ignore = Object.keys(this);
        Object.keys(r).forEach(k => {
            if (!ignore.includes(k) || k[0] === '_') {
                // @ts-ignore
                this[k] = r[k]
            }
        });
    }

    _object: any;
    object(v: any) { this._object = v; return this; }
}