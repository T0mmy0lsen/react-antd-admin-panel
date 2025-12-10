import React, {useState} from "react";

import CheckboxModel from "../../typescript/models/builder/Checkbox";
import {Checkbox as CheckboxAnt} from "antd";
import {Form} from 'antd';
import {Access, Item} from "../../typescript";

const Checkbox = (props: any) => {

    let model: CheckboxModel = props.model;
    let [checked, setChecked] = useState(model._default ?? false);

    const onChange = (value: any) => {

        console.log(value)

        let historyKey = model.history(value);

        let finalize = (value: any) => {
            model._data = value;
            model._default = value;
            if (model._formula) model.value(value);
            setChecked(value);
        }

        if (model._onChangeNext) {
            model._onChangeNext(value, finalize)
        } else {
            finalize(value);
            model._onChange?.(value, historyKey);
        }
    };

    const onClear = () => {
        model._data = undefined;
        if (model._formula) model.value(undefined);
    };

    model._onError = () => onClear();
    model._onComplete = () => onClear();

    // Register the defaultValue to the formula.
    if (model._default) {
        model._data = model._default;
        model._historyFirstKey = model.history(model._data);
        if (model._formula) {
            model.value(model._default);
        }
    }

    return (
        <div style={ model._style ?? {}}>
            <Form.Item style={{ ...model._styleForm ?? {}, ...{ marginBottom: 0 }} ?? { marginBottom: 0 }}>
                <CheckboxAnt.Group
                    style={{ marginBottom: 12 }}
                    value={checked}
                    disabled={model._disabled || new Access(props.main).simple(model)}
                    onChange={onChange}
                    options={model._fields.map((r: Item) => {
                        let item = r.getObject();
                        item['disabled'] = new Access(props.main).simple(r)
                        return item;
                    })}
                >{props.model._title}</CheckboxAnt.Group>
                { model._required && model._data === undefined && <div style={{ color: '#ff4d4f', fontSize: 14, fontWeight: 300, paddingTop: 6, paddingBottom: 12 }}>Required field</div>
                || <div style={{ paddingTop: 12 }}/>
                }
            </Form.Item>
        </div>
    );
}

export default Checkbox;