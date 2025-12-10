import React, {useState} from "react";

import {Input as InputModel} from "../../typescript";
import {Input as InputAnt} from "antd";
import { Form } from 'antd';
import Section from "../Section";
import TextArea from "antd/lib/input/TextArea";

const Input = (props: any) => {

    let model: InputModel = props.model;
    let access = props.main.$access(model._access);
    let addProps: any = {};

    const [value, setValue] = useState<any>(model._default ?? '');
    const [showHelperText, setShowHelperText] = useState<any>(false);

    if (model._onPressEnter) addProps['onPressEnter'] = model._onPressEnter;
    if (model._suffix) addProps['suffix'] = <Section main={props.main} section={model._suffix}/>;
    if (model._addonAfter) addProps['addonAfter'] = model._addonAfter

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
    model.tsxShowHelperText = (e: any) => setShowHelperText(e)

    // Register the defaultValue to the formula.
    if (model._default) {
        model._data = model._default;
        if (model._formula) {
            model.value(model._default);
        }
    }

    if (model._hidden) {
        return (<></>)
    }

    return (
        <Form.Item
            style={{ marginBottom: 0, width: '100%' }}
            wrapperCol={{ sm: 24 }}
        >
            { props.model._label ? <div style={{ margin: '0px 0px 4px 12px' }}>{ props.model._label }</div> : null }
            { !model._textarea ? <InputAnt
                value={ value }
                style={{ width: '100%', marginBottom: 12 }}
                disabled={ model._disabled || !access.access }
                placeholder={ (model._required && (model._data === undefined || model._data == ''))
                    ? props.model._label + ' skal udfyldes'
                    : props.model._label ?? '' }
                size={ props.size ?? 'large' }
                onChange={ onChange }
                autoFocus={ model._autofocus }
                readOnly={ model._readOnly }
                allowClear
                status={ showHelperText.status ? showHelperText.status : (model._required && (model._data === undefined || model._data == '')) ? 'warning' : false }
                { ...addProps }
            /> : <TextArea
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
            ></TextArea> }
            { showHelperText && showHelperText.status == 'error' && <div style={{ color: '#ff4d4f', fontSize: 14, fontWeight: 300, marginTop: -4, marginLeft: 12, paddingBottom: 12 }}>{ showHelperText.text }</div> }
            { showHelperText && showHelperText.status == 'success' && <div style={{ color: '#27730f', fontSize: 14, fontWeight: 300, marginTop: -4, marginLeft: 12, paddingBottom: 12 }}>{ showHelperText.text }</div> }
        </Form.Item>
    );
}

export default Input;