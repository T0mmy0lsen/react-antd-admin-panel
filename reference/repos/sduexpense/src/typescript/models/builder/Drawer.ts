import Default from "./Default";

export default class Drawer extends Default {

    _align: string = 'right';
    _size: number = 640;

    close: any = () => {};
    open: any = () => {};

    constructor() {
        super('Drawer');
    }

    align(value: string) : Drawer {
        this._align = value;
        return this;
    }
}