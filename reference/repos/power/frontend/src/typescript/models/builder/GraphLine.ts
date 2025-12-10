import Default from "./Default";

export default class GraphLine extends Default {

    _x: any;
    x(v: string) { this._x = v; return this; }

    _y: any;
    y(v: string) { this._y = v; return this; }

    constructor() {
        super('GraphLine');
    }
}