import React, {useEffect, useState} from "react";
import {Default as DefaultModel} from "../../typescript";
import {Row} from "antd";

const Default = (props: any) => {

    let model: DefaultModel = props.model;

    const [hasValue, setHasValue] = useState<any>(model._value?.hasValue() ?? false);

    model.defaultHasValue = (v: boolean) => setHasValue(v);

    return (
        <>
            { model._required
                ? <Row
                    justify={'end'}
                    style={{
                        opacity: hasValue ? 0.4 : 0.9,
                        color: '#ff4d4f',
                        fontSize: 14,
                        fontWeight: 300,
                        paddingTop: 6,
                        paddingBottom: 12,
                        marginTop: -36,
                    }}
                >* feltet skal udfyldes</Row>
                : null
            }
            { props.component }
        </>
    )
}

export default Default;