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
var Space = /** @class */ (function (_super) {
    __extends(Space, _super);
    function Space() {
        var _this = _super.call(this, 'Space') || this;
        _this._border = 0;
        _this._bottom = 0;
        _this._right = 0;
        _this._left = 0;
        _this._top = 0;
        return _this;
    }
    Space.prototype.top = function (value) {
        this._top = value;
        return this;
    };
    Space.prototype.left = function (value) {
        this._left = value;
        return this;
    };
    Space.prototype.right = function (value) {
        this._right = value;
        return this;
    };
    Space.prototype.bottom = function (value) {
        this._bottom = value;
        return this;
    };
    Space.prototype.border = function () {
        this._border = 1;
        return this;
    };
    return Space;
}(Default_1.default));
exports.default = Space;
