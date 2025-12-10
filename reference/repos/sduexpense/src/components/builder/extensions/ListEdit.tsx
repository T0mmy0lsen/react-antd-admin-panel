import React, {useEffect, useMemo, useState} from "react";
import Text from "antd/lib/typography/Text";
import {
    Input,
    Select as SelectAnt,
    DatePicker as DatePickerAnt,
    AutoComplete as AutoCompleteAnt,
    InputNumber, ConfigProvider
} from "antd";
import {Item} from "../../../typescript";
import dayjs from 'dayjs';
import 'dayjs/locale/da';
import Icon from "@ant-design/icons";
import {debounce, lowerCase} from "lodash";

import en from 'antd/es/date-picker/locale/en_US';
import da from 'antd/es/date-picker/locale/da_DK';

const CellSelectOption = (props: any) => {
    if (props.item.text) {
        return (
            <div>
                <span style={{ marginRight: 4 }}>{props.item.title}</span><br/>
                <div style={{ marginTop: -2, fontSize: 12, width: 0, overflow: 'visible' }}>{props.item.text}</div>
            </div>
        )
    }
    return (
        <span>{props.item.title ?? props.item.label}</span>
    )
}

const Cell = (props: any) =>
{
    const [state, setState] = useState<any>({
        key: 0,
        value: props.value,
        // TODO: Why do I get the header like this? It's in the props.
        header: props.model.getHeaders().find((r: any) => r.dataIndex === props.dataIndex),
    });

    const changeDate = (date: any, dateString: string | string[]) => {
        let formatDate = dayjs(dateString as string, 'DD-MM-YYYY').format('YYYY-MM-DD');
        setState({ value: formatDate, header: state.header });
        props.model.setRecordValue(props.record, props.dataIndex, formatDate);
        if (props.onChange) props.onChange();
    }

    const changeDateWeek = (date: any, dateString: string | string[]) => {
        let formatDate = dayjs(dateString as string, 'WW-YYYY').isoWeek(date.isoWeek()).year(date.year());
        let formatDateStr = formatDate.startOf('isoWeek').format('YYYY-MM-DD');
        setState({ value: formatDateStr, header: state.header });
        props.model.setRecordValue(props.record, props.dataIndex, formatDateStr);
        if (props.onChange) props.onChange();
    }

    const changeInput = (v: any) => {
        setState({ value: v.target.value, header: state.header });
        props.model.setRecordValue(props.record, props.dataIndex, v.target.value);
        if (props.onChange) props.onChange();
    }

    const changeNumber = (v: any) => {
        setState({ value: v, header: state.header });
        props.model.setRecordValue(props.record, props.dataIndex, v);
        if (props.onChange) props.onChange();
    }

    const changeSelect = (v: any) => {
        // console.log(v);
        setState({ value: v, header: state.header });
        props.model.setRecordValue(props.record, props.dataIndex, v, state.header.items.find((r: any) => r.getObject().value === v));
        // console.log('changeSelect', props.record, props, v, state.header.items.find((r: any) => r.getObject().value === v))
        if (props.onChange) props.onChange();
    }

    const changeAutocomplete = (v: any, items: any[]) => {
        setState({ value: v, header: state.header });
        props.model.setRecordValue(props.record, props.dataIndex, v, items.find((r: any) => r.getObject().value === v));
        if (props.onChange) props.onChange();
    }

    const CellAutocomplete = () => {

        const [filteredItems, setFilteredItems] = useState([]);
        const [inputValue, setInputValue] = useState(state.value);

        // Assume items can either be a function that returns the items or an array of items directly.
        const items = useMemo(() => typeof state.header.items === 'function' ? state.header.items() : state.header.items, [state.header.items]);

        // Debounced filter function
        const filterItems = useMemo(() => debounce((value) => {
            let lowerCaseValue = value?.toLowerCase();
            const filtered = items.filter(r => {
                    let lowerCaseTitle = (r.getObject().title)?.toString().toLowerCase();
                    let lowerCaseObjectValue = (r.getObject().value)?.toString().toLowerCase();
                    return lowerCaseValue
                        ? lowerCaseObjectValue.includes(lowerCaseValue) || lowerCaseTitle.includes(lowerCaseValue)
                        : true
                }
            );
            setFilteredItems(filtered);
        }, 300), [items]); // Adjust debounce time as necessary

        // Effect for handling input value change and cleanup
        useEffect(() => {
            filterItems(inputValue);
            return () => filterItems.cancel(); // Cleanup on unmount or re-render
        }, [inputValue, filterItems]);

        // Handler for autocomplete change
        const innerChangeAutocomplete = (v) => {
            setInputValue(v);
            changeAutocomplete(v, items);
        };

        // Check if current value is in items (might be adjusted based on the structure of your items)
        const isValueInItems = useMemo(() => items.some(r => {
            if (!inputValue) return true;
            let obj = r.getObject();
            return obj.value.toString() === inputValue.toString();
        }), [items, inputValue]);

        return (
            <>
                <AutoCompleteAnt
                    disabled={props.model._disabled}
                    value={inputValue}
                    defaultValue={state.value}
                    onChange={innerChangeAutocomplete}
                    className={!isValueInItems || !inputValue ? 'listRowAutocompleteRed' : ''}
                    popupClassName={props.dataIndex === 'projekt' ? 'listRowAutocomplete' : 'listRowAutocompleteSmall'}
                    style={{
                        width: '100%',
                        borderRadius: 3,
                    }}
                >
                    {filteredItems.map((r: Item) => {
                        let obj = r.getObject();
                        return (
                            <SelectAnt.Option key={obj.key} value={obj.value}>
                                <CellSelectOption item={obj} />
                            </SelectAnt.Option>
                        );
                    })}
                </AutoCompleteAnt>
            </>
        );
    };

    const CellSelect = () => {
        console.log('CellSelect', state)
        return (
            <SelectAnt
                disabled={props.model._disabled}
                value={state.value}
                defaultValue={state.value}
                onChange={changeSelect}
                popupClassName={props.dataIndex === 'category' ? 'cellSelectInnerWidth' : ''}
                style={{
                    borderRadius: 3,
                    margin: '-5px -1200px -12px -12px',
                    paddingLeft: '10px',
                    width: '100%'
                }}
            >
                { state.header.items.map((r: Item) => {
                    let obj = r.getObject();
                    return (
                        <SelectAnt.Option key={obj.key} value={obj.value} dropdownStyle={{ width: '120px' }}>
                            <CellSelectOption item={obj} />
                        </SelectAnt.Option>
                    )
                })}
            </SelectAnt>
        )
    }

    const CellInput = () => {
        return (
            <>
                <Input
                    disabled={props.model._disabled}
                    spellCheck={false}
                    style={{
                        borderRadius: 3,
                        margin: '-5px -1200px -5px 0px',
                        width: '100%'
                    }}
                    onChange={changeInput}
                    autoFocus={props.record._autoFocus}
                    placeholder={props.record._placeholder}
                    defaultValue={props.value}
                />
            </>
        )
    }

    const parser = (value) => {
        // Remove the dollar sign, spaces, and replace periods with nothing, and comma with a period
        const parsedValue = value.replace(/\$\s?/g, '').replace(/\./g, '').replace(',', '.');
        return parsedValue;
    };


    const formatter = (value) => {
        // Ensure conversion to a string and enforce two decimal points as needed
        let [whole, fraction = ''] = value.toString().split('.');
        // Format the whole part with periods as thousand separators
        whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        // Reconstruct the number with a comma for the decimal separator
        return fraction ? `${whole},${fraction}` : `${whole}`;
    };

    const CellNumber = () => {
        let value = state.value;
        return (
            <InputNumber
                disabled={props.model._disabled}
                style={{
                    borderRadius: 3,
                    margin: '-5px -1200px -5px 0px',
                    width: '100%'
                }}
                formatter={formatter}
                parser={parser}
                onChange={changeNumber}
                autoFocus={props.record._autoFocus}
                placeholder={props.record._placeholder}
                defaultValue={props.value}
                value={value}
            />
        )
    }

    const CellDate = () => {
        return (
            <DatePickerAnt
                disabled={props.model._disabled}
                defaultValue={dayjs(state.value, 'YYYY-MM-DD')}
                format={'DD-MM-YYYY'}
                onChange={changeDate}
                locale={da}
                style={{
                    borderRadius: 3,
                    margin: '-5px -1200px -5px 0px',
                    width: '100%'
                }}
            />
        )
    }

    const CellDateWeek = () => {
        return (
            <DatePickerAnt
                disabled={props.model._disabled}
                picker={'week'}
                defaultValue={dayjs(state.value, 'YYYY-MM-DD')}
                format={'WW-YYYY'}
                onChange={changeDateWeek}
                locale={da}
                style={{
                    borderRadius: 3,
                    margin: '-5px -1200px -5px 0px',
                    width: '100%'
                }}
            />
        )
    }

    props.record.tsxSetValue = (value: any) => {
        // console.log('tsxSetValue', value);
        // changeNumber(value)
    }

    if (props.record?.editable && state.header?.editable && (props.editing || !props.editTogglable)) {

        console.log(props)

        return (
            <div>
                {
                    (state.header && state.header.type === 'dateWeek') && CellDateWeek() ||
                    (state.header && state.header.type === 'date') && CellDate() ||
                    (state.header && state.header.type === 'number') &&
                        <>
                            <InputNumber
                                disabled={props.model._disabled}
                                style={{
                                    borderRadius: 3,
                                    margin: '-5px -1200px -5px 0px',
                                    width: '100%',
                                }}
                                formatter={formatter}
                                parser={parser}
                                onChange={changeNumber}
                                autoFocus={props.record._autoFocus}
                                placeholder={props.record._placeholder}
                                defaultValue={state.value}
                                value={state.value}
                            />
                        </> ||
                    (state.header && state.header.type === 'select') && CellSelect() ||
                    (state.header && state.header.type === 'autocomplete') && CellAutocomplete() ||
                    CellInput()
                }
            </div>
        )
    }

    return (
        <div style={{ opacity: props.editing ? 0.8 : props.deleted ? 0.4 : 1 }}>
            {
                props.render?.(props.value, props.record) ||
                React.isValidElement(props.value) && props.value ||
                <Text ellipsis style={{ padding: '0px 0px' }}>{`${props.value}`}</Text>
            }
        </div>
    );
}

const handleRowProps = (key: any, { model, render, onChange }: any) => {
    console.log('Key:', key)
    return ({
        key: key,
        render: (value: any, record: any) => {
            if (!value && render) return render(value, record, onChange);
            console.log('---', model)
            return <Cell
                model={model}
                value={value}
                record={record}
                render={render}
                editTogglable={model._actions.some((r: any) => r._key === 'edit')}
                editing={model?.getEditingKeys().includes(record.key)}
                deleted={model?.getDeletedKeys().includes(record.key)}
                dataIndex={key}
                className={model._rowClassName}
                onChange={onChange}
            />
        }
    })
}

export default {
    handleRowProps
};
