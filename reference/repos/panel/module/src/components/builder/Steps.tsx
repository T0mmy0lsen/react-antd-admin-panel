import React from "react";
import Section from "../Section";
import { Steps as StepsModel, StepsItem } from "../../typescript";
import { Steps as StepsAnt, Button, Row, message, Col } from 'antd';
const { Step } = StepsAnt;

const Steps = (props: any) => {

    let model: StepsModel = props.model;

    const [state, setState] = React.useState<any>({
        key: 0,
        index: 0,
        steps: model?._fields ?? [],
    });

    model.goTo = (v) => setState({
        key: state.key,
        index: v,
        steps: state.steps,
    });
    model.prev = () => setState({
        key: state.key,
        index: state.index - 1,
        steps: state.steps,
    });
    model.next = () => setState({
        key: state.key,
        index: state.index + 1,
        steps: state.steps,
    });
    model.done = (v, b: boolean = true) => {
        setState({
            key: state.key,
            index: state.index,
            steps: state.steps.map((r: StepsItem, index: number) => {
                if (index === v - 1) r._done = b !== undefined ? b : !r._done;
                return r;
            })
        })
    };
    model.clear = () => {
        setState({
            key: state.key + 1,
            index: 0,
            steps: state.steps.map((r: StepsItem) => {
                r.done(false);
                return r;
            })
        })
    };

    return (
        <>
            <Row>
                <Col span={24}>
                    <Row style={{ paddingBottom: 36 }}>
                        {state.index > 0 && (
                            <Button style={{ marginRight: 12 }} onClick={() => model.prev()}>
                                Tilbage
                            </Button>
                        )}
                        {state.index < state.steps.length - 1 && (
                            <Button type="primary" onClick={() => model.next()} disabled={!state.steps[state.index]._done}>
                                Næste
                            </Button>
                        )}
                    </Row>
                    <StepsAnt current={state.index}>
                        {state.steps.map(item => (
                            <Step key={item._title} title={item._title} />
                        ))}
                    </StepsAnt>
                </Col>
            </Row>
            <Row style={{ paddingTop: 36 }}>
                <Col span={24}>
                    { state.steps[state.index] ? <Section key={`${state.steps[state.index]._title}-${state.key}`} main={props.main} section={state.steps[state.index]._content} parent={model} /> : null }
                </Col>
            </Row>
        </>
    );
}

export default Steps;