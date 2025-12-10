import Formula from "./Formula";
import Action from "./Action";
import Axios from "./Axios";

import axios from 'axios';

export default class Post extends Axios {

    env: any;

    constructor() {
        super();
        this.env = JSON.parse(window.localStorage.getItem('env') ?? '{}');
    }

    _key: any;
    key(v: any) { this._key = v; return this; }

    _main: any;
    main(v: any) { this._main = v; return this; }

    _parent: any;
    parent(v: any) { this._parent = v; if (this._parent._main) this._main = this._parent._main; return this; }

    _formatData: any = (v: any) => v;
    formatData(v: any) { this._formatData = v; return this; }

    _formatParams: any = (v: any) => v;
    formatParams(v: any) { this._formatParams = v; return this; }

    copy()
    {
        let post = new Post();
        post.main(this._main);
        post.target(this._target);
        return post;
    }

    finalize(r: any, args: any, action?: Action, formula?: Formula) {
        this._success = true;
        this._onThen(r, args);
        action?._onComplete(r, args)
        formula?.onComplete();
    }

    submit(args?: any, action?: Action | undefined, formula?: Formula) {

        if (this._doIf && !this._doIf()) return;

        this._onInit();

        let target = this.targetBuild(args);
        let header = typeof this._header === 'function' ? this._header(args) : this._header;
        let params = this._formatParams(formula?.params());
        let method = 'post'

        if (target.method) method = target.method.toLowerCase();
        if (target.params) params = { ...target.params, ...params };
        if (target.target) target = target.target;

        let settings: any = {
            data: this._formatData(params),
            headers: header ?? {},
        };

        if (this.env.cachePost) {
            let store = window.localStorage.getItem(target);
            if (store) {
                this.finalize(JSON.parse(store), args, action, formula);
                return;
            }
        }

        if (method === 'delete') {
            // @ts-ignore
            axios
                .delete(target, settings)
                .then((response: any) => {
                    try { if (this.env.cachePost) window.localStorage.setItem(target, JSON.stringify(response)) } catch (e) {}
                    this.finalize(response, args, action, formula);
                })
                .catch((r) => {
                    if (r.response?.status === 403 && this._main) this._main.$config.config.access.accessViolationApi(this._main);
                    this._error = true;
                    this._onCatch(r, args);
                    action?._onError(r, args);
                    formula?.onError();
                })
        } else {
            // @ts-ignore
            axios
                [method ?? 'post']?.(target, params ?? formula?.params(), settings)
                .then((response: any) => {
                    try { if (this.env.cachePost) window.localStorage.setItem(target, JSON.stringify(response)) } catch (e) {}
                    this.finalize(response, args, action, formula);
                })
                .catch((r: any) => {
                    if (r.response?.status === 403 && this._main) this._main.$config.config.access.accessViolationApi(this._main);
                    this._error = true;
                    this._onCatch(r);
                    action?._onError();
                    formula?.onError();
                })
        }
    }
}