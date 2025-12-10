export default class Axios {

    _data: any = undefined;
    _error: any = undefined;
    _success: any = undefined;

    _target: any;
    _targetFunction: any;

    _onComplete: any = () => {};
    onComplete(value: any) { this._onComplete = value; return this; }

    _onError: any = () => {};
    onError(value: any) { this._onError = value; return this; }

    _onCatch: any = () => {};
    onCatch(value: any) { this._onCatch = value; return this; }

    _onInit: any = () => {};
    onInit(value: any) { this._onInit = value; return this; }

    _onThen: any = () => {};
    onThen(value: any) { this._onThen = value; return this; }

    _doIf: any;
    doIf(value: any) {this._doIf = value; return this; }

    _fail: any;
    fail(v: any) { this._fail = v; return this; }

    _alter: any;
    alter(v: (data: any, args?: any) => any) { this._alter = v; return this; }

    _header: any = [];
    header(v: any) { this._header = v; return this; }

    target(value: any, targetFunction?: boolean) {
        this._target = value;
        this._targetFunction = targetFunction ?? typeof value !== 'string';
        return this;
    }

    targetBuild(args?: any) {
        if (this._targetFunction) return this._target(args);
        return this._target;
    }

    constructor() {

    }
}