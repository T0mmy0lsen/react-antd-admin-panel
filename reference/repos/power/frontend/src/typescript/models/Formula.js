"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ItemValue_1 = require("./builder/ItemValue");
var helpers_1 = require("../../helpers");
var Formula = /** @class */ (function () {
    function Formula(post) {
        this._values = {};
        this._defaults = {};
        this._elements = {};
        this._onChange = function () { };
        this._post = post;
    }
    Formula.prototype.getIsAllRequiredFieldsFilled = function () {
        var _this = this;
        var isAllFilled = true;
        Object.keys(this._elements).forEach(function (r) {
            var _a, _b;
            var elementIsRequired = (0, helpers_1.getConfigValue)(_this._elements[r].configs, 'required') === 1;
            console.log('elementIsRequired', _this._elements[r], elementIsRequired);
            if (elementIsRequired && !((_b = (_a = _this._values[r]) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.hasValue())) {
                isAllFilled = false;
            }
        });
        console.log('isAllFilled', isAllFilled);
        return isAllFilled;
    };
    Formula.prototype.onChange = function (v) {
        this._onChange = v;
        return this;
    };
    Formula.prototype.onComplete = function () {
        var _a;
        (_a = this._action) === null || _a === void 0 ? void 0 : _a.callCompletes();
    };
    Formula.prototype.onError = function () {
        var _a;
        (_a = this._action) === null || _a === void 0 ? void 0 : _a.callErrors();
    };
    Formula.prototype.register = function (v) {
        if (v._key)
            this._defaults[v._key] = v;
    };
    Formula.prototype.setValuesFromFormular = function (formular) {
        var _this = this;
        formular.formular_values.forEach(function (r) {
            _this.registerValue(r);
        });
        formular.formular_creator.elements.forEach(function (r) {
            _this.registerElement(r);
        });
    };
    Formula.prototype.value = function (model) {
        this._values[model._key] = {
            model: model,
            value: model._value,
        };
        this._onChange(this);
    };
    Formula.prototype.values = function (model) {
        this._values[model._key] = {
            model: model,
            values: model._values,
        };
        this._onChange(this);
    };
    Formula.prototype.setValueByKey = function (key, value) {
        var v = new ItemValue_1.default();
        v._id = value;
        this._values[key] = {
            model: undefined,
            value: v
        };
    };
    Formula.prototype.post = function (post) { this._post = post; return this; };
    Formula.prototype.action = function (action) { this._action = action; return this; };
    Formula.prototype.submit = function (args, action) {
        this._post.submit(args, action, this);
    };
    Formula.prototype.params = function () {
        var _this = this;
        var form = {};
        Object.keys(this._values).forEach(function (r) {
            if (r === 'undefined')
                return;
            if (_this._values[r].value)
                form[r] = _this._values[r].value.getFormsValue();
            if (_this._values[r].values)
                form[r] = _this._values[r].values.map(function (v) { return v.getFormsValue(); });
        });
        return form;
    };
    Formula.prototype.registerValue = function (r) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        if (r.value) {
            this._values[r.formular_creator_element_id] = {
                model: undefined,
                value: new ItemValue_1.default({
                    id: r.value.id,
                    value: (_f = (_d = (_b = (_a = r.value.value_int) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : (_c = r.value.value_text) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : (_e = r.value.value_datetime) === null || _e === void 0 ? void 0 : _e.value) !== null && _f !== void 0 ? _f : (_g = r.value.value_option) === null || _g === void 0 ? void 0 : _g.id,
                    description: (_o = (_l = (_j = (_h = r.value.value_int) === null || _h === void 0 ? void 0 : _h.value.toString()) !== null && _j !== void 0 ? _j : (_k = r.value.value_text) === null || _k === void 0 ? void 0 : _k.value) !== null && _l !== void 0 ? _l : (_m = r.value.value_datetime) === null || _m === void 0 ? void 0 : _m.value) !== null && _o !== void 0 ? _o : (_p = r.value.value_option) === null || _p === void 0 ? void 0 : _p.value
                })
            };
        }
    };
    Formula.prototype.registerElement = function (r) {
        this._elements[r.id] = r;
        var elementIsRequired = (0, helpers_1.hasConfigValue)(r.configs, 'required');
        if (elementIsRequired) {
            var elementIsRequiredValue = (0, helpers_1.getConfigValue)(r.configs, 'required');
            console.log('elementIsRequired', elementIsRequiredValue);
        }
    };
    return Formula;
}());
exports.default = Formula;
