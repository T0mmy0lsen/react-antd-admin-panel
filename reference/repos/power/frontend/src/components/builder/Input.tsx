import React, {useState} from "react";

import {Input as InputModel, ItemValue} from "../../typescript";
import {Button, Input as InputAnt, Tooltip} from "antd";
import { Form } from 'antd';
import Section from "../Section";
import { CopyOutlined } from "@ant-design/icons";

const Input = (props: any) => {

    let model: InputModel = props.model;
    let access = props.main.$access(model._access);
    let addProps: any = {};

    const [value, setValue] = useState<any>(model.getValue() ?? '');

    if (model._onPressEnter) addProps['onPressEnter'] = model._onPressEnter;
    if (model._suffix) addProps['suffix'] = <Section main={props.main} section={model._suffix}/>;

    const onChange = (e: any) =>
    {
        // Get the value from the event.
        let value = e.target.value;
        model.setValue(value)
        setValue(value)
    };

    const onClear = () =>
    {
        model.setValue(undefined);
        setValue(undefined);
    };

    model.tsxClear = () => onClear();

    // Inside your Input component
    model.tsxSetValue = (value: any) => {
        model.setValue(undefined);
        setValue(value);
    };

    // Register the defaultValue to the formula.
    if (model._default) {
        model.setValue(model._default);
    }

    if (model._hidden) return null;

    return (
        <>
            <InputAnt
                value={ value }
                style={{ width: '100%', marginBottom: 4 }}
                disabled={ model._disabled || !access.access }
                placeholder={ props.model._label ?? '' }
                size={ props.size ?? 'large' }
                onChange={ onChange }
                autoFocus={ model._autofocus }
                readOnly={ model._readOnly }
                allowClear={ model._clearable ?? false }
                addonAfter={model._copyable ? 
                    <Tooltip title={model._copyable ? "Click to copy" : ""}>
                        <Button type={'link'} icon={<CopyOutlined />} onClick={() => {
                                navigator.clipboard.writeText(value)
                            }} 
                        /> 
                    </Tooltip>
                    : null}
                { ...addProps }
            />
            { model._required && model._data === undefined && <div style={{ color: '#ff4d4f', fontSize: 14, fontWeight: 300, paddingTop: 6, paddingBottom: 12 }}>Required field</div>
                || <div style={{ paddingTop: 12 }}/>
            }
        </>
    );
}

export default Input;