import Default from "./Default";

export default class Title extends Default {

    constructor() {
        super('Title')
    }

    _id: any;
    id(id: string) { this._id = id; return this; }

    _level: 1 | 2 | 3 | 4 | 5 | undefined = 1;
    level(level: 1 | 2 | 3 | 4 | 5 | undefined) {this._level = level; return this; }

    _step: boolean = false;
    step() { this._step = true; return this; }

    _stepDefault: boolean = false;
    stepDefault(v: boolean) { this._step = v; return this; }
}