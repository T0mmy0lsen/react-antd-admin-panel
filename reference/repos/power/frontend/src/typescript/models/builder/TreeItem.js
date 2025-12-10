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
var DefaultItem_1 = require("./DefaultItem");
var TreeItem = /** @class */ (function (_super) {
    __extends(TreeItem, _super);
    function TreeItem(r, merge) {
        var _this = _super.call(this, r, merge) || this;
        _this._show = true;
        _this._disabled = false;
        _this._canBeLoaded = true;
        _this._canBeEdited = true;
        _this.key = 0;
        _this.isLeaf = false;
        _this.children = [];
        return _this;
    }
    TreeItem.prototype.leaf = function (v) { this.isLeaf = v ? v : !v; return this; };
    TreeItem.prototype.show = function (v) { this._show = v; return this; };
    TreeItem.prototype.disabled = function (v) { this._disabled = v; return this; };
    TreeItem.prototype.canBeLoaded = function (v) { this._canBeLoaded = v; return this; };
    TreeItem.prototype.canBeEdited = function (v) { this._canBeEdited = v; return this; };
    TreeItem.prototype.label = function (v) { this._label = v; return this; };
    TreeItem.prototype.id = function (v) { this._id = v; return this.index(v); };
    TreeItem.prototype.index = function (v) { this.key = v; return this; };
    return TreeItem;
}(DefaultItem_1.default));
exports.default = TreeItem;
