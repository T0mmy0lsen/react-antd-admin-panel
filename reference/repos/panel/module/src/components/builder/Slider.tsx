import React from "react";

import {Slider as SliderModel} from "../../typescript";
import {Slider as SliderAnt} from "antd";

const Slider = (props: any) => {

    let slider: SliderModel = props.model;

    const onChange = (value: number) => {
        slider._data = value
        if (slider._formula) slider.value(slider._data);
        slider._onChange?.(slider._data, slider._index);
    };

    const onAfterChange = (value: number) => {
        slider._data = value;
        if (slider._formula) slider.value(slider._data);
        slider._onAfterChange(slider._data, slider._index);
    };

    slider._onError = () => {};
    slider._onComplete = () => {};

    if (slider._default) {
        let defaultValue = slider._default;
        slider._data = defaultValue;
        if (slider._formula) {
            slider.value(defaultValue);
        }
    }

    const Node: any = (value: any) => {
        return slider._labelFunction
            ? <>{slider._labelFunction(value)}</>
            : <>{value}</>
    }

    let addProps: any = {};
    if (slider._marks) addProps['marks'] = slider._marks;
    if (slider._range) addProps['range'] = slider._range;

    return (
        <div style={{ margin: '16px' }}>
            <SliderAnt
                defaultValue={slider._data}
                min={slider._min ? slider._min : 0}
                max={slider._max ? slider._max : 100}
                onChange={onChange}
                onAfterChange={onAfterChange}
                tipFormatter={Node}
                { ...addProps }
            />
        </div>
    );
}

export default Slider;