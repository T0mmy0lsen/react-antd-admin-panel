import React, {useEffect, useRef, useState} from "react";
import {Typography as TypographyAnt} from 'antd';
import TitleModel from "../../typescript/models/builder/Title";

const Title = (props: any) => {

    const model: TitleModel = props.model;
    const [showStep, setShowStep] = useState(model._step ?? false);
    const [step, setStep] = useState(model._stepDefault ?? false);

    model._ref = useRef();
    useEffect(() => {}, [model]);

    return (
        <div
            ref={model._ref}
            style={model._level !== 5 ? {} : { marginTop: 16, marginBottom: 8 }}
        >
            <TypographyAnt>
                <TypographyAnt.Title level={model._level} style={{ ...model._style, ...{ fontWeight: 200 }}}>
                    {model._label && (
                        <div>{model._label}</div>
                    )}
                </TypographyAnt.Title>
            </TypographyAnt>
        </div>
    );
}

export default Title;