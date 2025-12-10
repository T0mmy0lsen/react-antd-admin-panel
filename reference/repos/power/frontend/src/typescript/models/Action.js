"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Action = /** @class */ (function () {
    function Action() {
        this._type = 'submit';
        this._class = 'undefined';
        this._post = undefined;
        this._actions = []; // Space for any sub-actions, such as the drawer.
        this.callCallback = function () { return console.log('No action implemented'); }; // For the callback
        this._onError = function () { };
        this._onComplete = function () { };
        this._hideClear = false;
    }
    Action.prototype.click = function (args) {
        switch (this._type) {
            case 'submit':
                this._formula.submit(args, this);
                break;
            case 'callback':
                this.callCallback(args, this);
                // this.callCompletes(args);
                break;
            default:
                break;
        }
    };
    Action.prototype.hideClear = function () { this._hideClear = true; return this; };
    Action.prototype.callback = function (value) {
        this._type = 'callback';
        this.callCallback = value;
        return this;
    };
    Action.prototype.onError = function (func) {
        this._onError = func;
        return this;
    };
    Action.prototype.onComplete = function (func) {
        this._onComplete = func;
        return this;
    };
    Action.prototype.callErrors = function () {
        var _a;
        (_a = this._onError) === null || _a === void 0 ? void 0 : _a.call(this);
        /*
        Object.keys(this._onError).forEach((r: string) => {
            this._onError[r]();
        })
        */
    };
    Action.prototype.callCompletes = function (args) {
        var _a;
        (_a = this._onComplete) === null || _a === void 0 ? void 0 : _a.call(this, args);
        /*
        Object.keys(this._onComplete).forEach((r: string) => {
            this._onComplete[r]();
        })
        */
    };
    Action.prototype.key = function (value) {
        this._key = value;
        return this;
    };
    Action.prototype.post = function (value) {
        this._postKey = value;
        return this;
    };
    Action.prototype.icon = function (value) {
        this._icon = value;
        return this;
    };
    Action.prototype.label = function (value) {
        this._label = value;
        return this;
    };
    Action.prototype.type = function (value) {
        this._type = value;
        return this;
    };
    Action.prototype.bind = function (value) {
        this._bind = value;
        return this;
    };
    Action.prototype.route = function (value) {
        this._route = value;
        return this;
    };
    Action.prototype.action = function (value) {
        if (!this._actions.some(function (r) { return r._label === value._label; })) {
            this._actions.push(value);
        }
        return this;
    };
    Action.prototype.section = function (section) {
        this._section = section;
        return this;
    };
    Action.prototype.formula = function (formula) {
        this._formula = formula;
        return this;
    };
    Action.prototype.component = function (component) {
        this._component = component;
        return this;
    };
    Action.prototype.fontawesome = function (v) {
        this._fontawesome = v;
        return this;
    };
    Action.prototype.access = function (v) { this._access = v; return this; };
    Action.prototype.disabled = function (v) { this._disabled = v; return this; };
    return Action;
}());
exports.default = Action;
