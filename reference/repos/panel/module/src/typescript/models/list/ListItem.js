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
var DefaultItem_1 = require("../builder/DefaultItem");
var ListItem = /** @class */ (function (_super) {
    __extends(ListItem, _super);
    function ListItem(r, list) {
        var _this = this;
        var _a, _b;
        _this = _super.call(this, r) || this;
        _this._expandableSection = (_a = list._expandableSection) === null || _a === void 0 ? void 0 : _a.call(list, _this);
        _this._menuSection = (_b = list._menuSection) === null || _b === void 0 ? void 0 : _b.call(list, _this);
        return _this;
    }
    ListItem.prototype.getList = function () {
        var _a, _b;
        return (_b = (_a = this._expandableSection) === null || _a === void 0 ? void 0 : _a.getFieldByClass('List')) !== null && _b !== void 0 ? _b : [];
    };
    ListItem.prototype.getListRecords = function () {
        // The List-component would always have the true-value. However, sometimes the component may not have been drawn.
        // Thus, we expect the List.ts to have been build. In here we should be able to fetch the data.
        var list = this.getList();
        if (list.length === 0)
            return [];
        var records = list.getRecords();
        if (records)
            return records;
        return list.setItems();
    };
    return ListItem;
}(DefaultItem_1["default"]));
exports["default"] = ListItem;
