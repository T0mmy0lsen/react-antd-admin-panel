import {Dictionary} from "../utils/Dictionary";
import Cycle from "../models/Cycle";
import Main from "../main";

export default class Controller {

    main: Main;
    _cycles: Dictionary<Cycle[]> = {};

    constructor(app: Main) {
        this.main = app;
    }

    onCycle(route: string, next: () => void, failed: () => void) {
        let cycle: Cycle = this.registerCycle(new Cycle(this.main, route, next, failed));
        this.main.$store(cycle, 'cycle')
        cycle.handle();
    }

    onCycleFailed(cycle: Cycle) {
        this.main.$map.$loading(false);
        if (cycle._failed) {
            cycle._failed();
        } else {
            this.main.$config.config.access.accessViolationRoute(this.main, cycle);
        }
    }

    onCycleComplete(cycle: Cycle) {
        setTimeout(() => {
            cycle._next();
            this.main.$map.$loading(false);
            this.main.$store(cycle._path, 'path');
        }, 100);
    }

    isDebug() {
        return this.main.$config.config?.debugLevel;
    }

    registerCycle(cycle: Cycle): Cycle {
        if (this._cycles[cycle._key]) {
            this._cycles[cycle._key].push(cycle);
        } else {
            this._cycles[cycle._key] = [cycle];
        }
        return cycle;
    }
}