import {ReactNode} from "react";
import {Default} from "../../index";

type TypeStatus = 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500';

// https://ant.design/components/result/#API
export default class Result extends Default {

    constructor() {
        super('Result');
    }

    natives: string[] = ['extra', 'icon', 'status', 'subTitle', 'title'];

    // Operating area
    _extra: ReactNode;
    extra(v: ReactNode) { this._extra = v; return this; }

    // Custom back icon
    _icon: ReactNode;
    icon(v: ReactNode) { this._icon = v; return this; }

    // 	Result status, decide icons and colors
    _status: any;
    status(v: TypeStatus) { this._status = v; return this; }

    // The subTitle
    _subTitle: ReactNode;
    subTitle(v: ReactNode) { this._subTitle = v; return this; }

    // The title
    _title: ReactNode;
    title(v: ReactNode) { this._title = v; return this; }
}