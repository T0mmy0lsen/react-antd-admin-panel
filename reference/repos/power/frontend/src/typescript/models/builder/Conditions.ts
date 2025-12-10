import Default from "./Default";

export default class Conditions extends Default {

    constructor() {
        super('Conditions');
    }

    add(v: any): this {
        v.key(this._fields.length + 1)
        return super.add(v);
    }

    _saveState: any;
    _restore: any = () => {};
    restore(v: any) {
        this._restore = v;
        return this;
    }

    // This removes all sections - no idea why anyone would do that.
    // Maybe to remove the condition functionality? To disable it?
    clear: () => void = () => {};

    // Get the current value used for the condition
    getValue: () => any = () => {};
    getKeys: () => any = () => {};

    // Push a new value to the condition and change the section accordingly
    checkCondition: (args?: any) => void = () => {};
}