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
var Select = /** @class */ (function (_super) {
    __extends(Select, _super);
    function Select() {
        var _this = _super.call(this, 'Select') || this;
        _this._format = function (v) {
            return v.getId();
        };
        return _this;
    }
    Select.prototype.default = function (v) {
        var _a, _b, _c, _d, _e, _f;
        if (!v)
            return this;
        this.setObject(new ItemValue_1.default({
            id: (_b = (_a = v.value_option) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : v.value_boolean.id,
            value: (_d = (_c = v.value_option) === null || _c === void 0 ? void 0 : _c.id.toString()) !== null && _d !== void 0 ? _d : v.value_boolean.id.toString(),
            description: (_f = (_e = v.value_option) === null || _e === void 0 ? void 0 : _e.value) !== null && _f !== void 0 ? _f : v.value_boolean.value,
            source: v
        }));
        return _super.prototype.default.call(this, v);
    };
    Select.prototype.addMoreOriginal = function (v) {
        if (!v)
            return this;
        this._fieldsOriginal = v.map(function (v) { return new ItemValue_1.default(({
            id: v.id,
            value: v.id.toString(),
            description: v.value,
            source: v
        })); });
        return this;
    };
    Select.prototype.addMore = function (v) {
        if (!v)
            return this;
        return _super.prototype.addMore.call(this, v.map(function (v) { return new ItemValue_1.default(({
            id: v.id,
            value: v.id.toString(),
            description: v.value,
            source: v
        })); }));
    };
    Select.prototype.clearSelf = function () {
        this._defaultObject = undefined;
        try {
            this.tsxClear();
            window.localStorage.removeItem("radio:".concat(this._key));
        }
        catch (e) {
            console.log(e);
        }
    };
    Select.prototype.defaultFromCache = function () {
        var store = window.localStorage.getItem("select:".concat(this._key));
        this._defaultObject = store ? JSON.parse(store) : this._defaultObject;
        return this;
    };
    return Select;
}(Default_1.default));
exports.default = Select;
