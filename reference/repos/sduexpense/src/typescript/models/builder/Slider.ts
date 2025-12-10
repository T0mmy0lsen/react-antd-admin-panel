import Default from "./Default";

export default class Slider extends Default {

    constructor() {
        super('Slider');
    }

    _min: number = 0;
    min(min: number) { this._min = min; return this; }

    _max: number = 0;
    max(max: number) { this._max = max; return this; }

    _marks: any;
    marks(marks: any) { this._marks = marks; return this; }

    _range: any;
    range(range: number[]) { this._range = range; return this; }

    _labelFunction: any;
    labelFunction(labelFunction: any) { this._labelFunction = labelFunction; return this; }
}