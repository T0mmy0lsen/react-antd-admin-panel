import React, {useState} from "react";
import {Alert as AlertAnt, Typography} from "antd";
import {Alert as AlertModel, Item} from "../../typescript"

const Inner = (args: any) => {
    return (
        <div>
            { args._description && <Typography.Text style={{ fontWeight: 300, fontSize: 12 }}>{ args._description }</Typography.Text> }
            { args._title && <Typography.Title level={4} style={{ fontWeight: 400, marginTop: 0, marginBottom: 0 }}>{args._title}</Typography.Title> }
            { args._text && <Typography.Text style={{ fontSize: 14 }}>{ args._text }</Typography.Text> }
            { args._render?.() ?? null }
        </div>
    )
}

const Alert = (props: any) =>
{
    let model: AlertModel = props.model;
    let value: any = model._fields[0];

    const [state, setState] = useState<Item>(value)

    return (
        <AlertAnt message={Inner(state)} type={state._type ?? 'info'} closable={model._clearable} afterClose={() => model._onChange(false)}/>
    )
}

export default Alert;