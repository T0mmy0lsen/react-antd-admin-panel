"use strict";
exports.__esModule = true;
var Path_1 = require("./Path");
var Route = /** @class */ (function () {
    function Route() {
        this._gets = [];
        this._posts = [];
        this._exact = false;
        this._access = true;
    }
    Route.prototype.copy = function () {
        var route = new Route();
        route._path = this._path.copy();
        route._gets = this._gets.map(function (r) { return r.copy(); });
        route.Component = this.Component;
        return route;
    };
    Route.prototype.key = function (key) {
        this._key = key;
        this._path = new Path_1["default"]({ matchedPath: key });
        return this;
    };
    Route.prototype.get = function (value) {
        this._gets.push(value);
        return this;
    };
    Route.prototype.post = function (value) {
        this._posts.push(value);
        return this;
    };
    Route.prototype.exact = function () {
        this._exact = true;
        return this;
    };
    Route.prototype.component = function (value) {
        this.Component = value;
        return this;
    };
    Route.prototype.access = function (value) {
        this._access = value;
        return this;
    };
    return Route;
}());
exports["default"] = Route;
