import Default from "./Default";

export default class Switch extends Default {

    constructor() {
        super('Switch');
    }

    _checkedChildren: any;
    toggleTrue(value: any) { this._checkedChildren = value; return this; }

    _unCheckedChildren: any;
    toggleFalse(value: any) { this._unCheckedChildren = value; return this; }
}