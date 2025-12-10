import React, {useEffect, useState} from "react";
import {ItemValue, Select as SelectModel} from "../../typescript";
import {Col, Form, Row, Select as SelectAnt} from 'antd';
import {IValueOption} from "../../classes";

const render = (item: ItemValue) =>
{
    return ({
        value: item.getValue(),
        object: item,
        label: (
            <Row style={{margin: '4px 0'}}>
                <Col>
                    <Row style={{fontWeight: 400}}>{item.getDescription()}</Row>
                </Col>
            </Row>
        )
    })
};

const Select = (props: any) => {

    let model: SelectModel = props.model;

    const [state, setState] = useState<any>({
        value: model._value.getValue(),
        renders: model._fields?.map((v: ItemValue) => {
            return render(v)
        })
    });

    model._onError = () => {}
    model._onComplete = () => {};

    model.onHandleClear = () => {};
    model.onHandleLoading = (value: boolean) => {};

    model.tsxSetDisabled = (value: boolean) => {};
    model.tsxSetLoading = (value: boolean) => {};
    model.tsxSetSuccess = (value: boolean) => {};
    model.tsxSetError = (value: boolean) => {};
    model.tsxClear = () => onClear();

    model.tsxSetFieldsExtend = () =>
    {
        setState({
            value: model._value?.getDescription(),
            renders: model._fields?.map((v: ItemValue) => render(v))
        });
    }

    const onChange = (object: ItemValue) =>
    {
        if (object === undefined) return;

        model.setObject(object);
        model._onChange?.(object);

        setState({
            value: object.getDescription(),
            renders: state.renders
        })
    };

    const onClear = () =>
    {
        model.setObject(new ItemValue());

        setState({
            value: undefined,
            renders: state.renders
        });
    };

    const onStart = () =>
    {
        let item: ItemValue = model._value;
        if (model._addMoreOverwriteItemsFunction) model._addMoreOverwriteItemsFunction(item);
        if (item) onChange(item);
    }

    useEffect(() => {
        onStart();
    }, [])

    return (
        <>
            <SelectAnt
                placeholder={ model._label ?? undefined }
                disabled={ state.loading || state.disabled }
                style={{ width: model._width ?? '100%' }}
                size={ model._sizeString ?? 'large' }
                allowClear={model._clearable}
                value={state.value ?? undefined}
                onChange={(_, object: any) => onChange(object?.object)}
                onClear={onClear}
                options={state.renders}
            >
            </SelectAnt>
        </>
    );
}

export default Select;