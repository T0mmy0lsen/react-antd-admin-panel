import React, {useState} from "react";

import {RangePicker as RangePickerModel} from "../../typescript";
import {DatePicker as DatePickerAnt, Select, Space} from "antd";
import dayjs from 'dayjs';

const { Option } = Select;

const RangePicker = (props: any) => {

    let model: RangePickerModel = props.model;
    const [value, setValue] = useState<any>(model._default);
    const [loading, setLoading] = useState<any>(false);

    const onChange = (date: any, range: any) => {
        if (typeof range[0] === 'string') range = [dayjs(range[0]), dayjs(range[1])]
        model._default = range;
        model._onChange?.(model._default);
        if (model._formula) model.value(model._default);
    };

    model._onError = () => {};
    model._onComplete = () => {};
    model.onHandleLoading = (value: boolean) => setLoading(value);
    model.onHandleChange = (value: any) => {
        onChange([], value);
        setValue(model._default);
    }

    // Register the defaultValue to the formula.
    if (model._default && model._formula) model.value(model._formula);

    return (
        <div style={model._style ?? {}}>
            <DatePickerAnt.RangePicker
                disabled={loading}
                onChange={onChange}
                defaultValue={value}
            />
        </div>
    );
}

export default RangePicker;