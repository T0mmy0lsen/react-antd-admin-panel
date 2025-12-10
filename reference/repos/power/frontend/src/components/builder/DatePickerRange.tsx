import React, {useEffect} from "react";

import {DatePickerRange as DatePickerRangeModel} from "../../typescript";
import {DatePicker as DatePickerAnt} from "antd";
import dayjs from 'dayjs';
import 'dayjs/locale/da';
import locale from 'antd/es/date-picker/locale/da_DK';

const DatePickerRange = (props: any) => {

    let model: DatePickerRangeModel = props.model;
    let addProps: any = {};

    const onChange = ({ value, object }: any, settings?: any) => {
        model._defaultObject = { value: value, object: object };
        if (model._formula) model.value(model._defaultObject.value);
        model._onChange?.(model._defaultObject);
    };

    const onClear = () => {
        model._defaultObject = undefined;
        if (model._formula) model.value(undefined);
    };

    const onStart = () =>
    {
        if (model._defaultObject) {
            if (model._formula) model._formula.value(model._defaultObject.value);
            setTimeout(() => onChange(model._defaultObject, {
                ignoreOnChange: model._ignoreOnChange,
                ignoreSetState: model._ignoreSetState,
            }), 0);
        } else {
            onClear();
        }
    }

    useEffect(() => {
        if (model._useCache && model._key) model.defaultFromCache();
        onStart();
    }, [])

    return (
        <DatePickerAnt.RangePicker
            locale={locale}
            placeholder={model._label ?? ['From date', 'To date']}
            onChange={(date, dateString) => onChange({ value: dateString, object: date })}
            allowClear={model._clearable}
            { ...addProps }
        />
    );
}

export default DatePickerRange;