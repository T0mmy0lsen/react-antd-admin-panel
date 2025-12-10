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
var Conditions = /** @class */ (function (_super) {
    __extends(Conditions, _super);
    function Conditions() {
        var _this = _super.call(this, 'Conditions') || this;
        _this._restore = function () { };
        // This removes all sections - no idea why anyone would do that.
        // Maybe to remove the condition functionality? To disable it?
        _this.clear = function () { };
        // Get the current value used for the condition
        _this.getValue = function () { };
        _this.getKeys = function () { };
        // Push a new value to the condition and change the section accordingly
        _this.checkCondition = function () { };
        return _this;
    }
    Conditions.prototype.add = function (v) {
        v.key(this._fields.length + 1);
        return _super.prototype.add.call(this, v);
    };
    Conditions.prototype.restore = function (v) {
        this._restore = v;
        return this;
    };
    return Conditions;
}(Default_1.default));
exports.default = Conditions;
