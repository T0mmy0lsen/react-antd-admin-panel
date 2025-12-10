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
var Axios_1 = require("./Axios");
var axios_1 = require("axios");
var Get = /** @class */ (function (_super) {
    __extends(Get, _super);
    function Get() {
        var _this = this;
        var _a;
        _this = _super.call(this) || this;
        _this._cache = false;
        _this._env = JSON.parse((_a = window.localStorage.getItem('env')) !== null && _a !== void 0 ? _a : '{}');
        return _this;
    }
    Get.prototype.key = function (v) {
        this._key = v;
        return this;
    };
    Get.prototype.main = function (v) {
        this._main = v;
        return this;
    };
    Get.prototype.cache = function (v) {
        this._cache = v;
        return this;
    };
    Get.prototype.parent = function (v) {
        this._parent = v;
        if (this._parent._main)
            this._main = this._parent._main;
        return this;
    };
    Get.prototype.mock = function (v) {
        this._mock = v;
        return this;
    };
    Get.prototype.data = function () {
        if (this._mock)
            return this._mock;
        return this._data;
    };
    Get.prototype.copy = function () {
        var get = new Get();
        get.main(this._main);
        get.target(this._target);
        return get;
    };
    Get.prototype.finalize = function (response, args, callback) {
        var _a, _b, _c, _d;
        if (this._mock && this._data) {
            console.log("The request succeeded and you're mocking your data, so you can only get your mocked data trough data(). Remove your mock() data to disable this functionality.");
        }
        this._data = this._alter ? this._alter(response.data, args) : response.data;
        this._success = true;
        this._onThen(response, this._data, args);
        this._onComplete(response, this._data, args);
        if (this._parent) {
            (_b = (_a = this._parent)._onThen) === null || _b === void 0 ? void 0 : _b.call(_a, response, this._data, args);
            (_d = (_c = this._parent)._onComplete) === null || _d === void 0 ? void 0 : _d.call(_c, response, this._data, args);
        }
        callback === null || callback === void 0 ? void 0 : callback(response);
    };
    Get.prototype.get = function (args, callback) {
        var _this = this;
        if (args === void 0) { args = undefined; }
        if (callback === void 0) { callback = undefined; }
        if (this._doIf && !this._doIf())
            return;
        var target = this.targetBuild(args);
        var header = typeof this._header === 'function' ? this._header(args) : this._header;
        var params = undefined;
        var auth = undefined;
        var method = 'get';
        if (target.method)
            method = target.method.toLowerCase();
        if (target.params)
            params = target.params;
        if (target.target)
            target = target.target;
        if (target.auth)
            auth = target.auth;
        var settings = {};
        if (!!auth)
            settings['auth'] = auth;
        if (!!params)
            settings['params'] = params;
        if (!!header)
            settings['headers'] = header;
        if (this._env.cacheGet) {
            var store = window.localStorage.getItem(target);
            if (store) {
                this.finalize(JSON.parse(store), args, callback);
                return;
            }
        }
        axios_1["default"][method](target, settings).then(function (response) {
            try {
                if (_this._env.cacheGet)
                    window.localStorage.setItem(target, JSON.stringify(response));
            }
            catch (e) { }
            _this.finalize(response, args, callback);
        })["catch"](function (e) {
            var _a, _b, _c, _d, _e;
            console.log(e);
            if (!_this._mock) {
                if (((_a = e.response) === null || _a === void 0 ? void 0 : _a.status) === 403 && _this._main)
                    (_c = (_b = _this._main.$config.config.access) === null || _b === void 0 ? void 0 : _b.accessViolationApi) === null || _c === void 0 ? void 0 : _c.call(_b, _this._main);
                if (_this._fail) {
                    console.log('Get: failed - using default.', _this._fail);
                    _this.finalize({ data: _this._fail });
                }
                else {
                    _this._error = true;
                    (_d = _this._onCatch) === null || _d === void 0 ? void 0 : _d.call(_this, e, args);
                    (_e = _this._onError) === null || _e === void 0 ? void 0 : _e.call(_this, e, args);
                }
            }
            else {
                console.log("The request failed and you're mocking your data, so axios.catch() is ignored. Remove your mock() data to disable this functionality.");
            }
        });
    };
    return Get;
}(Axios_1["default"]));
exports["default"] = Get;
