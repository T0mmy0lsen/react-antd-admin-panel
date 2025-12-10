"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Access = /** @class */ (function () {
    function Access(main) {
        this.style = {};
        this.access = ({ access: true, hidden: false });
        this.disabled = false;
        this._main = main;
    }
    Access.prototype.render = function (v) { this._render = v; return this; };
    Access.prototype.simple = function (v, args) {
        var _a;
        if (v._access === undefined)
            return false;
        if (typeof v._disabled === 'function')
            return (((_a = v._disabled) === null || _a === void 0 ? void 0 : _a.call(v, args)) || !this._main.$access(v._access).access);
        return (v._disabled || !this._main.$access(v._access).access);
    };
    Access.prototype.action = function (v, args) {
        var _a;
        if (v._access === undefined)
            return this;
        if (this._main) {
            this.access = this._main.$access(v._access);
            this.disabled = !this.access.access;
            if (!this.access.access && !this.access.hidden) {
                this.style = { opacity: .25 };
            }
            if (!this.access.access && this.access.hidden) {
                this.style = { opacity: 0 };
            }
        }
        if ((_a = v._disabled) === null || _a === void 0 ? void 0 : _a.call(v, args)) {
            this.disabled = true;
            this.access.access = false;
            this.style = __assign(__assign({}, this.style), { opacity: .25 });
        }
        return this;
    };
    Access.prototype.configs = function (v) {
        var _this = this;
        var keys = Object.keys(v);
        keys.forEach(function (r) {
            switch (true) {
                case (r === 'onClick' && !_this.access.access):
                    _this['onClick'] = function (e) { return e.stopPropagation(); };
                    break;
                default:
                    _this[r] = v[r];
            }
        });
        return this._render(this.getObject());
    };
    Access.prototype.getObject = function () {
        var _a;
        return ({
            style: this.style,
            disabled: this.disabled,
            onClick: (_a = this['onClick']) !== null && _a !== void 0 ? _a : (function () { }),
        });
    };
    return Access;
}());
exports.default = Access;
