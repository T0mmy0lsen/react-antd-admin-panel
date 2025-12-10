import {Dictionary} from "../utils/Dictionary";

import Main from "../main";
import Post from "./Post";
import Formula from "./Formula";
import Section from "./builder/Section";

export default class Action {

    _icon: any;
    _fontawesome: any;
    _label: any;
    _type: string = 'submit';
    _class: string = 'undefined';

    _post: Post | undefined = undefined;
    _postKey: any;

    _key: any;                  // Can be used for any purpose.
    _bind: any;                 // If type is submit, we tell it what to submit, if none is given use the default section bind.
    _route: any;                // For submit it would be the POST url, or a route when calling the route.
    _actions: Action[] = [];    // Space for any sub-actions, such as the drawer.
    _section: any;              // The parent section. Critical for fields and submits.
    _formula: any;              // The formula section. Critical for fields and submits.
    _component: any;
    _componentData: any;        // Any data we want to place on the action before calling click.

    callCallback: (args?: any, action?: any) => void | any = () => console.log('No action implemented'); // For the callback

    _onError: any = () => {};
    _onComplete: any = () => {};

    constructor() {

    }

    click(args?: any) {
        switch (this._type) {
            case 'submit':
                this._formula.submit(args, this)
                break;
            case 'callback':
                this.callCallback(args, this);
                // this.callCompletes(args);
                break;
            default:
                break;
        }
    }

    _hideClear: boolean = false;
    hideClear() { this._hideClear = true; return this; }

    callback(value: any) {
        this._type = 'callback';
        this.callCallback = value;
        return this;
    }

    onError(func: any) {
        this._onError = func;
        return this;
    }

    onComplete(func: any) {
        this._onComplete = func;
        return this;
    }

    callErrors() {
        this._onError?.();
        /*
        Object.keys(this._onError).forEach((r: string) => {
            this._onError[r]();
        })
        */
    }

    callCompletes(args?: any) {
        this._onComplete?.(args);
        /*
        Object.keys(this._onComplete).forEach((r: string) => {
            this._onComplete[r]();
        })
        */
    }

    key(value: string) {
        this._key = value;
        return this;
    }

    post(value: string) {
        this._postKey = value;
        return this;
    }

    icon(value: any) {
        this._icon = value;
        return this;
    }

    label(value: string) {
        this._label = value;
        return this;
    }

    type(value: string) {
        this._type = value;
        return this;
    }

    bind(value: string) {
        this._bind = value;
        return this;
    }

    route(value: any) {
        this._route = value;
        return this;
    }

    action(value: Action) {
        if (!this._actions.some((r: Action) => r._label === value._label)) {
            this._actions.push(value);
        }
        return this;
    }

    section(section: Section) {
        this._section = section;
        return this;
    }

    formula(formula: Formula) {
        this._formula = formula;
        return this;
    }

    component(component: any) {
        this._component = component;
        return this;
    }

    fontawesome(v: any) {
        this._fontawesome = v;
        return this;
    }

    _access: any;
    access(v: any) { this._access = v; return this; }

    _disabled: any;
    disabled(v: any) { this._disabled = v; return this; }
}