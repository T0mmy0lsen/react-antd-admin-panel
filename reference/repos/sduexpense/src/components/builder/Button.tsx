import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Access, Button as ButtonModel} from "../../typescript";
import {Button as ButtonAnt} from "antd";

const Button = (props: any) => {

    const model: ButtonModel = props.model;

    const [state, setState] = useState<any>({
        loading: false,
        disabled: model._disabled ?? false, type: model._primary ? 'primary' : model._link ? 'link' : undefined,
        style: model._style
    });

    let addProps: any = {};

    if (model._shape) addProps['shape'] = model._shape;
    if (model._danger) addProps['danger'] = model._danger;
    if (model._block) addProps['block'] = model._block;

    const onClick = () =>
    {
        if (model._loadable) setState({ ...state, ...{ loading: true }});

        if (!model._action?._onError) {
            model._action.onError(() => setState({ ...state, ...{ loading: false }}));
        }

        if (!model._action?._onComplete) {
            model._action.onComplete(() => setState({ ...state, ...{ loading: false }}));
        }

        model._action?.click();
    }

    // Remove onClear from onComplete. Form reset should probably not be here.
    const onClear = () => {
        props.form?.resetFields();
        model._formula?.valuesOnReset();
    }

    const Empty = () => {
        return (
            <></>
        )
    }

    model.setLoading = (v: boolean) => setState({ ...state, ...{ loading: v }});
    model.tsxSetLoading = (v: boolean) => setState({ ...state, ...{ loading: v }});
    model.tsxSetDisabled = (v: boolean) => setState({ ...state, ...{ disabled: v }});
    model.tsxSetType = (v: string) => setState({ ...state, ...{ type: v }});
    model.tsxSetStyle = (v: any) => setState({ ...state, ...{ style: v }});

    const Button = () => {

        let access = props.main.$access(model._access);
        let hide = access.hidden;

        const Icon = (model: ButtonModel, marginRight: number = 8) => {
            if (model._action?._fontawesome) return (<span style={{ width: 20 }}><FontAwesomeIcon style={{ opacity: .6, marginRight: marginRight }} icon={model._action._fontawesome} /></span>)
            if (model._fontawesome) return (<span style={{ width: 20 }}><FontAwesomeIcon style={{ opacity: .6, marginRight: marginRight }} icon={model._fontawesome} /></span>)
            if (model._action?._icon) return <model._action._icon style={{ opacity: .6, marginRight: 8 }} />
            if (model._icon) return <model._icon style={{ opacity: .6, marginRight: 8 }} />
            return <Empty/>
        };

        let Inner = () => <>{ model._action?._label }</>;
        if (!!model._component) {
            Inner = model._component;
            addProps['args'] = model._componentArgs;
        }

        return hide ? null : <ButtonAnt
                type={state.type}
                onClick={() => onClick()}
                icon={Icon(model)}
                size={model._sizeString ?? 'large'}
                loading={ state.loading }
                disabled={ state.disabled || !access.access }
                style={{...{ paddingRight: 24 }, ...state.style}}
                { ...addProps }
            >
                <Inner {...addProps} />
            </ButtonAnt>
    }

    const Clear = () => {
        return (
            <>
                <ButtonAnt
                    style={{ marginRight: 12 }}
                    onClick={() => onClear()}
                    size={ model._sizeString ?? 'large'}
                >
                    Nulstil
                </ButtonAnt>
                <Button/>
            </>

        )
    }

    useEffect(() => {
        /** Debug purposes */
        if (model._trigger) setTimeout(() => onClick(), 250);
    }, [])

    return <Button />
    return (model._action?._type === 'submit' && !model._action?._hideClear) ? <Clear /> : <Button />
}

export default Button;
