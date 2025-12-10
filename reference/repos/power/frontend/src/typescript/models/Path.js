"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Path = /** @class */ (function () {
    function Path(object) {
        var _a, _b, _c, _d;
        this._search = undefined;
        this._query = undefined;
        this._route = undefined;
        if (object.search) {
            var params = new URLSearchParams(object.search);
            var paramObj_1 = {};
            params.forEach(function (value, key) {
                paramObj_1[key] = value;
            });
            this._query = paramObj_1;
            this._search = object.search;
        }
        this._route = (_a = object.route) !== null && _a !== void 0 ? _a : undefined;
        this._params = (_b = object.params) !== null && _b !== void 0 ? _b : undefined;
        this._actualPath = (_c = object.actualPath) !== null && _c !== void 0 ? _c : undefined;
        this._matchedPath = (_d = object.matchedPath) !== null && _d !== void 0 ? _d : undefined;
    }
    Path.prototype.copy = function () {
        return new Path({
            route: this._route,
            search: this._search,
            params: this._params,
            actualPath: this._actualPath,
            matchedPath: this._matchedPath,
        });
    };
    return Path;
}());
exports.default = Path;
