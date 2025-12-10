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
var Autocomplete = /** @class */ (function (_super) {
    __extends(Autocomplete, _super);
    function Autocomplete() {
        var _this = _super.call(this, 'Autocomplete') || this;
        _this._format = function (v) { var _a, _b; return (_b = (_a = v.object) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : console.log('Autocomplete: you should implement a format function.'); };
        return _this;
    }
    Autocomplete.prototype.clearSelf = function () {
        this._defaultObject = undefined;
        try {
            this.tsxClear();
            window.localStorage.removeItem("autocomplete:".concat(this._key));
        }
        catch (e) {
            console.log(e);
        }
    };
    Autocomplete.prototype.defaultFromCache = function () {
        try {
            var store = window.localStorage.getItem("autocomplete:".concat(this._key));
            this._defaultObject = store ? JSON.parse(store) : this._defaultObject;
        }
        catch (e) {
            console.log(e);
        }
        return this;
    };
    return Autocomplete;
}(Default_1["default"]));
exports["default"] = Autocomplete;
