"use strict";
exports.__esModule = true;
var Default = /** @class */ (function () {
    function Default(_class) {
        this._componentIsBuild = false;
        this._history = {};
        // What should happen to the .tsx once your /view/*.tsx calls the function.
        // This is basically the .tsx's action-interface.
        this.onHandleAdd = function () { };
        this.onHandleClear = function () { };
        this.onHandleReset = function () { };
        this.onHandleChange = function () { };
        this.onHandleSearch = function () { };
        this.onHandleToggle = function () { };
        this.onHandleLoading = function () { };
        /** */
        this.tsxHistoryRevert = function () { console.log('[UNSET] tsxHistoryRevert'); };
        this.tsxSetDisabled = function () { console.log('[UNSET] tsxSetDisabled'); };
        this.tsxSetLoading = function () { console.log('[UNSET] tsxSetLoading'); };
        this.tsxSetValue = function () { console.log('[UNSET] tsxSetValue'); };
        this.tsxClear = function () { console.log('[UNSET] tsxClear'); };
        /** */
        this._call = {};
        this._useCache = false;
        this._filterFunction = function () { return false; };
        this._access = true;
        this._required = false;
        this._disabled = false;
        this._readOnly = false;
        this._fields = [];
        // Some function to format the value before we return it.
        this._format = function (value) { return value; };
        // The Parent *.tsx-component should set this.
        this._update = function () { console.log('Update not implemented'); };
        this._onComplete = function () { };
        // For both Error and Complete, these are called by the binding Post or Get.
        this._onError = function () { };
        // These are called by the .tsx, implemented in the /view/*.tsx
        this._onClick = function () { };
        this._onChange = undefined;
        this._onChangeNext = undefined;
        this._onAfterChange = function () { };
        this._onChangeSelect = function () { };
        this._onDelete = function () { };
        // Any data we got back from the Action or Get can be placed her if needed.
        this._data = undefined;
        this._size = 24;
        this._sizeString = 'large';
        this._clearable = true;
        this._ignoreOnChange = false;
        this._ignoreSetState = false;
        this._width = '100%';
        this._class = 'undefined';
        if (_class)
            this._class = _class;
    }
    Default.prototype.history = function (v) {
        var key = Math.round(Math.random() * 10000);
        this._history[key] = { success: false, completed: false, value: v };
        return key;
    };
    Default.prototype.getFieldByClass = function (v) {
        return this._fields.find(function (r) { return r._class === v; });
    };
    Default.prototype.call = function (key, v) { this._call[key] = v; return this; };
    Default.prototype.alter = function (v) { this._alter = v; return this; };
    Default.prototype.useCache = function (v) { this._useCache = v; return this; };
    Default.prototype.filter = function (filter) { this._filter = filter; return this; };
    Default.prototype.filters = function () { return this.filterModels(this._filter, []); };
    Default.prototype.edit = function (edit) { this._editFunction = edit; return this; };
    Default.prototype.editBuild = function (node, next, main, model) {
        var _a;
        (_a = this._editFunction) === null || _a === void 0 ? void 0 : _a.call(this, node, next, main, model);
    };
    Default.prototype.show = function (show) { this._showFunction = show; return this; };
    Default.prototype.showBuild = function (node, next, main) {
        var _a;
        (_a = this._showFunction) === null || _a === void 0 ? void 0 : _a.call(this, node, next, main);
    };
    Default.prototype.filterFunction = function (func) { this._filterFunction = func; return this; };
    Default.prototype.ref = function (ref) { this._ref = ref; return this; };
    Default.prototype.key = function (key) { this._key = key; return this; };
    Default.prototype.index = function (index) { this._index = index; return this; };
    Default.prototype.style = function (v) { this._style = v; return this; };
    Default.prototype.styleForm = function (v) { this._styleForm = v; return this; };
    Default.prototype.access = function (access) { this._access = access; return this; };
    Default.prototype.accessLevel = function (feature, level) { this._accessLevel = { feature: feature, level: level }; return this; };
    Default.prototype.label = function (label) { this._label = label; return this; };
    Default.prototype.required = function (v) { this._required = !!v; return this; };
    Default.prototype.disabled = function (v) { this._disabled = !!v; return this; };
    Default.prototype.readOnly = function (v) { this._readOnly = !!v; return this; };
    Default.prototype["default"] = function (v) { this._defaultObject = v; this._default = v; return this; };
    Default.prototype.add = function (v) { this._fields.push(v); return this; };
    Default.prototype.addMore = function (v) {
        var _this = this;
        v.forEach(function (r) { return _this._fields.push(r); });
        return this;
    };
    Default.prototype.formula = function (formula) {
        this._formula = formula;
        this._formulaIsRoot = true;
        return this;
    };
    Default.prototype.formulaSetChildren = function (formula) {
        var _this = this;
        var _a, _b;
        this._formula = (_a = this._formula) !== null && _a !== void 0 ? _a : formula;
        (_b = this._action) === null || _b === void 0 ? void 0 : _b.formula(this._formula);
        this._fields.forEach(function (field) { var _a; if (!field._formulaIsRoot)
            (_a = field.formulaSetChildren) === null || _a === void 0 ? void 0 : _a.call(field, _this._formula); });
    };
    // Send values to the formula.
    Default.prototype.value = function (value) { this.formulaValue(value); };
    Default.prototype.params = function () { return this.formulaParams(); };
    Default.prototype.paramsRaw = function () { return this.formulaParamsRaw(); };
    Default.prototype.formulaValue = function (value) { this._formula.value(this, value); };
    Default.prototype.formulaParams = function () { return this._formula.params(); };
    Default.prototype.formulaParamsRaw = function () { return this._formula.paramsRaw(); };
    Default.prototype.section = function (section) {
        var _this = this;
        var _a;
        this._section = section;
        (_a = this._action) === null || _a === void 0 ? void 0 : _a.section(this._section);
        this._fields.forEach(function (field) { var _a; return (_a = field.bindSection) === null || _a === void 0 ? void 0 : _a.call(field, _this._section); });
    };
    // (1) Set and do nothing.
    Default.prototype.setGet = function (v, args) { return this.get(v, args); };
    Default.prototype.get = function (func, args) {
        this._getFunction = func;
        this._get = func(args);
        return this;
    };
    // (2) Set and run the Get
    Default.prototype.fetch = function (func, args) {
        this._getFunction = func;
        this.refresh(args);
        return this;
    };
    // (3) Run a Get that is already set
    Default.prototype.refresh = function (args, callback) {
        this._get = args ? this._getFunction(args) : this._getFunction();
        // TODO: Both the GET and the calling COMPONENT should be able to call _onComplete.
        // Right now its just the calling COMPONENT, e.g. the button that set the _onComplete.
        // The button.tsx may use this to toggle its loading state.
        this._get.onComplete(this._onComplete);
        this._get.onError(this._onError);
        this._get.parent(this);
        this._get.get(args, callback);
        return this;
    };
    Default.prototype.refreshWithoutGetCall = function (args) {
        this._get.onComplete(this._onComplete);
        this._get.onError(this._onError);
        this._get.finalize(args);
        return this;
    };
    Default.prototype.refreshWithoutFunctionCall = function (args) {
        this._get.onComplete(this._onComplete);
        this._get.onError(this._onError);
        this._get.get(args);
        return this;
    };
    Default.prototype.action = function (action) { this._action = action; return this; };
    Default.prototype.format = function (func) { this._format = func; return this; };
    Default.prototype.formatValue = function (value) { return this._format(value); };
    Default.prototype.update = function (func) { this._update = func; return this; };
    Default.prototype.onDelete = function (func) { this._onDelete = func; return this; };
    Default.prototype.onAfterChange = function (func, index) { this._onAfterChange = func; this.index(index); return this; };
    Default.prototype.onChangeSelect = function (func) { this._onChangeSelect = func; return this; };
    Default.prototype.onComplete = function (func) { this._onComplete = func; return this; };
    Default.prototype.onChange = function (func) { this._onChange = func; return this; };
    Default.prototype.onChangeNext = function (func, index) { this._onChangeNext = func; this.index(index); return this; };
    Default.prototype.onClick = function (func) { this._onClick = func; return this; };
    Default.prototype.onError = function (func) { this._onError = func; return this; };
    Default.prototype.data = function (data) { this._data = data; return this; };
    Default.prototype.size = function (size) { this._size = size; return this; };
    Default.prototype.sizeString = function (sizeString) { this._sizeString = sizeString; return this; };
    Default.prototype.clearable = function (v) { this._clearable = v; return this; };
    Default.prototype.ignoreOnChange = function (v) { this._ignoreOnChange = v; return this; };
    Default.prototype.ignoreSetState = function (v) { this._ignoreSetState = v; return this; };
    Default.prototype.width = function (width) { this._width = width; return this; };
    Default.prototype.component = function (component, args) {
        this._component = component;
        this._componentArgs = args;
        return this;
    };
    Default.prototype.defaultFromCache = function () {
        var store = window.localStorage.getItem("".concat(this._class.toLowerCase(), ":").concat(this._key));
        this._defaultObject = store ? JSON.parse(store) : this._defaultObject;
        return this;
    };
    Default.prototype.filterModels = function (el, filters) {
        var _this = this;
        if (filters === void 0) { filters = []; }
        if (!el)
            return filters;
        el._fields.forEach(function (r) {
            filters.push(r);
            _this.filterModels(r, filters);
        });
        return filters;
    };
    return Default;
}());
exports["default"] = Default;
