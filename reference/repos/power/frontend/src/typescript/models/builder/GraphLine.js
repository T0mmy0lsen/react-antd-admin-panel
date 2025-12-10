"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Default_1 = require("./Default");
var GraphLine = /** @class */ (function (_super) {
    __extends(GraphLine, _super);
    function GraphLine() {
        return _super.call(this, 'GraphLine') || this;
    }
    GraphLine.prototype.x = function (v) { this._x = v; return this; };
    GraphLine.prototype.y = function (v) { this._y = v; return this; };
    return GraphLine;
}(Default_1["default"]));
exports["default"] = GraphLine;
