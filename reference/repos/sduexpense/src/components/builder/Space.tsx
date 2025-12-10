import React from "react";
import SpaceModel from "../../typescript/models/builder/Space";
import {Row} from "antd";

const Space = (props: any) => {
    const model: SpaceModel = props.model;
    return (
        <Row style={{
            margin: 0,
            width: '100%',
            height: model._border,
            borderBottom: `${model._border}px solid #00000010`,
            maxHeight: model._bottom + model._top,
            marginBottom: model._bottom,
            marginRight: model._left,
            marginLeft: model._right,
            marginTop: model._top
        }}/>
    );
}

export default Space;