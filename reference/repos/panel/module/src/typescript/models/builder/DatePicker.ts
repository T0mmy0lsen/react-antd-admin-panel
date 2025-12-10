import Default from "./Default";

export default class DatePicker extends Default {

    constructor() {
        super('DatePicker');
    }

    _picker: any;
    picker(v: 'week' | 'month' | 'quarter' | 'year') { this._picker = v; return this; }
}