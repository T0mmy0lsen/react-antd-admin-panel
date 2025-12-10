import {Action} from "../index";
import Main from "../main";

export default class Access {

    style: any = {};
    access: { access: boolean, hidden: boolean } = ({ access: true, hidden: false });
    disabled = false;

    _main: Main;

    constructor(main: Main) {
        this._main = main;
    }

    _render: any;
    render(v: any) { this._render = v; return this; }

    simple(v: any, args?: any)
    {
        if (v._access === undefined) return false;
        if (typeof v._disabled === 'function') return (v._disabled?.(args) || !this._main.$access(v._access).access)
        return (v._disabled || !this._main.$access(v._access).access)
    }

    action(v: Action, args?: any)
    {
        if (v._access === undefined) return this;

        if (this._main)
        {
            this.access = this._main.$access(v._access);

            this.disabled = !this.access.access;

            if (!this.access.access && !this.access.hidden) {
                this.style = { opacity: .25 }
            }

            if (!this.access.access && this.access.hidden) {
                this.style = { opacity: 0 }
            }
        }

        if (v._disabled?.(args))
        {
            this.disabled = true;
            this.access.access = false;
            this.style = { ...this.style, ...{ opacity: .25 } };
        }

        return this;
    }

    configs(v: any)
    {
        let keys = Object.keys(v);
        keys.forEach((r: string) => {
            switch (true) {
                case (r === 'onClick' && !this.access.access):
                    this['onClick'] = (e: any) => e.stopPropagation();
                    break;
                default:
                    this[r] = v[r];
            }
        });

        return this._render(this.getObject());
    }

    getObject() {
        return ({
            style: this.style,
            disabled: this.disabled,
            onClick: this['onClick'] ?? (() => {}),
        })
    }
}