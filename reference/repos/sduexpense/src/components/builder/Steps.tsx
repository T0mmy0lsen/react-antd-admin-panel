import React, {Component} from "react";
import Section from "../Section";
import { Section as SectionModel } from "../../typescript";
import { Steps as StepsModel, StepsItem } from "../../typescript";
import { Steps as StepsAnt, Button, Row, message, Col } from 'antd';
const { Step } = StepsAnt;

const Steps = (props: any) => {

    let model: StepsModel = props.model;

    const [state, setState] = React.useState<any>({
        key: 0,
        index: model._default ?? 0,
        steps: model?._fields ?? [],
    });

    const [stepsDisabled, setStepsDisabled] = React.useState<boolean>(false);

    model.tsxStepsButtonDisable = (v: boolean) => setStepsDisabled(v)

    model.getCurrentStep = () => state.index;

    model.goTo = (v) => setState({
        key: state.key,
        index: v,
        steps: state.steps,
    });

    model.prev = () => {
        if (state.index > 0) {
            setState({
                key: state.key,
                index: state.index - 1,
                steps: state.steps,
            });
        }
    }

    model.next = () => {
        if (state.steps[state.index + 1]) {
            setState({
                key: state.key,
                index: state.index + 1,
                steps: state.steps,
            });
        }
    }

    model.done = (v, b: boolean = true) => {
        setState({ ...state,
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

    const handleKeyDown = (e) => {

        if (e.key === "Enter" && state.steps[state.index]._done && !stepsDisabled) {
            // Manually call the same logic as onClick:
            model._onClick?.();
            model.next();
        }
    };

    React.useEffect(() => {
        state.steps[state.index]._onShow?.()
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [state.steps, state.index]);

    return (
        <>
            <Row justify={'start'} style={{ paddingTop: 0, paddingBottom: 36 }}>

                <Button disabled={state.index == 0 || stepsDisabled} style={{ marginRight: 12 }} onClick={() => {
                    model._onClick?.(state.index)
                    model.prev()
                }}>
                    Back
                </Button>

                {state.index < state.steps.length - 1 && (
                    <Button type="primary" onClick={() => {
                        model._onClick?.(state.index)
                        model.next()
                    }} disabled={!state.steps[state.index]._done || stepsDisabled}>
                        Next <div style={{ marginTop: -2, opacity: 0.5 }}><kbd>&lt;Enter&gt;</kbd></div>
                    </Button>
                )}
            </Row>
            <Row>
                <Col span={24}>
                    <StepsAnt current={state.index}>
                        {state.steps.map(item => (
                            <Step key={item._title} title={item._title} />
                        ))}
                    </StepsAnt>
                </Col>
            </Row>
            <Row style={{ paddingTop: 36 }}>
                <Col span={24}>
                    { state.steps[state.index] ?
                        <>
                            <Section key={`${state.steps[state.index]._title}-${state.key}`} main={props.main} section={state.steps[state.index]._content} parent={model} />
                            <Row justify={'end'} style={{ paddingTop: 36, paddingBottom: 36 }}>
                        {state.index > 0 && (
                            <Button disabled={stepsDisabled} style={{ marginRight: 12 }} onClick={() => {
                                model._onClick?.(state.index)
                                model.prev()
                            }}>
                                {model._backText || 'Back'}
                            </Button>
                        )}
                        {state.index < state.steps.length - 1 && (
                            <Button type="primary" onClick={() => {
                                model._onClick?.(state.index)
                                model.next()
                            }} disabled={!state.steps[state.index]._done || stepsDisabled}>
                                {model._nextText || 'Next'} <div style={{ marginTop: -2, opacity: 0.5 }}><kbd>&lt;Enter&gt;</kbd></div>
                            </Button>
                        )}
                    </Row>
                        </> : null }
                </Col>
            </Row>
        </>
    );
}

export default Steps;