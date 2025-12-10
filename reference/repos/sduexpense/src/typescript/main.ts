import Controller from "./controllers/Controller";
import Mapping from "./utils/Mapping";
import Cycle from "./models/Cycle";
import User from "./models/User";
import Get from "./models/Get";

export default class Main {

    User: any;
    Store: any = {};
    Function: any = {};
    Controller: Controller;

    $map: Mapping;
    $root: any;
    $config: any;
    $instance: any;
    $account: any;

    _routeKey: any;
    setRouteKey(v: any) { this._routeKey = v; }

    constructor(root: any, config: any, instance: any, account: any) {
        this.$root = root;
        this.$config = config;
        this.$instance = instance
        this.$account = account
        this.$map = new Mapping();
        this.Controller = new Controller(this);
    }

    tsxErrorMessage: any = () => { console.log('[UNSET] tsxErrorMessage') };
    tsxSuccessMessage: any = () => { console.log('[UNSET] tsxSuccessMessage') };

    _setModal: any;
    $modal(v: any) { this._setModal(v) }
    setModal(v: any) { this._setModal = v; }

    _setModalClose: any;
    $modalClose() { this._setModalClose() }
    setModalClose(v: any) { this._setModalClose = v; }

    _setModalLoading: any;
    $modalLoading(v: boolean) { this._setModalLoading(v) }
    setModalLoading(v: any) { this._setModalLoading = v; }

    _setSiderRight: any;
    setSiderRight(v: any) { this._setSiderRight = v; }

    _setSiderRightReload: any;
    setSiderRightReload(v: any) { this._setSiderRightReload = v; }

    _setSiderRightLoading: any;
    setSiderRightLoading(v: any) { this._setSiderRightLoading = v; }

    _setSiderRightClose: any;
    setSiderRightClose(v: any) { this._setSiderRightClose = v; }



    $access(access: any, cycle?: Cycle) {
        return this.$config.config.access.access(access, this, cycle);
    }

    $params(key: string, route?: string) {
        return this.$path(route)._params[key];
    }

    $mapping(key: string) {
        return this.$config.config?.mapping?.[key];
    }

    $store(data: any, key: string) {
        this.Store[key] = data;
    }

    $stored(key: string) {
        return this.Store[key];
    }

    $query(key: string, route?: string) {
        return this.$path(route)?._query?.[key];
    }

    $function(func: any, key: string) {
        if (key in this.Function) {
            console.log('Function:', key, 'already set.')
        }
        this.Function[key] = func;
    }

    $cycle(route: string) : any {
        if (!this.Controller._cycles[route]) return undefined;
        return this.Controller._cycles[route][this.Controller._cycles[route].length - 1];
    }

    $route(route: string, next: any = false, failed?: any)
    {
        if (!next) next = () => {
            this.$map.$navigate(route);
        }

        const n = next;
        next = () => {
            n();
            this._routeKey(route);
        };

        // The .ts tells .tsx to toggle a loading state.
        this.$map.$loading(true);

        // Construct a Cycle, i.e. pre-building the next page.
        this.Controller.onCycle(route, next, failed)
    }

    $get(cycle: Cycle, key: string) : Get {

        if (!cycle) {
            console.log('$data: cycle is undefined.');
            return new Get();
        }

        let search = cycle._route._gets.filter((r: Get) => {
            if (r._key) return r._key === key;
            let target: any = typeof r._target === 'string' ? r._target : r._target(cycle);
            if (typeof target !== 'string') target = target.target;
            return target === key;
        });

        return search.length ? search[0] : new Get()
    }

    $path(route?: string) {
        return this.$map.$path(route ? route : `${document.location.pathname}${document.location.search}`);
    }

    $user(user?: any) {
        if (!user) return this.User;
        this.User = new User(user);
        return this.User;
    }
}