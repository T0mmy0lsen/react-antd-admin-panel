import Default from "./Default";

export default class Mapbox extends Default {

    constructor() {
        super('Mapbox');
    }

    _height: any;
    height(v: any) {this._height = v; return this; }
}