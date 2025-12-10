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
var Tree = /** @class */ (function (_super) {
    __extends(Tree, _super);
    function Tree() {
        var _a;
        var _this = _super.call(this, 'Tree') || this;
        /** Component-return functions.
         *  - Call .tsx functions from the model
         *  - Functions will be set at the end of the .tsx
         */
        _this.selectNode = function () { };
        _this.expandNode = function () { };
        _this.reloadLocal = function () { };
        _this.env = JSON.parse((_a = window.localStorage.getItem('env')) !== null && _a !== void 0 ? _a : '{}');
        return _this;
    }
    Tree.prototype.nodeAdd = function (v) { this._nodeAdd = v; return this; };
    Tree.prototype.nodeRemove = function (v) { this._nodeRemove = v; return this; };
    Tree.prototype.getOnChild = function (v) { this._getOnChild = v; return this; };
    Tree.prototype.getOnChildIgnoreIf = function (v) { this._getOnChildIgnoreIf = v; return this; };
    return Tree;
}(Default_1.default));
exports.default = Tree;
