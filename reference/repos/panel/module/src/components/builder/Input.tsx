import React, {useState} from "react";

import {Input as InputModel} from "../../typescript";
import {Input as InputAnt} from "antd";
import { Form } from 'antd';
import Section from "../Section";

const Input = (props: any) => {

    let model: InputModel = props.model;
    let access = props.main.$access(model._access);
    let addProps: any = {};

    const [value, setValue] = useState<any>(model._default ?? '');

    if (model._onPressEnter) addProps['onPressEnter'] = model._onPressEnter;
    if (model._suffix) addProps['suffix'] = <Section main={props.main} section={model._suffix}/>;

    const onChange = (e: any) =>
    {
        let value = e.target.value;
        model._data = value;
        model._default = value;
        if (model._formula) model.value(value);
        model._onChange?.(value, model._index);
        setValue(value)
    };

    const onClear = () => {
        if (model._formula) model.value(undefined);
        model._data = undefined;
        setValue(undefined);
    };

    model.tsxClear = () => onClear();

    // Register the defaultValue to the formula.
    if (model._default) {
        model._data = model._default;
        if (model._formula) {
            model.value(model._default);
        }
    }

    return (
        <Form.Item
            style={{ marginBottom: 0, width: '100%' }}
            wrapperCol={{ sm: 24 }}
        >
            <InputAnt
                value={ value }
                style={{ width: '100%', marginBottom: 4 }}
                disabled={ model._disabled || !access.access }
                placeholder={ props.model._label ?? '' }
                size={ props.size ?? 'large' }
                onChange={ onChange }
                autoFocus={ model._autofocus }
                readOnly={ model._readOnly }
                allowClear
                { ...addProps }
            />
            { model._required && model._data === undefined && <div style={{ color: '#ff4d4f', fontSize: 14, fontWeight: 300, paddingTop: 6, paddingBottom: 12 }}>Required field</div>
                || <div style={{ paddingTop: 12 }}/>
            }
        </Form.Item>
    );
}

export default Input;