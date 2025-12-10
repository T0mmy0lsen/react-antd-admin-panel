import React, {useState} from "react";
import Text from "antd/lib/typography/Text";
import {Input, Select as SelectAnt, DatePicker as DatePickerAnt, AutoComplete as AutoCompleteAnt } from "antd";
import {Item} from "../../../typescript";
import dayjs from 'dayjs';
import 'dayjs/locale/da';

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
        value: props.value,
        header: props.model.getHeaders().find((r: any) => r.dataIndex === props.dataIndex),
    });

    const changeDate = (date: any, dateString: any) => {
        setState({ value: dateString, header: state.header });
        props.model.setRecordValue(props.record, props.dataIndex, dateString);
    }

    const changeInput = (v: any) => {
        setState({ value: v.target.value, header: state.header });
        props.model.setRecordValue(props.record, props.dataIndex, v.target.value);
    }

    const changeSelect = (v: any) => {
        setState({ value: v, header: state.header });
        props.model.setRecordValue(props.record, props.key, v, state.header.items.find((r: any) => r.getObject().value === v));
    }

    const changeAutocomplete = (v: any) => {
        setState({ value: v, header: state.header });
        props.model.setRecordValue(props.record, props.dataIndex, v, state.header.items.find((r: any) => r.getObject().value === v));
    }

    const CellAutocomplete = () => {
        return (
            <AutoCompleteAnt
                value={state.value}
                defaultValue={state.value}
                onChange={changeAutocomplete}
                style={{
                    borderRadius: 3,
                    margin: '-5px -1200px -5px -12px',
                    width: '100%'
                }}
            >
                { state.header.items.filter(r => !!state.value ? (r.getObject().value).toString().includes(state.value) : true).map((r: Item) => {
                    let obj = r.getObject();
                    return (
                        <SelectAnt.Option key={obj.key} value={obj.value}>
                            <CellSelectOption item={obj} />
                        </SelectAnt.Option>
                    )
                })}
            </AutoCompleteAnt>
        )
    }

    const CellSelect = () => {
        return (
            <SelectAnt
                value={state.value}
                defaultValue={state.value}
                onChange={changeSelect}
                style={{
                    borderRadius: 3,
                    margin: '-5px -1200px -5px -12px',
                    width: '100%'
                }}
            >
                { state.header.items.map((r: Item) => {
                    let obj = r.getObject();
                    return (
                        <SelectAnt.Option key={obj.key} value={obj.value}>
                            <CellSelectOption item={obj} />
                        </SelectAnt.Option>
                    )
                })}
            </SelectAnt>
        )
    }

    const CellInput = () => {
        return (
            <Input
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
        )
    }

    const CellDate = () => {
        return (
            <DatePickerAnt
                defaultValue={dayjs(state.value, 'YYYY-MM-DD')} format={'YYYY-MM-DD'}
                onChange={changeDate}
                style={{
                    borderRadius: 3,
                    margin: '-5px -1200px -5px 0px',
                    width: '100%'
                }}
            />
        )
    }

    if (props.record?.editable && state.header?.editable && (props.editing || !props.editTogglable)) {
        return (
            <div>
                {
                    (state.header && state.header.type === 'date') && CellDate() ||
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

const handleRowProps = (key: any, { model, render }: any) => {

    return ({
        key: key,
        render: (value: any, record: any) => {

            if (!value && render) return render(value, record);
            return <Cell
                key={key}
                model={model}
                value={value}
                record={record}
                render={render}
                editTogglable={model._actions.some((r: any) => r._key === 'edit')}
                editing={model?.getEditingKeys().includes(record.key)}
                deleted={model?.getDeletedKeys().includes(record.key)}
                dataIndex={key}
            />
        }
    })
}

export default {
    handleRowProps
};