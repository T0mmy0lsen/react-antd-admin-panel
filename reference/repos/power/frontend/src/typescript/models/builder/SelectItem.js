"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var SelectItem = /** @class */ (function () {
    function SelectItem(key, value, title, text) {
        var _a;
        this.propsToAdd = ['id', 'text'];
        this.key(key);
        this.value(value !== null && value !== void 0 ? value : key);
        this.title((_a = title !== null && title !== void 0 ? title : (value && value[0].toUpperCase() + value.substr(1))) !== null && _a !== void 0 ? _a : (key && key[0].toUpperCase() + key.substr(1)));
    }
    SelectItem.prototype.id = function (v) { this._id = v; return this; };
    SelectItem.prototype.key = function (v) { this._key = v; return this; };
    SelectItem.prototype.value = function (v) { this._value = v; return this; };
    SelectItem.prototype.text = function (v) { this._text = v; return this; };
    SelectItem.prototype.title = function (v) { this._title = v; return this; };
    SelectItem.prototype.object = function (v) { this._object = v; return this; };
    SelectItem.prototype.render = function (v) { this._render = v; return this; };
    SelectItem.prototype.getObject = function () {
        var _this = this;
        var addProps = {};
        // @ts-ignore
        this.propsToAdd.forEach(function (r) { if (_this["_".concat(r)])
            addProps[r] = _this["_".concat(r)]; });
        return (__assign({
            key: this._key,
            value: this._value,
            title: this._title,
            object: this._object,
        }, addProps));
    };
    return SelectItem;
}());
exports.default = SelectItem;
