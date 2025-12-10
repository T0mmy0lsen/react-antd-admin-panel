import Default from "./Default";

export default class Conditions extends Default {

    constructor() {
        super('Conditions');
    }

    // This removes all sections - no idea why anyone would do that.
    // Maybe to remove the condition functionality? To disable it?
    clear: () => void = () => {};

    // Get the current value used for the condition
    getValue: () => any = () => {};

    // Push a new value to the condition and change the section accordingly
    checkCondition: (args?: any) => void = () => {};
}