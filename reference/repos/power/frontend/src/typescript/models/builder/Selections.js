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
var ItemValue_1 = require("./ItemValue");
var Selections = /** @class */ (function (_super) {
    __extends(Selections, _super);
    function Selections() {
        var _this = _super.call(this, 'Selections') || this;
        _this._color = function () { };
        return _this;
    }
    Selections.prototype.default = function (v) {
        if (!v)
            return this;
        return _super.prototype.default.call(this, v);
    };
    Selections.prototype.addMore = function (v) {
        return _super.prototype.addMore.call(this, v.map(function (v) {
            var _a;
            return new ItemValue_1.default(({
                id: v.id,
                value: v.id.toString(),
                description: v.value,
                color: (_a = v.fields.find(function (f) { return f.key === 'color'; })) === null || _a === void 0 ? void 0 : _a.value,
                source: v
            }));
        }));
    };
    Selections.prototype.color = function (v) { this._color = v; return this; };
    return Selections;
}(Default_1.default));
exports.default = Selections;
