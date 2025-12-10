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
var Default_1 = require("./Default");
var index_1 = require("../../index");
var Section = /** @class */ (function (_super) {
    __extends(Section, _super);
    function Section() {
        var _this = _super.call(this, 'Section') || this;
        _this._cols = 24;
        _this._type = 'Col';
        _this._justify = 'start';
        _this._align = 'start';
        _this._overlay = false;
        _this._card = false;
        _this._cardStyle = { marginTop: '24px' };
        _this._ignore = false;
        _this._key = index_1.Helpers.stamp();
        return _this;
    }
    Section.prototype.cols = function (cols) { this._cols = cols; return this; };
    Section.prototype.type = function (type) { this._type = type; return this; };
    Section.prototype.row = function () { this._type = 'Row'; return this; };
    Section.prototype.col = function () { this._type = 'Col'; return this; };
    Section.prototype.between = function () { this._justify = 'space-between'; return this; };
    Section.prototype.center = function () { this._justify = 'center'; return this; };
    Section.prototype.start = function () { this._justify = 'start'; return this; };
    Section.prototype.end = function () { this._justify = 'end'; return this; };
    Section.prototype.align = function (v) { this._align = v; return this; };
    Section.prototype.async = function (v) {
        if (v === void 0) { v = true; }
        this._async = v;
        return this;
    };
    Section.prototype.overlay = function (v) { this._overlay = v !== null && v !== void 0 ? v : true; return this; };
    Section.prototype.card = function (v) { this._card = v !== null && v !== void 0 ? v : true; return this; };
    Section.prototype.cardStyle = function (v) { this._cardStyle = v; return this; };
    Section.prototype.addRowEnd = function (items) {
        var section = new Section().row().end();
        this.add(section);
        this.addManyTo(section, items);
        return this;
    };
    Section.prototype.addRowStart = function (items) {
        var section = new Section().row().start();
        this.add(section);
        this.addManyTo(section, items);
        return this;
    };
    Section.prototype.addManyTo = function (section, items) {
        if (Array.isArray(items)) {
            items.forEach(function (r) { return section.add(r); });
        }
        else {
            section.add(items);
        }
    };
    Section.prototype.ignore = function (v) { this._ignore = v; return this; };
    Section.prototype.object = function (v) { this._object = v; return this; };
    Section.prototype.component = function (component, args) {
        if (args === void 0) { args = undefined; }
        this._component = component;
        this._componentArgs = args;
        return this;
    };
    Section.prototype.init = function () {
        var _a;
        if (this._formulaIsRoot)
            (_a = this.formulaSetChildren) === null || _a === void 0 ? void 0 : _a.call(this);
        return this;
    };
    Section.prototype.immediate = function (func, args) {
        return _super.prototype.fetch.call(this, func, args);
    };
    return Section;
}(Default_1["default"]));
exports["default"] = Section;
