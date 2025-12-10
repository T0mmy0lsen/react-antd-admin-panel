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
Object.defineProperty(exports, "__esModule", { value: true });
var Default_1 = require("./Default");
var Multiple = /** @class */ (function (_super) {
    __extends(Multiple, _super);
    function Multiple() {
        var _a;
        var _this = _super.call(this, 'Multiple') || this;
        _this._headerHide = [];
        _this._orderable = true;
        _this.env = JSON.parse((_a = window.localStorage.getItem('env')) !== null && _a !== void 0 ? _a : '{}');
        return _this;
    }
    Multiple.prototype.headers = function (v) { this._headers = v; return this; };
    Multiple.prototype.headerHide = function (v) { this._headerHide = v; return this; };
    Multiple.prototype.orderable = function (v) { this._orderable = v; return this; };
    return Multiple;
}(Default_1.default));
exports.default = Multiple;
