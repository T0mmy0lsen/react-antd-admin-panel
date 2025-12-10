import Get from "./Get";
import Post from "./Post";
import Path from "./Path";

export default class Route {

    _key: any;
    _path: any;
    _gets: Get[] = [];
    _posts: Post[] = [];
    _exact: boolean = false;
    _access: any = true;
    Component: any;

    constructor() {

    }

    copy() {
        let route = new Route();
        route._path = this._path.copy();
        route._gets = this._gets.map(r => r.copy());
        route.Component = this.Component;
        return route;
    }

    key(key: string) {
        this._key = key;
        this._path = new Path({ matchedPath: key });
        return this;
    }

    get(value: Get) {
        this._gets.push(value);
        return this;
    }

    post(value: Post) {
        this._posts.push(value);
        return this;
    }

    exact() {
        this._exact = true;
        return this;
    }

    component(value: any) {
        this.Component = value;
        return this;
    }

    access(value: any) {
        this._access = value;
        return this;
    }
}