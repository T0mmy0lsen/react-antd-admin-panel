"use strict";
exports.__esModule = true;
var Value = /** @class */ (function () {
    function Value() {
    }
    Value.prototype.get = function () { return this._model._format(this._value); };
    Value.prototype.set = function (value) { this._value = value; return this; };
    Value.prototype.model = function (value) { this._model = value; return this; };
    return Value;
}());
exports["default"] = Value;
