"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RadioItem = /** @class */ (function () {
    function RadioItem() {
    }
    RadioItem.prototype.key = function (v) { this._key = v; return this; };
    RadioItem.prototype.value = function (v) { this._value = v; return this; };
    RadioItem.prototype.label = function (v) { this._label = v; return this; };
    RadioItem.prototype.getObject = function () {
        return ({
            label: this._label,
            value: this._value,
        });
    };
    return RadioItem;
}());
exports.default = RadioItem;
