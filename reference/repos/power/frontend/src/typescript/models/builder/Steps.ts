import Default from "./Default";
import StepsItem from "./StepsItem";

export default class Steps extends Default {

    constructor() {
        super('Steps');
    }

    clear: () => void = () => {};
    done: (v: number, b?: boolean) => void = () => {};
    goTo: (v: number) => void = () => {};
    next: () => void = () => {};
    prev: () => void = () => {};

    add(v: StepsItem): this {
        v._index = this._fields.length;
        return super.add(v);
    }

    addMore(v: any[]): this {
        v.forEach((item: StepsItem, index: number) => {
            item._index = this._fields.length + index;
        });
        return super.addMore(v);
    }
}