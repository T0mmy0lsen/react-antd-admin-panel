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
var Input = /** @class */ (function (_super) {
    __extends(Input, _super);
    function Input() {
        var _this = _super.call(this, 'Input') || this;
        _this._onPressEnter = false;
        _this._autofocus = false;
        return _this;
    }
    Input.prototype.suffix = function (v) {
        this._suffix = v;
        return this;
    };
    Input.prototype.onPressEnter = function (v) {
        this._onPressEnter = v !== null && v !== void 0 ? v : true;
        return this;
    };
    Input.prototype.autofocus = function (v) {
        this._autofocus = v !== null && v !== void 0 ? v : true;
        return this;
    };
    Input.prototype.clearSelf = function () {
        this._defaultObject = undefined;
        try {
            this.tsxClear();
            window.localStorage.removeItem("radio:".concat(this._key));
        }
        catch (e) {
            console.log(e);
        }
    };
    return Input;
}(Default_1["default"]));
exports["default"] = Input;
