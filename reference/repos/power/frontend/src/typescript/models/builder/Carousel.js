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
var Carousel = /** @class */ (function (_super) {
    __extends(Carousel, _super);
    function Carousel() {
        var _this = _super.call(this, 'Carousel') || this;
        _this._labels = [];
        _this._getIcon = function () { };
        _this._getName = function () { };
        _this._getDescription = function () { };
        _this.tsxGoNext = function () { };
        _this.tsxGoPrev = function () { };
        return _this;
    }
    Carousel.prototype.getDescriptionText = function (v) {
        this._getDescription = v;
        return this;
    };
    Carousel.prototype.getNameText = function (v) {
        this._getName = v;
        return this;
    };
    Carousel.prototype.getIconText = function (v) {
        this._getIcon = v;
        return this;
    };
    Carousel.prototype.addLabel = function (v) {
        this._labels.push(v);
        return this;
    };
    return Carousel;
}(Default_1.default));
exports.default = Carousel;
