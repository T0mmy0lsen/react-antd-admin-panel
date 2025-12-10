import React, {useState} from "react";
import { Typography as TypographyAnt } from 'antd';
import { Typography as TypographyModel } from "../../typescript";


const Typography = (props: any) => {

    const model: TypographyModel = props.model;

    const [label, setLabel] = useState<any>(model._label);

    model.onHandleChange = (value: any) => {
        setLabel(value);
    }

    model.tsxSetValue = (value: any) => {
        setLabel(value);
    }

    return (
        <TypographyAnt>
            <TypographyAnt.Paragraph
                copyable={model._copyable}
                strong={model._strong}
                style={{ ...{ whiteSpace: 'no-wrap' }, ...model._style }}
            >
                {label}
            </TypographyAnt.Paragraph>
        </TypographyAnt>
    );
}

export default Typography;
