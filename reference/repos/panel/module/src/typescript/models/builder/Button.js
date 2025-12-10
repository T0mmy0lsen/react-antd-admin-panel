"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Default_1 = require("./Default");
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button() {
        var _this = this;
        var _a;
        _this = _super.call(this, 'Button') || this;
        _this._trigger = false;
        _this.setLoading = function () { };
        _this.tsxSetType = function () { };
        _this.tsxSetStyle = function () { };
        _this._loadable = false;
        _this._link = false;
        _this._danger = false;
        _this._block = false;
        _this._ignoreClear = false;
        _this._primary = false;
        _this._menu = false;
        _this.env = JSON.parse((_a = window.localStorage.getItem('env')) !== null && _a !== void 0 ? _a : '{}');
        _this.middle();
        return _this;
    }
    Button.prototype.trigger = function () { this._trigger = true; return this; };
    Button.prototype.round = function () { this.shape('round'); return this; };
    Button.prototype.small = function () { this.sizeString('small'); return this; };
    Button.prototype.middle = function () { this.sizeString('middle'); return this; };
    Button.prototype.loadable = function (v) { this._loadable = v; return this; };
    Button.prototype.icon = function (v) { this._icon = v; return this; };
    Button.prototype.fontawesome = function (v) { this._fontawesome = v; return this; };
    Button.prototype.shape = function (value) { this._shape = value; return this; };
    Button.prototype.link = function (value) { this._link = (!value) ? true : value; return this; };
    Button.prototype.danger = function (value) { this._danger = (!value) ? true : value; return this; };
    Button.prototype.block = function (value) { this._block = (!value) ? true : value; return this; };
    Button.prototype.ignoreClear = function (value) {
        this._ignoreClear = (!value) ? true : value;
        return this;
    };
    Button.prototype.primary = function (value) {
        this._primary = (!value) ? true : value;
        return this;
    };
    Button.prototype.menu = function (value) {
        this._menu = (!value) ? true : value;
        return this;
    };
    return Button;
}(Default_1["default"]));
exports["default"] = Button;
