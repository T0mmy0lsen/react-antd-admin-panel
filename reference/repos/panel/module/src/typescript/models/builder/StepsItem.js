"use strict";
exports.__esModule = true;
var StepsItem = /** @class */ (function () {
    function StepsItem() {
        this._done = true;
        this._title = '';
        // Once next(Section) is called the Section will be drawn in the Steps-component.
        this._content = true;
    }
    StepsItem.prototype.done = function (v) { this._done = v; return this; };
    StepsItem.prototype.title = function (v) { this._title = v; return this; };
    StepsItem.prototype.content = function (v) { this._content = v; return this; };
    // Steps.tsx will call this to get the item-object.
    StepsItem.prototype.getObject = function () {
        var _this = this;
        return {
            done: this._done,
            title: this._title,
            content: function (n) { return _this._content(n); }
        };
    };
    return StepsItem;
}());
exports["default"] = StepsItem;
