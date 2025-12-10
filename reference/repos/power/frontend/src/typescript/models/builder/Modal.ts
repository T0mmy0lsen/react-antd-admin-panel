import Default from "./Default";

export default class Modal extends Default {

    _size: number = 640;
    _align: string = 'right';
    _mask: boolean = true;
    _maskClosable: boolean = true;

    open: any = () => {};
    close: any = () => {};

    constructor() {
        super('Modal');
    }

    align(value: string) : Modal {
        this._align = value;
        return this;
    }

    maskDisabled(value: boolean = false) : Modal {
        this._mask = value;
        return this;
    }

    maskClosableDisabled(value: boolean = false) : Modal {
        this._maskClosable = value;
        return this;
    }
}