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
var Slider = /** @class */ (function (_super) {
    __extends(Slider, _super);
    function Slider() {
        var _this = _super.call(this, 'Slider') || this;
        _this._min = 0;
        _this._max = 0;
        return _this;
    }
    Slider.prototype.min = function (min) { this._min = min; return this; };
    Slider.prototype.max = function (max) { this._max = max; return this; };
    Slider.prototype.marks = function (marks) { this._marks = marks; return this; };
    Slider.prototype.range = function (range) { this._range = range; return this; };
    Slider.prototype.labelFunction = function (labelFunction) { this._labelFunction = labelFunction; return this; };
    return Slider;
}(Default_1["default"]));
exports["default"] = Slider;
