"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User = /** @class */ (function () {
    function User(r) {
        var _this = this;
        if (!r)
            return;
        this.object(r);
        var ignore = Object.keys(this);
        Object.keys(r).forEach(function (k) {
            if (!ignore.includes(k) || k[0] === '_') {
                // @ts-ignore
                _this[k] = r[k];
            }
        });
    }
    User.prototype.object = function (v) { this._object = v; return this; };
    return User;
}());
exports.default = User;
