import Default from "./Default";

export default class DatePickerToggle extends Default {

    _picker: any = 'week';
    picker(v: string) { this._picker = v };

    constructor() {
        super('DatePickerToggle');
    }
}