import React from "react";
import dayjs from 'dayjs';
import 'dayjs/locale/da';

import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import updateLocale from 'dayjs/plugin/updateLocale';

import locale from 'antd/es/date-picker/locale/da_DK';

import { DatePicker as DatePickerAnt } from "antd";
import { DatePicker as DatePickerModel } from "../../typescript";
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);
dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);
dayjs.extend(updateLocale);

dayjs.updateLocale('da', {
    weekStart: 1,
    week: {
        dow: 1,
        doy: 4
    }
});

const DatePicker = (props: any) => {

    let model: DatePickerModel = props.model;
    let addProps: any = {};

    if (model._picker) addProps['picker'] = model._picker;
    if (model._default) addProps['defaultValue'] = dayjs(model._default, 'YYYY-MM-DD');

    const onChange = (date: any, dateString: any) => {
        if (!date) {
            // user cleared the picker
            model._data = '';
            model._default = '';
            model._onChange?.('', null);
            return;
        }

        // If it's a week picker, just use the Day.js object from antd
        let formatDate = date;

        // If model._returnStartOfWeek is true, adjust to the start of the isoWeek
        if (model._returnStartOfWeek) {
            formatDate = formatDate.startOf('isoWeek');
        }

        // If model._returnEndOfWeek is true, adjust to the end of the isoWeek
        if (model._returnEndOfWeek) {
            formatDate = formatDate.endOf('isoWeek');
        }

        const formattedDate = formatDate.format('YYYY-MM-DD');

        model._data = formattedDate;
        model._default = formattedDate;

        if (model._formula) {
            model.value(formattedDate);
        }

        model._onChange?.(formattedDate, date);
    };

    const onClear = () => {
        model._data = '';
        model._default = '';
        if (model._formula) model.value('');
    };

    model._onError = () => onClear();
    model._onComplete = () => onClear();

    // set model._data = model._default if present
    if (model._default) {
        model._data = model._default;
        if (model._formula) {
            model.value(model._default);
        }
    }

    return (
        <>
            { props.model._label
                ? <div style={{ margin: '0px 0px 4px 12px' }}>{ props.model._label }</div>
                : null
            }
            <DatePickerAnt
                format={model._picker === 'week' ? 'WW-GGGG' : 'DD-MM-YYYY'}
                disabled={model._disabled}
                locale={locale}
                size="large"
                placeholder={model._label ?? 'Vælg dato'}
                onChange={onChange}
                allowClear={model._clearable}
                showWeek={true}
                {...addProps}
            />
        </>
    );
}

export default DatePicker;
