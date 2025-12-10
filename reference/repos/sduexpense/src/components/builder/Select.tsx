import React, {useEffect, useState} from "react";
import {Item, Select as SelectModel} from "../../typescript";
import {Form, Select as SelectAnt} from 'antd';

const Inner = (props: any) => {
    if (props.item.text) {
        return (
            <div>
                <span style={{ marginRight: 4 }}>{props.item.title}</span><br/>
                <div style={{ marginTop: -2, fontSize: 12, width: 0, overflow: 'visible' }}>{props.item.text}</div>
            </div>
        )
    }
    return (
        <span>{props.item.title ?? props.item.label}</span>
    )
}

const Select = (props: any) => {

    let model: SelectModel = props.model;

    const [state, setState] = useState<any>({
        value: undefined,
        object: undefined,
        loading: false,
        disabled: model._disabled ?? false,
        dataSource: []
    });

    let addProps: any = {};

    model._onError = () => {}
    model._onComplete = () => onClear();

    model.onHandleClear = () => onClear();
    model.onHandleLoading = (value: boolean) => setState({ ...state, ...{ loading: value }});

    model.tsxSetDisabled = (value: boolean) => setState({ ...state, ...{ disabled: value }});
    model.tsxSetValue = (v: any) => setState({ ...state, ...{ value: v, dataSource: state.dataSource }})
    model.tsxClear = () => onClear();

    const onChange = ({ value, object, dataSource }: any, settings?: any) =>
    {
        let data: any = [];

        switch (true) {
            case !!dataSource?.length:
                data = dataSource;
                break;
            case !!state.dataSource?.length:
                data = state.dataSource;
                break;
            case !!model._fields?.length:
                data = model._fields;
                break;
            default:
                break;
        }

        model._defaultObject = {
            value: value,
            object: data.find((r: Item) => r.getObject().value === value),
            dataSource: data.map((r: any) => r._object),
        }

        if (model._formula) model._formula.value(model, model._defaultObject);

        if (!settings?.ignoreOnChange) {
            model._onChange?.(model._defaultObject);
        }

        if (!settings?.ignoreSetState) {
            setState({ ...state, ...{
                value: value,
                dataSource: data,
            }});
        }

        /** Debug purposes */
        if (model._useCache && model._key) {
            window.localStorage.setItem(`select:${model._key}`, JSON.stringify(model._defaultObject));
        }
    }

    const onClear = () => onChange({})

    const onStart = () =>
    {
        console.log('Select onStart', model._defaultObject);
        if (model._defaultObject) {
            let data = model._defaultObject;
            if (model._formula) model._formula.value(model, model._defaultObject);
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
        return model._options?.(data);
    }

    useEffect(() => {
        if (model._useCache && model._key) model.defaultFromCache();
        onStart();
    }, [])

    return (
        <Form.Item style={ model._style ?? { marginBottom: 0 }}>
            { props.model._label ? <div style={{ margin: '0px 0px 4px 12px' }}>{ props.model._label }</div> : null }
            <SelectAnt
                placeholder={ model._label ?? undefined }
                disabled={ state.loading || state.disabled }
                style={{ width: model._width ?? '100%' }}
                size={ model._sizeString ?? 'large' }
                allowClear={model._clearable}
                value={state.value}
                onChange={(value, object) => onChange({ value: value, object: object })}
                onClear={onClear}
                {...addProps}
            >
                { model._fields.map((r: Item) => {
                    let obj = r.getObject();
                    if (!props.main.$access(obj._access ?? true)) return null;
                    return (
                        <SelectAnt.Option key={obj.key} value={obj.value}>
                            <Inner item={obj}/>
                        </SelectAnt.Option>
                    )
                })}
            </SelectAnt>
            { model._required && model._data === undefined && <div style={{ color: '#ff4d4f', fontSize: 14, fontWeight: 300, paddingTop: 6, paddingBottom: 12 }}>Required field</div>
                || <div style={{ paddingTop: 12 }}/>
            }
        </Form.Item>
    );
}

export default Select;