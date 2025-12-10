import React from "react";

import {DatePicker as DatePickerModel} from "../../typescript";
import {DatePicker as DatePickerAnt} from "antd";
import dayjs from 'dayjs';
import 'dayjs/locale/da';
import locale from 'antd/es/date-picker/locale/da_DK';

const DatePicker = (props: any) => {

    let model: DatePickerModel = props.model;
    let addProps: any = {};

    if (model._picker) addProps['picker'] = model._picker;
    if (model._default) addProps['defaultValue'] = dayjs(model._default, 'YYYY-MM-DD');

    const onChange = (date: any, dateString: any) => {
        model._data = dateString;
        model._default = dateString;
        if (model._formula) model.value(model._data);
        model._onChange?.(model._data, date);
    };

    const onClear = () => {
        model._data = true;
        model._default = true;
        if (model._formula) model.value(true);
    };

    model._onError = () => onClear();
    model._onComplete = () => onClear();

    // Register the defaultValue to the formula.
    if (model._default) {
        model._data = model._default;
        if (model._formula) {
            model.value(model._default);
        }
    }

    return (
        <DatePickerAnt locale={locale} size={'large'} placeholder={model._label ?? 'Vælg dato'} onChange={onChange} allowClear={model._clearable} { ...addProps } />
    );
}

export default DatePicker;