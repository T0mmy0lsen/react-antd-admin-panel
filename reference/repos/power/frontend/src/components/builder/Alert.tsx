import React, {useState} from "react";
import {Alert as AlertAnt, Typography} from "antd";
import {Alert as AlertModel, Item} from "../../typescript"

const Message = (item: Item) => {
    return (
        <div>
            { item._value.value && <Typography.Text style={{ fontSize: 14 }}>{ item._value.value }</Typography.Text> }
            { item._render?.() ?? null }
        </div>
    )
}

const Alert = (props: any) =>
{
    let model: AlertModel = props.model;
    const [item, setState] = useState<Item>(model._fields[0])

    return (
        <AlertAnt message={Message(item)} type={'info'} closable={true} afterClose={() => model._onChange(false)}/>
    )
}

export default Alert;