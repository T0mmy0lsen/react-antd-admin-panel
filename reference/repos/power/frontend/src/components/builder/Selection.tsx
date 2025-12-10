import React, {useEffect, useState} from "react";
import {ItemValue, Selection as SelectionModel} from "../../typescript";
import {Button, Flex, Form, Radio as RadioAnt} from 'antd';
import {darkenColor, lightenColor} from "../../helpers";
import "./Selection.css";

const Selection = (props: any) => {

    let model: SelectionModel = props.model;
    let access = props.main.$access(model._access);

    const [state, setState] = useState<any>({
        value: model.getValue(),
        items: model._fields
    });

    const [disabled, setDisabled] = useState<any>(false);
    const [loading, setLoading] = useState<any>(false);
    const [success, setSuccess] = useState<any>(false);
    const [error, setError] = useState<any>(false);

    model._onError = () => {}
    model._onComplete = () => {};

    model.onHandleClear = () => {};
    model.onHandleLoading = (value: boolean) => setLoading(value);

    model.tsxSetDisabled = (value: boolean) => setDisabled(value);
    model.tsxSetLoading = (value: boolean) => setLoading(value);
    model.tsxSetSuccess = (value: boolean) => setSuccess(value);
    model.tsxSetError = (value: boolean) => setError(value);
    model.tsxClear = () => onClear();

    const getButtonStyle = (r, index, isSelected) =>
    {
        let style: any = {
            width: '100%',
            marginLeft: index !== 0 ? 4 : 0,
            marginRight: index === 0 ? 4 : 0,
        };

        const baseColor: string = r._color ?? 'C5C5C5';

        style = {
            ...style,
            backgroundColor: isSelected ? darkenColor(baseColor, 0.8) : `#${baseColor}`,
            color: isSelected ? darkenColor(baseColor, 0.1) : lightenColor(baseColor, 0.99),
            borderColor: isSelected ? darkenColor(baseColor, 0.7) : lightenColor(baseColor, 0.2),
            '--hoverBackgroundColor': darkenColor(baseColor, 0.6),
            '--hoverTextColor': darkenColor(baseColor, 0.1),
            '--hoverBorderColor': darkenColor(baseColor, 0.6),
        };

        return style;
    };

    const onChange = (object: ItemValue) =>
    {
        setState({
            value: object.getValue(),
            items: state.items,
        })

        model.setObject(object);
        model._onChange(object);
    };

    const onClear = () =>
    {
        setState({
            value: undefined,
            items: state.items,
        });
    };

    useEffect(() => {
        onChange(model._value);
    }, [])

    let getDesignDefault = () => {
        return (
            <Flex gap="middle" vertical>
                <Flex vertical={false}>
                    {model._fields.map((r: ItemValue, index) => {
                        let style = getButtonStyle(r, index, state.value === r.getValue());
                        console.log("style", style)
                        return (
                            <Button
                                className={"dynamicButton"}
                                key={r.getValue()}
                                style={style}
                                onClick={() => onChange(r)}
                            >
                                {r.getDescription()}
                            </Button>
                        )
                    })}
                </Flex>
            </Flex>
        )
    }

    let getDesignTwoText = ([left, right]) => {
        return (
            <Flex justify="middle" vertical>
                <Flex vertical={false}>
                    { model._fields.map((r: ItemValue, index) => {
                        let style = getButtonStyle(r, index, state.value === r.getValue());
                        return (
                            <Button
                                className={"dynamicButton"}
                                key={r.getValue()}
                                style={style}
                                onClick={() => onChange(r)}
                            >
                                { r.getDescription() }
                            </Button>
                        )
                    })}
                </Flex>
                <Flex justify="space-between" style={{ padding: 8 }}>
                    <div style={{ fontWeight: 600 }}>{ left }</div>
                    <div style={{ fontWeight: 600 }}>{ right }</div>
                </Flex>
            </Flex>
        )
    }

    let getDesignRadio = () => {
        return (
            <Flex gap="middle" vertical>
                <RadioAnt.Group
                    defaultValue={0}
                    value={state.value}
                    disabled={state.disabled || state.loading}
                    onChange={(value: any) => onChange(state.items.find((i: ItemValue) => i.getValue() === value.target.value))}
                >
                    {model._fields.map((r: ItemValue) => {
                        return (
                            <RadioAnt
                                key={r.getValue()}
                                value={r.getValue()}
                                style={{display: 'block', lineHeight: '30px'}}
                            >{r.getDescription()}
                            </RadioAnt>
                        )
                    })}
                </RadioAnt.Group>
            </Flex>
        )
    }

    let getDesign = () => {
        switch (model._design) {
            case 'Radio':
                return getDesignRadio();
            case 'Agreement':
                return getDesignTwoText(['Uenig', 'Enig']);
            default:
                return getDesignDefault();
        }
    }

    return (
        <Form.Item style={ model._style ?? { marginBottom: 0 }}>
            { getDesign() }
        </Form.Item>
    );
}

export default Selection;