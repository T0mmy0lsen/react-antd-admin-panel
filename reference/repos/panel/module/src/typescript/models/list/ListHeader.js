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
exports.__esModule = true;
var ListHeader = /** @class */ (function () {
    function ListHeader(obj) {
        var _this = this;
        this._type = 'Input';
        this._items = [];
        this._editable = false;
        this._filterable = false;
        this._searchable = false;
        if (obj)
            Object.keys(obj).forEach(function (o) {
                // @ts-ignore
                if (typeof _this[o] === 'function')
                    _this[o](obj[o]);
            });
        this._object = obj;
    }
    ListHeader.prototype.object = function (v) { this._object = v; return this; };
    ListHeader.prototype["default"] = function (v) { this._default = v; return this; };
    ListHeader.prototype.key = function (v) { this._key = v; return this; };
    ListHeader.prototype.type = function (v) { this._type = v; return this; };
    ListHeader.prototype.items = function (v) { this._items = v; return this; };
    ListHeader.prototype.title = function (v) { this._title = v; return this; };
    ListHeader.prototype.width = function (v) { this._width = v; return this; };
    ListHeader.prototype.editable = function (v) { this._editable = v ? v : !v; return this; };
    ListHeader.prototype.sortable = function (v) { this._sortable = v ? v : !v; return this; };
    ListHeader.prototype.filterable = function (v) { this._filterable = v ? v : !v; return this; };
    ListHeader.prototype.searchable = function (v) { this._searchable = v ? v : !v; return this; };
    ListHeader.prototype.render = function (v) { this._renderCustom = v; return this; };
    // List.tsx will call this to get the header object.
    ListHeader.prototype.getObject = function () {
        var _this = this;
        var _a, _b;
        var addProps = {};
        if (this._width)
            addProps['width'] = this._width;
        return __assign(__assign({}, addProps), {
            key: this._key,
            type: this._type,
            title: (_b = (_a = this._title) !== null && _a !== void 0 ? _a : this._key[0].toUpperCase() + this._key.substr(1)) !== null && _b !== void 0 ? _b : 'Title',
            items: this._items,
            dataIndex: this._key,
            editable: this._editable,
            sortable: this._sortable,
            filterable: this._filterable,
            searchable: this._searchable,
            render: function (v, o) { return _this._render(v, o); }
        });
    };
    return ListHeader;
}());
exports["default"] = ListHeader;
