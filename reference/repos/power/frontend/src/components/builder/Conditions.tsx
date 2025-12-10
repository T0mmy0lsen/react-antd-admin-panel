import React, {ReactNode, useEffect} from "react";
import { Conditions as ConditionsModel, ConditionsItem } from "../../typescript";
import { Row, Col } from 'antd';
import Section from "../Section";

let arraysAreEqual = (arr1, arr2) => {

    if (arr1.length !== arr2.length) {
        return false;
    }

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }

    return true;
}

const Conditions = (props: any) => {

    let model: ConditionsModel = props.model;

    const [state, setState] = React.useState<any>({
        key: 0,
        section: [],
        args: undefined,
        activeConditions: [],
    });

    const [conditions, setConditions] = React.useState<ConditionsItem[]>(model?._fields ?? []);

    model.clear = () => {
        setState({
            key: state.key + 1,
            section: null,
        });
    }

    model.getValue = () => state.args;
    model.getKeys = () => state.activeConditions;

    model.checkCondition = (args?: any) =>
    {
        let sections: any = [];
        let activeConditions: any[] = [];

        conditions.forEach((r: ConditionsItem, i: number) => {
            if (r._condition(args)) {
                activeConditions.push(r._key);
            }
        })

        if (!arraysAreEqual(activeConditions, state.activeConditions)) {
            conditions.forEach((r: ConditionsItem, i: number) => {
                if (r._condition(args)) {
                    let temp: number = Math.floor((Math.random() * 10000));
                    sections.push(<Section saveState={true} key={i + temp} form={props.form} main={props.main} parent={model} section={conditions[i]._content} args={args}/>)
                }
            })

            let nextState = {
                key: state.key + 1,
                section: sections,
                args: args,
                activeConditions: activeConditions,
            }

            model._saveState = nextState;
            setState(nextState);
        }
    }

    useEffect(() => {
        // console.log('Conditions', model._saveState)
        if (model._saveState) {
            model._saveState.args = model._restore();
            setState(model._saveState);
        } else {
            model.checkCondition(typeof model._default === 'function' ? model._default() : model._default);
        }
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