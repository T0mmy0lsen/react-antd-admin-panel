import Axios from "./Axios";

import axios from 'axios';

export default class Get extends Axios {

    _env: any;
    constructor() {
        super();
        this._env = JSON.parse(window.localStorage.getItem('env') ?? '{}');
    }

    _key: any;
    key(v: any) {
        this._key = v;
        return this;
    }

    _main: any;
    main(v: any) {
        this._main = v;
        return this;
    }

    _cache: boolean = false;
    cache(v: any) {
        this._cache = v;
        return this;
    }

    _parent: any;
    parent(v: any) {
        this._parent = v;
        if (this._parent._main) this._main = this._parent._main;
        return this;
    }

    _mock: any;
    mock(v: any) {
        this._mock = v;
        return this
    }

    _data: any;
    data() {
        if (this._mock) return this._mock;
        return this._data
    }

    copy()
    {
        let get = new Get();
        get.main(this._main);
        get.target(this._target);
        return get;
    }

    finalize(response: any, args?: any, callback?: any)
    {
        if (this._mock && this._data) {
            console.log("The request succeeded and you're mocking your data, so you can only get your mocked data trough data(). Remove your mock() data to disable this functionality.");
        }

        this._data = this._alter ? this._alter(response.data, args) : response.data;
        this._success = true;

        this._onThen(response, this._data, args);
        this._onComplete(response, this._data, args);

        if (this._parent) {
            this._parent._onThen?.(response, this._data, args);
            this._parent._onComplete?.(response, this._data, args);
        }

        callback?.(response);
    }

    get(args: any = undefined, callback: any = undefined) {

        if (this._doIf && !this._doIf()) return;

        let target = this.targetBuild(args);

        let header = typeof this._header === 'function' ? this._header(args) : this._header;
        let params = undefined;
        let auth = undefined;
        let method = 'get';

        if (target.method) method = target.method.toLowerCase();
        if (target.params) params = target.params;
        if (target.target) target = target.target;
        if (target.auth) auth = target.auth;

        let settings: any = {};
        if (!!auth) settings['auth'] = auth;
        if (!!params) settings['params'] = params;
        if (!!header) settings['headers'] = header;

        if (this._env.cacheGet) {
            let store = window.localStorage.getItem(target);
            if (store) {
                this.finalize(JSON.parse(store), args, callback);
                return;
            }
        }

        axios[method](target, settings).then((response: any) => {
            try { if (this._env.cacheGet) window.localStorage.setItem(target, JSON.stringify(response)) } catch (e) {}
            this.finalize(response, args, callback)
        })
        .catch((e: any) => {
            console.log(e);
            if (!this._mock) {
                if (e.response?.status === 403 && this._main) this._main.$config.config.access?.accessViolationApi?.(this._main);
                if (this._fail) {
                    console.log('Get: failed - using default.', this._fail);
                    this.finalize({ data: this._fail })
                } else {
                    this._error = true;
                    this._onCatch?.(e, args);
                    this._onError?.(e, args);
                }
            } else {
                console.log("The request failed and you're mocking your data, so axios.catch() is ignored. Remove your mock() data to disable this functionality.");
            }
        });
    }
}