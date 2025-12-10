import Default from "./Default";

export default class Row extends Default {

    _align: string = 'start';

    constructor() {
        super('Row');
    }

    align(value: string) : Row {
        this._align = value;
        return this;
    }
}