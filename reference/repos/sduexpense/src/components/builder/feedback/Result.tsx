import React from 'react';

import { Result as ResultModel } from '../../../typescript';
import { Result as ResultAnt } from 'antd';
import Section from "../../Section";

const Result = (props: any) => {

    const model: ResultModel | any = props.model;

    let addProps: any = {};

    if (model.natives) {
        model.natives.forEach((r: any) => {
            if (model[`_${r}`]) addProps[r] = model[`_${r}`]
        });
    }

    model._fields.forEach((r: any) => {
        if (!addProps['extra']) addProps['extra'] = [];
        addProps['extra'].push(<Section key={r._key} main={props.main} section={r}/>)
    })

    return <ResultAnt { ...addProps } />
};

export default Result;