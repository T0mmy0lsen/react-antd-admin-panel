import Default from "./Default";

export default class Modal extends Default {

    _size: number = 640;
    _align: string = 'right';

    open: any = () => {};
    close: any = () => {};

    constructor() {
        super('Modal');
    }

    align(value: string) : Modal {
        this._align = value;
        return this;
    }
}