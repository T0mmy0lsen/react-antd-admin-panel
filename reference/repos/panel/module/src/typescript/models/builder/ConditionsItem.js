"use strict";
exports.__esModule = true;
var ConditionsItem = /** @class */ (function () {
    function ConditionsItem() {
        // Once next(Section) is called the Section will be drawn in the Conditions-component.
        this._content = true;
    }
    ConditionsItem.prototype.content = function (v) { this._content = v; return this; };
    ConditionsItem.prototype.condition = function (v) { this._condition = v; return this; };
    // Conditions.tsx will call this to get the item-object.
    ConditionsItem.prototype.getObject = function () {
        var _this = this;
        return {
            content: function (n) { return _this._content(n); }
        };
    };
    return ConditionsItem;
}());
exports["default"] = ConditionsItem;
