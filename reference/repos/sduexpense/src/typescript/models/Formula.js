"use strict";
exports.__esModule = true;
var Value_1 = require("./Value");
var Formula = /** @class */ (function () {
    function Formula(post) {
        this._values = {};
        this._hidden = [];
        this._post = post;
    }
    // Only registered if the defaultValue-method is set on the .tsx and a default value is set on the .ts
    Formula.prototype.value = function (model, value) {
        if (value === undefined) {
            return;
        }
        if (!model._key) {
            this._hidden.push(new Value_1["default"]().model(model));
            return;
        }
        if (this._values[model._key]) {
            this._values[model._key].set(value);
            this._values[model._key].model(model);
        }
        else {
            this._values[model._key] = new Value_1["default"]();
            this.value(model, value);
        }
    };
    Formula.prototype.action = function (action) { this._action = action; return this; };
    Formula.prototype.post = function (post) { this._post = post; return this; };
    Formula.prototype.submit = function (args, action) {
        this._post.submit(args, action, this);
    };
    Formula.prototype.onComplete = function () {
        var _a;
        (_a = this._action) === null || _a === void 0 ? void 0 : _a.callCompletes();
    };
    Formula.prototype.onError = function () {
        var _a;
        (_a = this._action) === null || _a === void 0 ? void 0 : _a.callErrors();
    };
    Formula.prototype.params = function () {
        var _this = this;
        var form = {};
        Object.keys(this._values).forEach(function (r) { return form[r] = _this._values[r].get(); });
        return form;
    };
    Formula.prototype.valuesOnReset = function () {
        var _this = this;
        Object.keys(this._values).forEach(function (r) { var _a, _b; return (_b = (_a = _this._values[r]._model).clearSelf) === null || _b === void 0 ? void 0 : _b.call(_a); });
        this._hidden.forEach(function (r) { var _a, _b; return (_b = (_a = r._model).clearSelf) === null || _b === void 0 ? void 0 : _b.call(_a); });
    };
    return Formula;
}());
exports["default"] = Formula;
