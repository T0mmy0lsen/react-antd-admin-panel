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
var DatePickerToggle = /** @class */ (function (_super) {
    __extends(DatePickerToggle, _super);
    function DatePickerToggle() {
        var _this = _super.call(this, 'DatePickerToggle') || this;
        _this._picker = 'week';
        return _this;
    }
    DatePickerToggle.prototype.picker = function (v) { this._picker = v; };
    ;
    return DatePickerToggle;
}(Default_1.default));
exports.default = DatePickerToggle;
