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
var Steps = /** @class */ (function (_super) {
    __extends(Steps, _super);
    function Steps() {
        var _this = _super.call(this, 'Steps') || this;
        _this.getCurrentStep = function () { };
        _this.clear = function () { };
        _this.done = function (v, b) {
            console.log('Steps: calling done(), but not implemented before the component is set.');
            if (_this._fields) {
                _this._fields.map(function (r, index) {
                    if (index === v - 1)
                        r._done = b !== undefined ? b : !r._done;
                    return r;
                });
            }
        };
        _this.goTo = function () { };
        _this.next = function () { };
        _this.prev = function () { };
        _this.stepsTsx = function () { };
        _this.tsxStepsButtonDisable = function () { };
        return _this;
    }
    return Steps;
}(Default_1["default"]));
exports["default"] = Steps;
