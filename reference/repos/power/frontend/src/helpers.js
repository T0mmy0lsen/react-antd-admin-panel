"use strict";
// helpers.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.lightenColor = exports.darkenColor = exports.findByKey = exports.addCondition = exports.downloadExcelFile = exports.createAndOpenFormular = exports.hasConfigValue = exports.getConfigValue = exports.getInitials = exports.getSortedElements = void 0;
var typescript_1 = require("./typescript");
var getSortedElements = function (list) {
    list = list.filter(function (e) { return !e.parent_id; });
    list = list.sort(function (a, b) {
        // Compare by 'section' first
        if (a.section < b.section)
            return -1;
        if (a.section > b.section)
            return 1;
        // If 'section' is equal, compare by 'group'
        if (a.group < b.group)
            return -1;
        if (a.group > b.group)
            return 1;
        // If 'group' is also equal, finally compare by 'order'
        return a.order - b.order;
    });
    return list;
};
exports.getSortedElements = getSortedElements;
var getInitials = function (name) {
    var words = name.trim().split(' ');
    if (words.length === 1) {
        // If there's only one word, use the first two letters of this word
        return words[0].substring(0, 2).toUpperCase();
    }
    else {
        // Take the first letter of the first two words
        return (words[0][0] + words[1][0]).toUpperCase();
    }
};
exports.getInitials = getInitials;
var getConfigValue = function (configs, value) {
    var _a, _b;
    return (_b = (_a = configs.find(function (c) {
        return c.config.config === value;
    })) === null || _a === void 0 ? void 0 : _a.inputs[0].value.value_boolean.value) !== null && _b !== void 0 ? _b : undefined;
};
exports.getConfigValue = getConfigValue;
var hasConfigValue = function (configs, value) {
    return configs.some(function (c) {
        return c.config.config === value;
    });
};
exports.hasConfigValue = hasConfigValue;
var createAndOpenFormular = function (main, id, withTrigger, withTriggerFormularId) {
    if (withTrigger === void 0) { withTrigger = false; }
    if (withTriggerFormularId === void 0) { withTriggerFormularId = 0; }
    if (id) {
        new typescript_1.Post()
            .target(function () { return ({
            target: '/api/formularCreate',
            params: { id: id, withTrigger: withTrigger, withTriggerFormularId: withTriggerFormularId }
        }); })
            .onThen(function (e) {
            main.$route("/formular?id=" + e.data.id);
        })
            .submit();
    }
};
exports.createAndOpenFormular = createAndOpenFormular;
var downloadExcelFile = function (id, onThen) {
    var get = new typescript_1.Get();
    get.target(function () { return ({
        target: '/api/formularsByDataistExportExcel',
        params: { id: id },
        responseType: 'blob'
    }); })
        .onThen(function (response) {
        onThen();
    })
        .get(undefined, undefined, "formular.".concat(id, ".xlsx"));
};
exports.downloadExcelFile = downloadExcelFile;
var addCondition = function (elementToShow, formula, initialState) {
    if (formula === void 0) { formula = undefined; }
    if (initialState === void 0) { initialState = function () { return false; }; }
    var condition = new typescript_1.Conditions().default(initialState);
    var conditionFalse = new typescript_1.ConditionsItem()
        .condition(function (v) { return !v; })
        .content(function (next) { return next(new typescript_1.Section()); });
    var conditionTrue = new typescript_1.ConditionsItem()
        .condition(function (v) { return v; })
        .content(function (next) {
        var sectionWithConditionCreator = new typescript_1.Section()
            .add(typeof elementToShow === 'function' ? elementToShow() : elementToShow)
            .init();
        if (formula) {
            next(new typescript_1.Section()
                .formula(formula !== null && formula !== void 0 ? formula : undefined)
                .add(sectionWithConditionCreator)
                .init());
        }
        else {
            next(new typescript_1.Section().add(sectionWithConditionCreator));
        }
    });
    condition.add(conditionFalse);
    condition.add(conditionTrue);
    condition.restore(initialState);
    return condition;
};
exports.addCondition = addCondition;
var findByKey = function (arr, key) { return arr.find(function (obj) { return obj.key === key; }); };
exports.findByKey = findByKey;
// Utility function to darken colors (you might need to adjust it to your needs)
var darkenColor = function (color, amount) {
    if (amount === void 0) { amount = 0.7; }
    if (color[0] === '#')
        color = color.slice(1);
    var _a = color.match(/\w\w/g).map(function (x) { return parseInt(x, 16) * amount; }), r = _a[0], g = _a[1], b = _a[2];
    return "#".concat([r, g, b].map(function (x) { return Math.round(x).toString(16).padStart(2, '0'); }).join(''));
};
exports.darkenColor = darkenColor;
var lightenColor = function (color, amount) {
    if (amount === void 0) { amount = 0.7; }
    if (color[0] === '#')
        color = color.slice(1);
    // Parse the hex color string into its RGB components
    var _a = color.match(/\w\w/g).map(function (x) { return parseInt(x, 16); }), r = _a[0], g = _a[1], b = _a[2];
    // Calculate the new color component values
    r = Math.min(255, r + (255 - r) * amount);
    g = Math.min(255, g + (255 - g) * amount);
    b = Math.min(255, b + (255 - b) * amount);
    // Convert the RGB components back into a hex color string
    return "#".concat([r, g, b].map(function (x) { return Math.round(x).toString(16).padStart(2, '0'); }).join(''));
};
exports.lightenColor = lightenColor;
