import React, {useEffect, useState} from "react";
import {Autocomplete as AutocompleteModel, ItemValue} from "../../typescript";
import {AutoComplete as AutocompleteAnt, Col, Input, List, Row, Typography} from "antd";
import {CheckOutlined, FrownOutlined, LoadingOutlined, SmileOutlined, StopOutlined} from "@ant-design/icons";
import {SearchOutlined} from "@ant-design/icons/lib";
import {ITransform, IValue, IValueOption} from "../../classes";

const highlightText = (item: ItemValue, highlight: string) => {
    let text = item.getDescription();
    const parts = text?.split(new RegExp(`(${highlight})`, 'gi')) ?? [];
    return (
        <span>
            {parts.map((part, index) =>
                part.toLowerCase() === highlight.toLowerCase()
                    ? <span key={index} style={{ backgroundColor: '#f5e5c4' }}>{part}</span>
                    : part
            )}
        </span>
    );
};

const Autocomplete = (props: any) => {

    let model: AutocompleteModel = props.model;
    let access = props.main.$access(model._access);

    const [state, setState] = useState<any>({
        autocompleteSearched: model.getDescription(),
        renders: [],
        values: [],
    });

    const [disabled, setDisabled] = useState<any>(false);
    const [loading, setLoading] = useState<any>(false);
    const [success, setSuccess] = useState<any>(false);
    const [error, setError] = useState<any>(false);

    model._onError = () => {}
    model._onComplete = () =>
    {
        let data: ({ autocompleteSearched: string, values: IValueOption[] }) = model._get._data;

        model.addMore(data.values);

        let items: ItemValue[] = data.values.map((v: IValueOption) => new ItemValue({
            id: v.id,
            value: v.id.toString(),
            description: v.value,
        }))

        let renders = items.map((i: ItemValue) => render(i, data.autocompleteSearched))

        setState({
            autocompleteSearched: data.autocompleteSearched,
            items: items,
            renders: renders
        });

        setLoading(false);

        if (items.length) {
            setSuccess(true);
            setError(false);
        } else {
            setSuccess(false);
            setError(true);
        }
    };

    model.onHandleClear = () => {};
    model.onHandleLoading = (value: boolean) => setLoading(value);

    model.tsxSetDisabled = (value: boolean) => setDisabled(value);
    model.tsxSetLoading = (value: boolean) => setLoading(value);
    model.tsxSetSuccess = (value: boolean) => setSuccess(value);
    model.tsxSetError = (value: boolean) => setError(value);
    model.tsxClear = () => onClear();

    model.tsxSetFields = (fields: IValueOption[]) => {

        model.addMore(fields);

        let items: ItemValue[] = fields.map((v: IValueOption) => new ItemValue({
            id: v.id,
            value: v.id.toString(),
            description: v.value,
        }))

        let renders = items.map((i: ItemValue) => render(i, state.autocompleteSearched))

        setState({
            autocompleteSearched: state.autocompleteSearched,
            items: items,
            renders: renders
        });
    }

    const render = (item: ItemValue, autocompleteSearched) =>
    {
        return ({
            value: item.getDescription(),
            object: item,
            label: (
                <Row style={{margin: '4px 0'}}>
                    <Col>
                        <Row style={{fontWeight: 600}}>{highlightText(item, autocompleteSearched)}</Row>
                    </Col>
                </Row>
            )
        })
    };

    const onChange = (object: ItemValue) =>
    {
        // console.log(object);
        model.setObject(object);
        model._onChange?.(object);
    };

    const onSearch = (input: string) =>
    {
        if (!!input && input.length > 2) {
            model.refresh(input);
            setSuccess(false);
            setLoading(true);
            setError(false);
        } else {
            setSuccess(false);
            setLoading(false);
            setError(false);
        }
    };

    const onClear = () => {
        model._onClear?.();
        model.clearValue();
        setState({
            autocompleteSearched: '',
            items: [],
            renders: []
        });
    };

    const onStart = () =>
    {
        let item: ItemValue = model._value;
        if (item) {
            let text: string = item.getDescription()
            setState({
                items: [item],
                renders: [render(item, text)]
            });
            onChange(item);
        } else {
            onClear();
        }
    }

    useEffect(() => {
        onStart();
    }, [])

    let iconStyle = { marginLeft: 4, marginRight: 8, opacity: .4 }

    return (
        <>
            <AutocompleteAnt
                style={{ width: '100%' }}
                searchValue={state.autocompleteSearched}
                defaultValue={state.autocompleteSearched}
                options={state.renders}
                disabled={disabled || !access.access}
                allowClear={model._clearable}
                onSearch={onSearch}
                onSelect={(_, object: any) => onChange(object.object) } // It's the render object.
                onClear={onClear}
            >
                <Input
                    size={model._sizeString ?? undefined}
                    placeholder={model._label ?? undefined}
                    prefix={
                        error
                            ? <StopOutlined style={iconStyle} />
                            : success
                                ? <CheckOutlined style={iconStyle} />
                                : loading
                                    ? <LoadingOutlined style={iconStyle} /> : <SearchOutlined style={iconStyle} />
                    }
                />
            </AutocompleteAnt>
        </>
    );
}

export default Autocomplete;