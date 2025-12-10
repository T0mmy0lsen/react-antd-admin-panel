import {Dictionary} from "../utils/Dictionary";
import Value from "./Value";
import Post from "./Post";
import Action from "./Action";

export default class Formula {

    _values: Dictionary<Value> = {};
    _hidden: Value[] = [];

    constructor(post: Post) {
        this._post = post;
    }

    // Only registered if the defaultValue-method is set on the .tsx and a default value is set on the .ts
    value(model: any, value: any)
    {
        if (value === undefined) {
            return;
        }

        if (!model._key) {
            this._hidden.push(new Value().model(model));
            return;
        }

        if (this._values[model._key]) {
            this._values[model._key].set(value);
            this._values[model._key].model(model);
        } else {
            this._values[model._key] = new Value();
            this.value(model, value);
        }
    }

    _action: any;
    action(action: Action) { this._action = action; return this; }

    _post: Post;
    post(post: Post) { this._post = post; return this; }

    submit(args?: any, action?: Action) {
        this._post.submit(args, action, this);
    }

    onComplete() {
        this._action?.callCompletes();
    }

    onError() {
        this._action?.callErrors();
    }

    params() {
        let form: any = {};
        Object.keys(this._values).forEach((r: string) => form[r] = this._values[r].get());
        return form;
    }

    valuesOnReset() {
        Object.keys(this._values).forEach((r: string) => this._values[r]._model.clearSelf?.());
        this._hidden.forEach((r: any) => r._model.clearSelf?.());
    }
}