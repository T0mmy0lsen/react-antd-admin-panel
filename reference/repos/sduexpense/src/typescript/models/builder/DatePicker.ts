import Default from "./Default";

export default class DatePicker extends Default {

    constructor() {
        super('DatePicker');
    }

    _picker: any;
    picker(v: 'week' | 'month' | 'quarter' | 'year') { this._picker = v; return this; }

    _returnStartOfWeek: any = false;
    returnStartOfWeek() { this._returnStartOfWeek = true; return this; }

    _returnEndOfWeek: any = false;
    returnEndOfWeek() { this._returnEndOfWeek = true; return this; }
}