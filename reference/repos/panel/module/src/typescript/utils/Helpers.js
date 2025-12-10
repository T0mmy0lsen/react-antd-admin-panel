"use strict";
exports.__esModule = true;
var Helpers = /** @class */ (function () {
    function Helpers() {
    }
    Helpers.getIndicesOf = function (searchStr, str, caseSensitive) {
        var searchStrLen = searchStr.length;
        if (searchStrLen == 0)
            return [];
        var startIndex = 0;
        var index;
        var indices = [];
        if (!caseSensitive) {
            str = str.toLowerCase();
            searchStr = searchStr.toLowerCase();
        }
        while ((index = str.indexOf(searchStr, startIndex)) > -1) {
            indices.push(index);
            startIndex = index + searchStrLen;
        }
        return indices;
    };
    Helpers.hash = function (value, length) {
        if (length === void 0) { length = 8; }
        value = Helpers.safeStringify(value);
        var hash = 5381;
        var index = value.length;
        while (index)
            hash = (hash * 33) ^ value.charCodeAt(--index);
        hash = hash >>> 0;
        return hash.toString(length);
    };
    Helpers.safeStringify = function (obj, indent) {
        if (indent === void 0) { indent = 2; }
        var cache = [];
        var retVal = JSON.stringify(obj, function (value) {
            return typeof value === "object" && value !== null
                ? cache.includes(value)
                    ? undefined // Duplicate reference found, discard key
                    : cache.push(value) && value // Store value in our collection
                : value;
        }, indent);
        cache = null;
        return retVal;
    };
    ;
    Helpers.stamp = function () {
        return "S".concat(new Date().getSeconds().toString(), "-M").concat(new Date().getMilliseconds().toString());
    };
    Helpers.store = function (data, has, fallback) {
        return Helpers.inside(data, "c.request.store.".concat(has), fallback);
    };
    Helpers.inside = function (data, has, fallback) {
        if (fallback === void 0) { fallback = undefined; }
        if (typeof has === 'string')
            has = has.split('.');
        var temp = data;
        var fail = false;
        has.forEach(function (r) {
            if (!temp)
                fail = true;
            if (!fail && r in temp) {
                temp = temp[r];
            }
            else {
                temp = undefined;
            }
        });
        return temp !== null && temp !== void 0 ? temp : fallback;
    };
    return Helpers;
}());
exports["default"] = Helpers;
