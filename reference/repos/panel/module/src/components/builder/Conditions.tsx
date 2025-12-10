import React, {ReactNode, useEffect} from "react";
import { Conditions as ConditionsModel, ConditionsItem } from "../../typescript";
import { Row, Col } from 'antd';
import Section from "../Section";

const Conditions = (props: any) => {

    let model: ConditionsModel = props.model;

    const [state, setState] = React.useState<any>({
        key: 0,
        section: [],
        args: undefined,
    });

    const [conditions, setConditions] = React.useState<ConditionsItem[]>(model?._fields ?? []);

    model.clear = () => {
        setState({
            key: state.key + 1,
            section: null,
        });
    }

    model.getValue = () => state.args;

    model.checkCondition = (args?: any) =>
    {
        let sections: any = [];

        conditions.forEach((r: ConditionsItem, i: number) => {
            if (r._condition(args)) {
                let temp: number = Math.floor((Math.random() * 10000));
                sections.push(<Section key={i + temp} form={props.form} main={props.main} parent={model} section={conditions[i]._content} args={args}/>)
            }
        })

        setState({
            key: state.key + 1,
            section: sections,
            args: args,
        });
    }

    useEffect(() => {
        model.checkCondition(typeof model._default === 'function' ? model._default() : model._default);
    }, [])

    return (
        <>
            <Row>
                <Col key={state.key} span={24}>{ state.section ?? null }</Col>
            </Row>
        </>
    );
}

export default Conditions;