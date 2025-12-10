import React, {useState} from "react";

import {Switch as SwitchModel} from "../../typescript";
import {Switch as SwitchAnt} from "antd";

const Switch = (props: any) => {

    let model: SwitchModel = props.model;

    const [value, setValue] = useState<any>(model._default ?? '');

    const onChange = (checked: boolean) => {
        model._data = checked;
        setValue(model._data);
        if (model._formula) model.value(model._data);
        model._onChange?.(model._data, model._index);
    };

    // Register the defaultValue to the formula.
    if (model._default) {
        if (model._formula) model.value(model._default);
    }

    let addProps: any = {};
    if (model._checkedChildren) addProps['checkedChildren'] = model._checkedChildren;
    if (model._unCheckedChildren) addProps['unCheckedChildren'] = model._unCheckedChildren;

    return (
        <SwitchAnt style={model._style} checked={value} defaultChecked={value ?? true} onChange={onChange} { ...addProps } />
    );
};

export default Switch;