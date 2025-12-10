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
var Select = /** @class */ (function (_super) {
    __extends(Select, _super);
    function Select() {
        var _this = _super.call(this, 'Select') || this;
        _this._format = function (v) { return v.value; };
        return _this;
    }
    Select.prototype.options = function (v) { this._options = v; return this; };
    Select.prototype.dataSource = function (v) {
        this._dataSource = v;
        this._fields = this._options(v);
        return this;
    };
    Select.prototype.clearSelf = function () {
        this._defaultObject = undefined;
        try {
            this.tsxClear();
            window.localStorage.removeItem("radio:".concat(this._key));
        }
        catch (e) {
            console.log(e);
        }
    };
    Select.prototype.defaultFromCache = function () {
        var store = window.localStorage.getItem("select:".concat(this._key));
        this._defaultObject = store ? JSON.parse(store) : this._defaultObject;
        return this;
    };
    return Select;
}(Default_1["default"]));
exports["default"] = Select;
