"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Cycle = /** @class */ (function () {
    function Cycle(main, route, next, failed) {
        this._states = {
            get: [],
        };
        this._main = main;
        this._next = next;
        this._failed = failed;
        var path = this._main.$map.$path(route);
        this._key = path._actualPath;
        this._path = path;
        this._route = path._route;
    }
    Cycle.prototype.$access = function (access) {
        return this._main.$access(access, this);
    };
    Cycle.prototype.handle = function () {
        if (!this._route) {
            console.log('Not a valid page.', this);
            this._main.Controller.onCycleFailed(this);
        }
        if (this._main.Controller.isDebug()) {
            this.get();
            return;
        }
        var access = typeof this._route._access === 'function' ? this._route._access(this) : this._route._access;
        access = this.$access(access);
        if (!access.access) {
            this._main.Controller.onCycleFailed(this);
        }
        else {
            this.get();
        }
    };
    Cycle.prototype.get = function () {
        var _this = this;
        if (this._route._gets.length === 0)
            this._main.Controller.onCycleComplete(this);
        this._route._gets.forEach(function () { return _this._states.get.push(false); });
        this._route._gets.forEach(function (r, i) {
            r.onComplete(function () { return _this.getCompleted(i); });
            r.onError(function () { return _this.getFailed(i); });
            r.get(_this);
        });
    };
    Cycle.prototype.getCompleted = function (i) {
        // Calls nextPhase if current phase is completed.
        this._states.get[i] = true;
        if (this._states.get.every(function (r) { return r === true; }))
            this._main.Controller.onCycleComplete(this);
    };
    Cycle.prototype.getFailed = function (i) {
        // Calls nextPhase if current phase is completed.
        this._states.get[i] = undefined;
        if (this._states.get.every(function (r) { return r === true || r === undefined; }))
            this._main.Controller.onCycleFailed(this);
    };
    Cycle.prototype.params = function (key) {
        return this._path._params[key];
    };
    return Cycle;
}());
exports.default = Cycle;
