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
var index_1 = require("../../index");
// https://ant.design/components/result/#API
var Result = /** @class */ (function (_super) {
    __extends(Result, _super);
    function Result() {
        var _this = _super.call(this, 'Result') || this;
        _this.natives = ['extra', 'icon', 'status', 'subTitle', 'title'];
        return _this;
    }
    Result.prototype.extra = function (v) { this._extra = v; return this; };
    Result.prototype.icon = function (v) { this._icon = v; return this; };
    Result.prototype.status = function (v) { this._status = v; return this; };
    Result.prototype.subTitle = function (v) { this._subTitle = v; return this; };
    Result.prototype.title = function (v) { this._title = v; return this; };
    return Result;
}(index_1.Default));
exports.default = Result;
