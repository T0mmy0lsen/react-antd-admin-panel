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
var Item = /** @class */ (function () {
    function Item(key, value, title, text) {
        this.propsToAdd = ['id', 'text', 'render', 'style', 'object'];
        this.key(key);
        this.value(value !== null && value !== void 0 ? value : this._key);
        this.title(title !== null && title !== void 0 ? title : this._value);
    }
    Item.prototype.id = function (v) { this._id = v; return this; };
    Item.prototype.key = function (v) { this._key = v; return this; };
    Item.prototype.text = function (v) { this._text = v; return this; };
    Item.prototype.type = function (v) { this._type = v; return this; };
    Item.prototype.icon = function (v) { this._icon = v; return this; };
    Item.prototype.value = function (v) { this._value = "".concat(v); return this; };
    Item.prototype.style = function (v) { this._style = v; return this; };
    Item.prototype.title = function (v) { this._title = v ? (isNaN(v) ? v[0].toUpperCase() + v.substr(1) : "".concat(v)) : undefined; return this; };
    Item.prototype.object = function (v) { this._object = v; return this; };
    Item.prototype.render = function (v) { this._render = v; return this; };
    Item.prototype.access = function (v) { this._access = v; return this; };
    Item.prototype.description = function (v) { this._description = v; return this; };
    Item.prototype.disabled = function (v) { this._disabled = v; return this; };
    Item.prototype.callback = function (v) { this._callback = v; return this; };
    Item.prototype.getData = function () {
        return this._object;
    };
    Item.prototype.getObject = function () {
        var _this = this;
        var _a;
        var addProps = {};
        // @ts-ignore
        this.propsToAdd.forEach(function (r) { if (_this["_".concat(r)])
            addProps[r] = _this["_".concat(r)]; });
        return (__assign({
            id: this._id,
            key: this._key,
            value: this._value,
            label: (_a = this._render) === null || _a === void 0 ? void 0 : _a.call(this),
            title: this._title,
            object: this,
        }, addProps));
    };
    return Item;
}());
exports.default = Item;
