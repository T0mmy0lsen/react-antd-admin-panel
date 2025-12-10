import React, {useEffect, useState} from "react";

import RadioModel from "../../typescript/models/builder/Radio";
import {Item} from "../../typescript";
import {Radio as RadioAnt} from "antd";
import {Form} from 'antd';

const Radio = (props: any) => {

    let model: RadioModel = props.model;

    let [state, setState] = useState({ value: undefined });
    let [loading, setLoading] = useState(false);
    let [disabled, setDisabled] = useState(model._disabled ?? false);

    model.tsxSetDisabled = (value: boolean) => setDisabled(value);
    model.tsxClear = () => onClear();

    const onChange = ({ value }: any, settings?: any) =>
    {
        model._defaultObject = { value: value }

        if (model._formula) model._formula.value(model._defaultObject);

        if (!settings?.ignoreOnChange) {
            model._onChange?.(model._defaultObject);
        }

        if (!settings?.ignoreSetState) {
            setState({ value: value });
        }

        /** Debug purposes */
        if (model._useCache && model._key) {
            window.localStorage.setItem(`radio:${model._key}`, JSON.stringify(model._defaultObject));
        }
    };

    const onUpdate = () => {};

    const onClear = () => onChange({});

    const onStart = () =>
    {
        if (model._defaultObject) {
            let data = model._defaultObject;
            if (model._formula) model.value(data.value);
            if (data.dataSource) data.dataSource = dataSourceAlter(data.dataSource);
            setTimeout(() => onChange(data, {
                ignoreOnChange: model._ignoreOnChange,
                ignoreSetState: model._ignoreSetState,
            }), 0);
        } else {
            onClear();
        }
    }

    const dataSourceAlter = (data: any) => {
        return data;
    }

    useEffect(() => {
        if (model._useCache && model._key) model.defaultFromCache();
        onStart();
    }, [])

    return (
        /** TODO */
        <div style={ model._style ?? {}}>
            <Form.Item style={{ marginBottom: 0 }}>
                <RadioAnt.Group
                    value={state.value}
                    disabled={disabled || loading}
                    onChange={(value: any) => onChange({ value: value.target.value })}
                >
                    {model._fields.map((r: Item) => <RadioAnt
                        key={r.getObject().value}
                        value={r.getObject().value}
                        style={{display: 'block', lineHeight: '30px'}}
                    >{r._render?.() ?? r.getObject().title ?? r.getObject().label}</RadioAnt>)}
                </RadioAnt.Group>
                { model._required && model._data === undefined && <div style={{ color: '#ff4d4f', fontSize: 14, fontWeight: 300, paddingTop: 6, paddingBottom: 12 }}>Required field</div>
                    || <div style={{ paddingTop: 12 }}/>
                }
            </Form.Item>
        </div>
    );
}

export default Radio;