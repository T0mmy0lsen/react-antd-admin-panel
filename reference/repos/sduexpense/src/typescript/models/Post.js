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
exports.__esModule = true;
var Axios_1 = require("./Axios");
var axios_1 = require("axios");
var Post = /** @class */ (function (_super) {
    __extends(Post, _super);
    function Post() {
        var _this = this;
        var _a;
        _this = _super.call(this) || this;
        _this._formatData = function (v) { return v; };
        _this._formatParams = function (v) { return v; };
        _this.env = JSON.parse((_a = window.localStorage.getItem('env')) !== null && _a !== void 0 ? _a : '{}');
        return _this;
    }
    Post.prototype.key = function (v) { this._key = v; return this; };
    Post.prototype.main = function (v) { this._main = v; return this; };
    Post.prototype.parent = function (v) { this._parent = v; if (this._parent._main)
        this._main = this._parent._main; return this; };
    Post.prototype.formatData = function (v) { this._formatData = v; return this; };
    Post.prototype.formatParams = function (v) { this._formatParams = v; return this; };
    Post.prototype.copy = function () {
        var post = new Post();
        post.main(this._main);
        post.target(this._target);
        return post;
    };
    Post.prototype.finalize = function (r, args, action, formula) {
        this._success = true;
        this._onThen(r, args);
        action === null || action === void 0 ? void 0 : action._onComplete(r, args);
        formula === null || formula === void 0 ? void 0 : formula.onComplete();
    };
    Post.prototype.submit = function (args, action, formula) {
        var _this = this;
        var _a;
        if (this._doIf && !this._doIf())
            return;
        this._onInit();
        var target = this.targetBuild(args);
        var header = typeof this._header === 'function' ? this._header(args) : this._header;
        var params = this._formatParams(formula === null || formula === void 0 ? void 0 : formula.params());
        var method = 'post';
        if (target.method)
            method = target.method.toLowerCase();
        if (target.params)
            params = __assign(__assign({}, target.params), params);
        if (target.target)
            target = target.target;
        var settings = {
            data: this._formatData(params),
            headers: header !== null && header !== void 0 ? header : {}
        };
        if (this.env.cachePost) {
            var store = window.localStorage.getItem(target);
            if (store) {
                this.finalize(JSON.parse(store), args, action, formula);
                return;
            }
        }
        if (method === 'delete') {
            // @ts-ignore
            axios_1["default"]["delete"](target, settings)
                .then(function (response) {
                try {
                    if (_this.env.cachePost)
                        window.localStorage.setItem(target, JSON.stringify(response));
                }
                catch (e) { }
                _this.finalize(response, args, action, formula);
            })["catch"](function (r) {
                var _a;
                if (((_a = r.response) === null || _a === void 0 ? void 0 : _a.status) === 403 && _this._main)
                    _this._main.$config.config.access.accessViolationApi(_this._main);
                _this._error = true;
                _this._onCatch(r, args);
                action === null || action === void 0 ? void 0 : action._onError(r, args);
                formula === null || formula === void 0 ? void 0 : formula.onError();
            });
        }
        else {
            // @ts-ignore
            (_a = axios_1["default"][method !== null && method !== void 0 ? method : 'post']) === null || _a === void 0 ? void 0 : _a.call(axios_1["default"], target, params !== null && params !== void 0 ? params : formula === null || formula === void 0 ? void 0 : formula.params(), settings).then(function (response) {
                try {
                    if (_this.env.cachePost)
                        window.localStorage.setItem(target, JSON.stringify(response));
                }
                catch (e) { }
                _this.finalize(response, args, action, formula);
            })["catch"](function (r) {
                var _a;
                if (((_a = r.response) === null || _a === void 0 ? void 0 : _a.status) === 403 && _this._main)
                    _this._main.$config.config.access.accessViolationApi(_this._main);
                _this._error = true;
                _this._onCatch(r);
                action === null || action === void 0 ? void 0 : action._onError();
                formula === null || formula === void 0 ? void 0 : formula.onError();
            });
        }
    };
    return Post;
}(Axios_1["default"]));
exports["default"] = Post;
