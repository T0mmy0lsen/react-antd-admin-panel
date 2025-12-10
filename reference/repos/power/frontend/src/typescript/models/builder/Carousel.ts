import Default from "./Default";
import Item from "./Item";

export default class Carousel extends Default {

    _labels: ((item: Item) => string)[] = [];
    _getIcon: (item: Item) => any = () => {};
    _getName: (item: Item) => any = () => {};
    _getDescription: (item: Item) => any = () => {};

    constructor() {
        super('Carousel');
    }

    getDescriptionText(v: any) {
        this._getDescription = v;
        return this;
    }

    getNameText(v: any) {
        this._getName = v;
        return this;
    }

    getIconText(v: any) {
        this._getIcon = v;
        return this;
    }

    addLabel(v: (item: Item) => string): this {
        this._labels.push(v);
        return this
    }

    tsxGoNext: () => void = () => {};
    tsxGoPrev: () => void = () => {};
}