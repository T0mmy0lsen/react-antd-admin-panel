"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Cycle_1 = require("../models/Cycle");
var Controller = /** @class */ (function () {
    function Controller(app) {
        this._cycles = {};
        this.main = app;
    }
    Controller.prototype.onCycle = function (route, next, failed) {
        var cycle = this.registerCycle(new Cycle_1.default(this.main, route, next, failed));
        this.main.$store(cycle, 'cycle');
        cycle.handle();
    };
    Controller.prototype.onCycleFailed = function (cycle) {
        this.main.$map.$loading(false);
        if (cycle._failed) {
            cycle._failed();
        }
        else {
            this.main.$config.config.access.accessViolationRoute(this.main, cycle);
        }
    };
    Controller.prototype.onCycleComplete = function (cycle) {
        var _this = this;
        setTimeout(function () {
            cycle._next();
            _this.main.$map.$loading(false);
            _this.main.$store(cycle._path, 'path');
        }, 100);
    };
    Controller.prototype.isDebug = function () {
        var _a;
        return (_a = this.main.$config.config) === null || _a === void 0 ? void 0 : _a.debugLevel;
    };
    Controller.prototype.registerCycle = function (cycle) {
        if (this._cycles[cycle._key]) {
            this._cycles[cycle._key].push(cycle);
        }
        else {
            this._cycles[cycle._key] = [cycle];
        }
        return cycle;
    };
    return Controller;
}());
exports.default = Controller;
