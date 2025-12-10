"use strict";
exports.__esModule = true;
var Axios = /** @class */ (function () {
    function Axios() {
        this._data = undefined;
        this._error = undefined;
        this._success = undefined;
        this._onComplete = function () { };
        this._onError = function () { };
        this._onCatch = function () { };
        this._onInit = function () { };
        this._onThen = function () { };
        this._header = [];
    }
    Axios.prototype.onComplete = function (value) { this._onComplete = value; return this; };
    Axios.prototype.onError = function (value) { this._onError = value; return this; };
    Axios.prototype.onCatch = function (value) { this._onCatch = value; return this; };
    Axios.prototype.onInit = function (value) { this._onInit = value; return this; };
    Axios.prototype.onThen = function (value) { this._onThen = value; return this; };
    Axios.prototype.doIf = function (value) { this._doIf = value; return this; };
    Axios.prototype.fail = function (v) { this._fail = v; return this; };
    Axios.prototype.alter = function (v) { this._alter = v; return this; };
    Axios.prototype.header = function (v) { this._header = v; return this; };
    Axios.prototype.target = function (value, targetFunction) {
        this._target = value;
        this._targetFunction = targetFunction !== null && targetFunction !== void 0 ? targetFunction : typeof value !== 'string';
        return this;
    };
    Axios.prototype.targetBuild = function (args) {
        if (this._targetFunction)
            return this._target(args);
        return this._target;
    };
    return Axios;
}());
exports["default"] = Axios;
