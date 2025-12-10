import Default from "./Default";

export default class Steps extends Default {

    _backText?: string = 'Back';
    _nextText?: string = 'Next';

    constructor() {
        super('Steps');
    }

    getCurrentStep: () => void = () => {};
    clear: () => void = () => {};
    done: (v: number, b?: boolean) => void = (v: number, b?: boolean) => {
        console.log('Steps: calling done(), but not implemented before the component is set.');
        if (this._fields) {
            this._fields.map((r: any, index: number) => {
                if (index === v - 1) r._done = b !== undefined ? b : !r._done;
                return r;
            })
        }
    };
    goTo: (v: number) => void = () => {};
    next: () => void = () => {};
    prev: () => void = () => {};
    stepsTsx: () => void = () => {};
    tsxStepsButtonDisable: (v: boolean) => void = () => {};
}