import Main from "../main";

import Get from "./Get";
import Path from "./Path";
import Route from "./Route";

export default class Cycle {

    _key: any;
    _next: any;
    _failed: any;
    _main: Main;
    _path: Path;
    _route: Route;

    _states: any = {
        get: [],
    }

    constructor(main: Main, route: string, next: any, failed: any) {

        this._main = main;
        this._next = next;
        this._failed = failed;

        let path: Path = this._main.$map.$path(route);

        this._key = path._actualPath;
        this._path = path;
        this._route = path._route;
    }

    $access(access: any) {
        return this._main.$access(access, this);
    }

    handle()
    {
        if (!this._route) {
            console.log('Not a valid page.', this);
            this._main.Controller.onCycleFailed(this);
        }

        if (this._main.Controller.isDebug()) {
            this.get();
            return;
        }

        let access: any = typeof this._route._access === 'function' ? this._route._access(this) : this._route._access;
        access = this.$access(access);

        if (!access.access) {
            this._main.Controller.onCycleFailed(this);
        } else {
            this.get();
        }
    }

    get() {
        if (this._route._gets.length === 0) this._main.Controller.onCycleComplete(this);
        this._route._gets.forEach(() => this._states.get.push(false))
        this._route._gets.forEach((r: Get, i: number) => {
            r.onComplete(() => this.getCompleted(i));
            r.onError(() => this.getFailed(i));
            r.get(this)
        })
    }

    getCompleted(i: number) {
        // Calls nextPhase if current phase is completed.
        this._states.get[i] = true;
        if (this._states.get.every((r: any) => r === true)) this._main.Controller.onCycleComplete(this);
    }

    getFailed(i: number) {
        // Calls nextPhase if current phase is completed.
        this._states.get[i] = undefined;
        if (this._states.get.every((r: any) => r === true || r === undefined)) this._main.Controller.onCycleFailed(this);
    }

    params(key: string) {
        return this._path._params[key];
    }
}