import React, {useState} from "react";

import  { TreeItem as TreeItemModel } from "../../typescript";
import Section from "../Section";

const TreeItem = (props: any) => {
    let model: TreeItemModel = props.model;
    if (model._render) return model._render(model);
    if (model._section) return <Section main={props.main} section={model._section}/>;
    return (<div>{model._label ?? 'Undefined'}</div>)
}

export default TreeItem;