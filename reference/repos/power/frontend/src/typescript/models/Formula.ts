import {Dictionary} from "../utils/Dictionary";
import Value from "./Value";
import Post from "./Post";
import Action from "./Action";
import {IFormular, IFormularCreatorElements, IFormularValue} from "../../classes";
import ItemValue from "./builder/ItemValue";
import {getConfigValue, hasConfigValue} from "../../helpers";

export default class Formula {

    _values: Dictionary<any> = {};
    _defaults: Dictionary<any> = {};
    _elements: Dictionary<any> = {};

    constructor(post: Post) {
        this._post = post;
    }

    getIsAllRequiredFieldsFilled() {
        let isAllFilled = true;
        Object.keys(this._elements).forEach((r: string) => {
            let elementIsRequired = getConfigValue(this._elements[r].configs, 'required') === 1;
            console.log('elementIsRequired', this._elements[r], elementIsRequired)
            if (elementIsRequired && !this._values[r]?.value?.hasValue()) {
                isAllFilled = false;
            }
        });
        console.log('isAllFilled', isAllFilled)
        return isAllFilled;
    }

    _onChange: any = () => {};
    onChange(v: any) {
        this._onChange = v;
        return this;
    }

    onComplete() {
        this._action?.callCompletes();
    }

    onError() {
        this._action?.callErrors();
    }

    register(v: any) {
        if (v._key) this._defaults[v._key] = v;
    }

    setValuesFromFormular(formular: IFormular) {
        formular.formular_values.forEach((r: IFormularValue) => {
            this.registerValue(r);
        })
        formular.formular_creator.elements.forEach((r: IFormularCreatorElements) => {
            this.registerElement(r);
        });
    }

    value(model: any) {
        this._values[model._key] = {
            model: model,
            value: model._value,
        };
        this._onChange(this);
    }

    values(model: any) {
        this._values[model._key] = {
            model: model,
            values: model._values,
        };
        this._onChange(this);
    }

    setValueByKey(key: any, value: any) {
        let v = new ItemValue()
        v._id = value;
        this._values[key] = {
            model: undefined,
            value: v
        };
    }

    _post: Post;
    post(post: Post) { this._post = post; return this; }

    _action: any;
    action(action: Action) { this._action = action; return this; }

    submit(args?: any, action?: Action) {
        this._post.submit(args, action, this);
    }

    params() {
        let form: any = {};
        Object.keys(this._values).forEach((r: string) => {
            if (r === 'undefined') return;
            if (this._values[r].value) form[r] = this._values[r].value.getFormsValue()
            if (this._values[r].values) form[r] = this._values[r].values.map((v: ItemValue) => v.getFormsValue())
        });
        return form;
    }

    registerValue(r: IFormularValue) {
        if (r.value) {
            this._values[r.formular_creator_element_id] = {
                model: undefined,
                value: new ItemValue({
                    id: r.value.id,
                    value: r.value.value_int?.value ?? r.value.value_text?.value ?? r.value.value_datetime?.value ?? r.value.value_option?.id,
                    description: r.value.value_int?.value.toString() ?? r.value.value_text?.value ?? r.value.value_datetime?.value ?? r.value.value_option?.value
                })
            }
        }
    }

    registerElement(r: IFormularCreatorElements) {
        this._elements[r.id] = r;
        let elementIsRequired = hasConfigValue(r.configs, 'required');
        if (elementIsRequired) {
            let elementIsRequiredValue = getConfigValue(r.configs, 'required');
            console.log('elementIsRequired', elementIsRequiredValue)
        }
    }
}