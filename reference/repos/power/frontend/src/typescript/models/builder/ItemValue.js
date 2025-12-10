"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ItemValue = /** @class */ (function () {
    function ItemValue(value) {
        var _a, _b, _c;
        this._id = (_a = value === null || value === void 0 ? void 0 : value.id) !== null && _a !== void 0 ? _a : 0;
        this._value = (_b = value === null || value === void 0 ? void 0 : value.value) !== null && _b !== void 0 ? _b : '';
        this._description = (_c = value === null || value === void 0 ? void 0 : value.description) !== null && _c !== void 0 ? _c : '';
        this._valueOption = value === null || value === void 0 ? void 0 : value.source;
        this._color = value === null || value === void 0 ? void 0 : value.color;
    }
    ItemValue.prototype.hasValue = function () { return this._id || this._value || this._description; };
    ItemValue.prototype.getId = function () { return this._id; };
    ItemValue.prototype.getValue = function () { return this._value; };
    ItemValue.prototype.getDescription = function () { return this._description; };
    ItemValue.prototype.getFormsValue = function () { if (this.getId())
        return this.getId(); };
    ItemValue.prototype.getValueOption = function () { return this._valueOption; };
    return ItemValue;
}());
exports.default = ItemValue;
