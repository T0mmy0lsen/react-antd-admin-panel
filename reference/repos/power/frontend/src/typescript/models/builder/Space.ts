import Default from "./Default";

export default class Space extends Default {

    _border: number = 0;
    _bottom: number = 0;
    _right: number = 0;
    _left: number = 0;
    _top: number = 0;

    constructor() {
        super('Space')
    }

    top(value: number): Space {
        this._top = value;
        return this;
    }

    left(value: number): Space {
        this._left = value;
        return this;
    }

    right(value: number): Space {
        this._right = value;
        return this;
    }

    bottom(value: number): Space {
        this._bottom = value;
        return this;
    }

    border() {
        this._border = 1;
        return this;
    }
}