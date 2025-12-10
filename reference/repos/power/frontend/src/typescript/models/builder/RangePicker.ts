import Default from "./Default";

export default class RangePicker extends Default {

    _picker: any = 'date';
    picker(v: string) { this._picker = v };

    constructor() {
        super('RangePicker');
    }
}