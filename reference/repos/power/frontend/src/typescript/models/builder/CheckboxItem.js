"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CheckboxItem = /** @class */ (function () {
    function CheckboxItem() {
    }
    CheckboxItem.prototype.key = function (v) { this._key = v; return this; };
    CheckboxItem.prototype.value = function (v) { this._value = v; return this; };
    CheckboxItem.prototype.label = function (v) { this._label = v; return this; };
    CheckboxItem.prototype.getObject = function () {
        return ({
            label: this._label,
            value: this._value,
        });
    };
    return CheckboxItem;
}());
exports.default = CheckboxItem;
