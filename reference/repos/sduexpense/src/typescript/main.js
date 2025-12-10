"use strict";
exports.__esModule = true;
var Controller_1 = require("./controllers/Controller");
var Mapping_1 = require("./utils/Mapping");
var User_1 = require("./models/User");
var Get_1 = require("./models/Get");
var Main = /** @class */ (function () {
    function Main(root, config, instance, account) {
        this.Store = {};
        this.Function = {};
        this.tsxErrorMessage = function () { console.log('[UNSET] tsxErrorMessage'); };
        this.tsxSuccessMessage = function () { console.log('[UNSET] tsxSuccessMessage'); };
        this.$root = root;
        this.$config = config;
        this.$instance = instance;
        this.$account = account;
        this.$map = new Mapping_1["default"]();
        this.Controller = new Controller_1["default"](this);
    }
    Main.prototype.setRouteKey = function (v) { this._routeKey = v; };
    Main.prototype.$modal = function (v) { this._setModal(v); };
    Main.prototype.setModal = function (v) { this._setModal = v; };
    Main.prototype.$modalClose = function () { this._setModalClose(); };
    Main.prototype.setModalClose = function (v) { this._setModalClose = v; };
    Main.prototype.$modalLoading = function (v) { this._setModalLoading(v); };
    Main.prototype.setModalLoading = function (v) { this._setModalLoading = v; };
    Main.prototype.setSiderRight = function (v) { this._setSiderRight = v; };
    Main.prototype.setSiderRightReload = function (v) { this._setSiderRightReload = v; };
    Main.prototype.setSiderRightLoading = function (v) { this._setSiderRightLoading = v; };
    Main.prototype.setSiderRightClose = function (v) { this._setSiderRightClose = v; };
    Main.prototype.$access = function (access, cycle) {
        return this.$config.config.access.access(access, this, cycle);
    };
    Main.prototype.$params = function (key, route) {
        return this.$path(route)._params[key];
    };
    Main.prototype.$mapping = function (key) {
        var _a, _b;
        return (_b = (_a = this.$config.config) === null || _a === void 0 ? void 0 : _a.mapping) === null || _b === void 0 ? void 0 : _b[key];
    };
    Main.prototype.$store = function (data, key) {
        this.Store[key] = data;
    };
    Main.prototype.$stored = function (key) {
        return this.Store[key];
    };
    Main.prototype.$query = function (key, route) {
        var _a, _b;
        return (_b = (_a = this.$path(route)) === null || _a === void 0 ? void 0 : _a._query) === null || _b === void 0 ? void 0 : _b[key];
    };
    Main.prototype.$function = function (func, key) {
        if (key in this.Function) {
            console.log('Function:', key, 'already set.');
        }
        this.Function[key] = func;
    };
    Main.prototype.$cycle = function (route) {
        if (!this.Controller._cycles[route])
            return undefined;
        return this.Controller._cycles[route][this.Controller._cycles[route].length - 1];
    };
    Main.prototype.$route = function (route, next, failed) {
        var _this = this;
        if (next === void 0) { next = false; }
        if (!next)
            next = function () {
                _this.$map.$navigate(route);
            };
        var n = next;
        next = function () {
            n();
            _this._routeKey(route);
        };
        // The .ts tells .tsx to toggle a loading state.
        this.$map.$loading(true);
        // Construct a Cycle, i.e. pre-building the next page.
        this.Controller.onCycle(route, next, failed);
    };
    Main.prototype.$get = function (cycle, key) {
        if (!cycle) {
            console.log('$data: cycle is undefined.');
            return new Get_1["default"]();
        }
        var search = cycle._route._gets.filter(function (r) {
            if (r._key)
                return r._key === key;
            var target = typeof r._target === 'string' ? r._target : r._target(cycle);
            if (typeof target !== 'string')
                target = target.target;
            return target === key;
        });
        return search.length ? search[0] : new Get_1["default"]();
    };
    Main.prototype.$path = function (route) {
        return this.$map.$path(route ? route : "".concat(document.location.pathname).concat(document.location.search));
    };
    Main.prototype.$user = function (user) {
        if (!user)
            return this.User;
        this.User = new User_1["default"](user);
        return this.User;
    };
    return Main;
}());
exports["default"] = Main;
