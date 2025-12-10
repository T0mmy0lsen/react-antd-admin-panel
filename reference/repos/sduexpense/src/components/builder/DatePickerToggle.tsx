import React, {useState} from "react";

import {DatePickerToggle as DatePickerToggleModel} from "../../typescript";
import {DatePicker as DatePickerAnt, Select, Space} from "antd";

const { Option } = Select;

const DatePickerToggle = (props: any) => {

    let model: DatePickerToggleModel = props.model;
    const [type, setType] = useState<any>(model._picker);
    const [value, setValue] = useState<any>(model._default);

    const onChangeSelect = (picker: any) =>
    {
        let prevPicker = model._picker;
        let currPicker = picker;

        model._picker = currPicker;
        setType(picker);
        model._onChangeSelect(currPicker, prevPicker);
    };

    const onChange = (date: any, dateString: any) => {
        model._data = dateString;
        if (model._formula) model.value(model._data);
        model._onChange?.(dateString, date);
    };

    const onClear = () => {
        model._data = true;
        if (model._formula) model.value(true);
    };

    model._onError = () => onClear();
    model._onComplete = () => onClear();

    // Register the defaultValue to the formula.
    if (model._default) {
        let defaultValue = model._default;
        model._data = defaultValue;
        if (model._formula) {
            model.value(defaultValue);
        }
    }

    model.onHandleChange = (value: any) => {
        setValue(value)
    }

    return (
        <Space>
            <Select defaultValue={model._picker} value={type} onChange={onChangeSelect} style={{ width: 126 }}>
                <Option value="date">Date</Option>
                <Option value="week">Week</Option>
                <Option value="month">Month</Option>
            </Select>
            <DatePickerAnt
                key={value}
                picker={type}
                defaultValue={value}
                onChange={onChange}
            />
        </Space>
    );
}

export default DatePickerToggle;