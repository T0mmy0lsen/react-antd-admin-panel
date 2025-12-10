"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultItem = /** @class */ (function () {
    function DefaultItem(r, merge) {
        if (merge === void 0) { merge = true; }
        var _this = this;
        this.setLoading = function () { };
        this._objects = {};
        this._editable = false;
        this._autoFocus = false;
        this._placeholder = '';
        if (!r)
            return;
        this.object(r);
        var ignore = Object.keys(this);
        if (merge)
            Object.keys(r).forEach(function (k) {
                if (!ignore.includes(k) || k[0] === '_' || ['index', 'key'].includes(k)) {
                    // @ts-ignore
                    _this[k] = r[k];
                }
                else {
                    // console.log(`Ignores key ${k} since this will overwrite a ListItem variable.`)
                }
            });
    }
    DefaultItem.prototype.fetch = function () {
        this._get.get(this);
    };
    DefaultItem.prototype.onThen = function (v) {
        if (this._get)
            this._get.onThen(v);
    };
    DefaultItem.prototype.onCatch = function (v) {
        if (this._get)
            this._get.onCatch(v);
    };
    DefaultItem.prototype.get = function (v) { this._get = v; return this; };
    DefaultItem.prototype.parent = function (v) { this._parent = v; return this; };
    DefaultItem.prototype.object = function (v) { this._object = v; return this; };
    DefaultItem.prototype.objects = function (v) { this._objects = v; return this; };
    DefaultItem.prototype.render = function (v) { this._render = v; return this; };
    DefaultItem.prototype.section = function (v) { this._section = v; return this; };
    DefaultItem.prototype.editable = function (v) { this._editable = v ? v : !v; return this; };
    DefaultItem.prototype.autoFocus = function (v) { this._autoFocus = v ? v : !v; return this; };
    DefaultItem.prototype.placeholder = function (v) { this._placeholder = v; return this; };
    return DefaultItem;
}());
exports.default = DefaultItem;
