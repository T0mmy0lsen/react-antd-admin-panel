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
var helpers_1 = require("../../../helpers");
var Selection = /** @class */ (function (_super) {
    __extends(Selection, _super);
    function Selection() {
        var _this = _super.call(this, 'Selection') || this;
        _this._format = function (v) {
            return v.getId();
        };
        _this._color = function () { };
        _this._value.getFormsValue = function () { return parseInt(_this._value.getValue()); };
        return _this;
    }
    Selection.prototype.default = function (v) {
        var _a, _b, _c, _d, _e, _f;
        if (!v)
            return this;
        this.setObject(new ItemValue_1.default({
            id: (_b = (_a = v.value_option) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : v.value_boolean.id,
            value: (_d = (_c = v.value_option) === null || _c === void 0 ? void 0 : _c.id.toString()) !== null && _d !== void 0 ? _d : v.value_boolean.id.toString(),
            description: (_f = (_e = v.value_option) === null || _e === void 0 ? void 0 : _e.value) !== null && _f !== void 0 ? _f : v.value_boolean.value
        }));
        return _super.prototype.default.call(this, v);
    };
    Selection.prototype.addMore = function (v) {
        return _super.prototype.addMore.call(this, v.map(function (v) {
            var _a;
            return new ItemValue_1.default(({
                id: v.id,
                value: v.id.toString(),
                description: v.value,
                color: (_a = (0, helpers_1.findByKey)(v.fields, 'color')) === null || _a === void 0 ? void 0 : _a.value,
                source: v
            }));
        }));
    };
    Selection.prototype.clearSelf = function () {
        this._defaultObject = undefined;
        try {
            this.tsxClear();
            window.localStorage.removeItem("selection:".concat(this._key));
        }
        catch (e) {
            console.log(e);
        }
    };
    Selection.prototype.defaultFromCache = function () {
        var store = window.localStorage.getItem("selection:".concat(this._key));
        this._defaultObject = store ? JSON.parse(store) : this._defaultObject;
        return this;
    };
    Selection.prototype.color = function (v) { this._color = v; return this; };
    return Selection;
}(Default_1.default));
exports.default = Selection;
