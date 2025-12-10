import React, {useEffect, useState} from "react";
import {Autocomplete as AutocompleteModel, Item} from "../../typescript";
import {AutoComplete as AutocompleteAnt, Input, List, Typography} from "antd";
import { Form, Select } from 'antd';
import {flushSync} from "react-dom";

const Autocomplete = (props: any) => {

    let model: AutocompleteModel = props.model;
    let access = props.main.$access(model._access);

    const [state, setState] = useState<any>({ value: undefined, dataSource: [] });
    const [loading, setLoading] = useState<any>(false);
    const [disabled, setDisabled] = useState<any>(false);

    model._onError = () => {}
    model._onComplete = () => onChange({});

    model.onHandleClear = () => {};
    model.onHandleLoading = (value: boolean) => setLoading(value);

    model.tsxSetDisabled = (value: boolean) => setDisabled(value);
    model.tsxClear = () => onClear();

    const render = (item: Item) =>
    {
        if (!item) return ({
            id: undefined, key: undefined, value: undefined, title: undefined, object: undefined, label: (<span/>),
        });

        let obj = item.getObject();
        return {
            id: obj.id,
            key: obj.key,
            value: obj.title,
            title: obj.title,
            object: item._object,
            label: (
                <List.Item style={{ paddingLeft: 8, paddingTop: 4, paddingBottom: 0 }}>
                    <List.Item.Meta
                        title={<Typography>{ obj._render ? obj._render(model) : obj.title }</Typography>}
                        description={<Typography.Paragraph style={{ marginBottom: 4 }}>{obj.text}</Typography.Paragraph>}
                    />
                </List.Item>
            ),
        };
    };

    const onChange = ({ value, object, dataSource }: any, settings?: any) =>
    {
        model._defaultObject = { value: value, object: object, dataSource: dataSource ?? model._get._data }

        if (model._formula) model._formula.value(model, model._defaultObject);

        if (!settings?.ignoreOnChange) {
            model._onChange?.(model._defaultObject);
        }

        if (!settings?.ignoreSetState) {
            setState({
                value: value,
                dataSource: model._defaultObject.dataSource?.map((r: Item) => render(r)) ?? []
            });
        }

        /** Debug purposes */
        if (model._useCache && model._key) {
            window.localStorage.setItem(`autocomplete:${model._key}`, JSON.stringify(model._defaultObject));
        }
    };

    const onSearch = (value: any) =>
    {
        if (value.length > 2) {
            model.refresh(value);
        }
    };

    const onUpdate = () =>
    {
        setState({
            value: state.value,
            dataSource: model._get._data?.map((r: Item) => render(r)) ?? []
        });
    };

    const onClear = () => {
        setState({
            value: undefined,
            dataSource: []
        });
    };

    const onStart = () =>
    {
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
        // TODO: If condition try to remove this, this is called with data as undefined
        return model._get._alter(data?.map((t: any) => t?._object));
    }

    useEffect(() => {
        if (model._useCache && model._key) model.defaultFromCache();
        onStart();
    }, [])

    return (
        <Form.Item name={props.model._key} style={model._styleForm ?? {}}>
            <AutocompleteAnt
                style={{width: '100%'}}
                searchValue={state.value}
                options={state.dataSource}
                disabled={loading || disabled || !access.access}
                allowClear={true}
                onSearch={onSearch}
                onSelect={(value, object) => onChange({ value: value, object: object })}
                onClear={onClear}
            >
            </AutocompleteAnt>
        </Form.Item>
    );
}

export default Autocomplete;