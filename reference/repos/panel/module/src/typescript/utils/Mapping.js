"use strict";
/**
 *  Anything that relies on the underlying structure of the React implementation.
 */
exports.__esModule = true;
var Mapping = /** @class */ (function () {
    function Mapping() {
        this.$path = function () { return console.log('$path: not mapped correctly'); };
        this.$loading = function () { return console.log('$loading: not mapped correctly'); };
        this.$navigate = function () { return console.log('$navigate: not mapped correctly'); };
    }
    return Mapping;
}());
exports["default"] = Mapping;
