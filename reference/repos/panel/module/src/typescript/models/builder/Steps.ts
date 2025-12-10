import Default from "./Default";

export default class Steps extends Default {

    constructor() {
        super('Steps');
    }

    clear: () => void = () => {};
    done: (v: number, b?: boolean) => void = () => {};
    goTo: (v: number) => void = () => {};
    next: () => void = () => {};
    prev: () => void = () => {};
}