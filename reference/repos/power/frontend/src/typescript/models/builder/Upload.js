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
Object.defineProperty(exports, "__esModule", { value: true });
var Default_1 = require("./Default");
var Upload = /** @class */ (function (_super) {
    __extends(Upload, _super);
    function Upload() {
        var _this = _super.call(this, 'Upload') || this;
        /** Non-builder variables are set before the constructor. */
        _this._fileWasUploaded = false;
        _this._fileList = [];
        /** On-functions are called by the .tsx and set by the builder. */
        _this._onFileDeleted = function () { };
        /** Component-return functions. */
        _this.clearFiles = function () { };
        return _this;
    }
    Upload.prototype.url = function (v) { this._url = v; return this; };
    Upload.prototype.header = function (v) { this._header = v; return this; };
    Upload.prototype.onThen = function (v) { this._onThen = v; return this; };
    Upload.prototype.onCatch = function (v) { this._onCatch = v; return this; };
    Upload.prototype.fileType = function (v) { this._fileType = v; return this; };
    Upload.prototype.fileList = function (v) { this._fileList = v; return this; };
    Upload.prototype.onFileDeleted = function (v) { this._onFileDeleted = v; return this; };
    ;
    return Upload;
}(Default_1.default));
exports.default = Upload;
