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
exports.__esModule = true;
var index_1 = require("../../index");
var Default_1 = require("../builder/Default");
var List = /** @class */ (function (_super) {
    __extends(List, _super);
    function List() {
        var _this = _super.call(this, 'List') || this;
        /** Cycle Hooks are called by the .tsx and either next() or stop() should be called */
        /** On-functions are called by the .tsx and set by the builder */
        _this._onRecordWasEdited = function (v) { return v; };
        _this._onRecordWasSaved = function (v) { return v; };
        _this._onRowClicked = function (e, v, i) { return v; };
        /** Component-return functions. */
        _this.tsxSetExpandable = function () { };
        _this.tsxSetMenu = function () { };
        _this.setRecord = function () { };
        _this.getHeaders = function () { };
        _this.getRecords = function () { };
        _this.getDeletedKeys = function () { };
        _this.getEditingKeys = function () { };
        _this.clearDeletedKeys = function () { };
        _this.clearExpandedKeys = function () { };
        _this.setRecordValue = function () { };
        _this.setExpandableRowRender = function () { };
        _this.editRecord = function () { };
        _this.deleteRecord = function () { };
        _this.removeRecord = function () { };
        _this.removeRecords = function () { };
        _this.moveRecord = function () { };
        /** Builder-functions */
        _this._unique = function (v) { return v; };
        _this._append = [];
        _this._editable = [];
        _this._expandableSingles = false;
        _this._expandableByClick = false;
        _this._expandableExpandAll = false;
        _this._addDummyColumn = false;
        _this._headerMaxWidth = [];
        _this._headerPrepend = [];
        _this._headerAppend = [];
        _this._headerFilter = [];
        _this._headerWidth = {};
        _this._headerHide = [];
        _this._headerCreate = true;
        _this._header = true;
        _this._footer = true;
        _this._dense = false;
        _this._bordered = false;
        _this._actions = [];
        _this._draggable = true;
        _this._pageSize = 20;
        return _this;
    }
    List.prototype.clearSelf = function () {
        this._defaultObject = undefined;
        try {
            this.tsxClear();
            window.localStorage.removeItem("autocomplete:".concat(this._key));
        }
        catch (e) {
            console.log(e);
        }
    };
    List.prototype.defaultFromCache = function () {
        var store = window.localStorage.getItem("list:".concat(this._key));
        this._defaultObject = store ? JSON.parse(store) : this._defaultObject;
        return this;
    };
    List.prototype.section = function (section) {
        var _this = this;
        _super.prototype.section.call(this, section);
        Object.keys(this._actions).forEach(function (r) {
            var _a;
            _this._actions[r].section(section);
            _this._actions[r]._class = 'List';
            _this._actions[r]._key = (_a = _this._actions[r]._key) !== null && _a !== void 0 ? _a : _this._actions[r]._label.toLowerCase();
        });
    };
    List.prototype.getDefaultFilter = function () {
        var filter = {};
        this._headerPrepend.forEach(function (h) {
            var cachedFilter = window.localStorage.getItem("filter:".concat(h._title));
            if (cachedFilter)
                filter[h._key] = JSON.parse(cachedFilter);
        });
        return filter;
    };
    List.prototype.setItems = function (args) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f;
        this._random = Math.round(Math.random() * 1000);
        var data = (_f = (_e = (_b = args !== null && args !== void 0 ? args : (_a = this._get) === null || _a === void 0 ? void 0 : _a._data) !== null && _b !== void 0 ? _b : (_d = (_c = this._get) === null || _c === void 0 ? void 0 : _c._data) === null || _d === void 0 ? void 0 : _d.data) !== null && _e !== void 0 ? _e : this._defaultObject.dataSource) !== null && _f !== void 0 ? _f : [];
        data = Array.isArray(data) ? data : [];
        data = data.map(function (r, index) {
            r['key'] = "".concat(_this._unique(r), "-").concat(index, "-").concat(_this._random);
            r['index'] = index;
            if (_this._append)
                _this._append.forEach(function (a) { return r[a.key] = a.value(r); });
            return r;
        });
        return data.map(function (r) { return new index_1.ListItem(r, _this); });
    };
    List.prototype.onRecordWasEdited = function (v) { this._onRecordWasEdited = v; return this; };
    ;
    List.prototype.onRecordWasSaved = function (v) { this._onRecordWasSaved = v; return this; };
    ;
    List.prototype.onRowClicked = function (v) { this._onRowClicked = v; return this; };
    ;
    List.prototype.unique = function (v) { this._unique = v; return this; };
    List.prototype.appends = function (v) { this._append.push(v); return this; };
    List.prototype.append = function (v) { this._append = v; return this; };
    List.prototype.editable = function (v) { this._editable = v; return this; };
    List.prototype.filterable = function (v) { this._filterable = v; return this; };
    List.prototype.emptyIcon = function (v) { this._emptyIcon = v; return this; };
    List.prototype.emptyText = function (v) { this._emptyText = v; return this; };
    List.prototype.emptyColumn = function (v) { this._emptyColumn = v; return this; };
    List.prototype.menu = function (v) { this._menu = v; return this; };
    List.prototype.menuSection = function (v) { this._menuSection = v; return this; };
    List.prototype.menuSectionActive = function (v) { this._menuSectionActive = v; return this; };
    List.prototype.expandable = function (v) { this._expandable = v; return this; };
    List.prototype.expandableSingles = function () { this._expandableSingles = true; return this; };
    List.prototype.expandableSection = function (v) { this._expandableSection = v; return this; };
    List.prototype.expandableSectionActive = function (v) { this._expandableSectionActive = v; return this; };
    List.prototype.expandableByClick = function () { this._expandableByClick = true; return this; };
    List.prototype.expandableExpandAll = function () { this._expandableExpandAll = true; return this; };
    List.prototype.addDummyColumn = function (value) { this._addDummyColumn = value; return this; };
    List.prototype.headerMaxWidth = function (width) { this._headerMaxWidth = width; return this; };
    List.prototype.headerPrepend = function (v) { if (!this._headerPrepend.some(function (r) { return v._key === r._key; }))
        this._headerPrepend.push(v); return this; };
    List.prototype.headerAppend = function (v) { if (!this._headerAppend.some(function (r) { return v._key === r._key; }))
        this._headerAppend.push(v); return this; };
    List.prototype.headerFilter = function (filter) { this._headerFilter = filter; return this; };
    List.prototype.headerWidth = function (v) { this._headerWidth = v; return this; };
    List.prototype.hideHeader = function (v) { return this.headerHide(v); };
    ;
    List.prototype.headerHide = function (v) { this._headerHide = v; return this; };
    List.prototype.headerCreate = function (value) { this._headerCreate = value; return this; };
    List.prototype.header = function (value) { this._header = value; return this; };
    List.prototype.footer = function (value) { this._footer = value; return this; };
    List.prototype.dense = function (value) { this._dense = value; return this; };
    List.prototype.bordered = function () { this._bordered = true; return this; };
    List.prototype.actions = function (action) { this._actions.push(action); return this; };
    List.prototype.draggable = function (value) { this._draggable = value; return this; };
    List.prototype.pageSize = function (v) { this._pageSize = v; return this; };
    List.prototype.selectableFormat = function (v) {
        this._selectableFormat = v;
        return this;
    };
    List.prototype.selectable = function (v) {
        this._selectable = v;
        this._selectableModel = new Default_1["default"]().key(v);
        return this;
    };
    return List;
}(Default_1["default"]));
exports["default"] = List;
