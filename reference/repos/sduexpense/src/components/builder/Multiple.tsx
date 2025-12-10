import React, {useEffect, useState} from "react";
import {
    Action,
    Button,
    List as ListModel,
    Section as SectionModel,
    Multiple as MultipleModel, ListItem, Space, ListHeader,
} from '../../typescript';
import Section from "../Section";
import {ArrowDownOutlined, ArrowUpOutlined, CloseOutlined, PlusOutlined} from "@ant-design/icons/lib";

const Multiple = (props: any) => {

    let model: MultipleModel = props.model;

    let buildSection = (data?: any) =>
    {
        let section = new SectionModel();
        let defaultItem: any = {};
        let defaultWidth: any = {};
        let defaultEditable: any = {};

        model._headers.forEach((r: ListHeader) => defaultItem[r._key] = r._default ?? '');
        model._headers.forEach((r: ListHeader) => r._width = r._width ?? Math.floor(100 / (model._headers.length - model._headerHide.length)) + '%');

        defaultEditable = model._headers.filter((r: ListHeader) => r._editable).map((r: ListHeader) => r._key);

        let list: ListModel = new ListModel()
            .default(data ?? model._default)
            .addDummyColumn(true)
            .emptyIcon(PlusOutlined)
            .emptyText('Press \'Add empty row\' to add an item to the table.')
            .footer(false)
            .headerCreate(false)
            .headerHide(model._headerHide)
            .headerWidth(defaultWidth)
            .editable(defaultEditable)
            .onChange((v: any) => {
                let data: any = [];
                v.forEach((d: any) => {
                    let obj: any = {};
                    model._headers.forEach((k: ListHeader) => {
                        obj[k._key] = d._objects[k._key]?._object ?? d[k._key];
                    })
                    data.push(obj);
                });
                onChange(data, v);
            })

        model._headers.forEach((r: ListHeader) => list.headerPrepend(r));

        if (model._orderable) {
            list.actions(new Action().icon(ArrowUpOutlined).callback(({ record }: any) => list.moveRecord(record, -1)))
            list.actions(new Action().icon(ArrowDownOutlined).callback(({ record }: any) => list.moveRecord(record, 1)))
        }

        list.actions(new Action().icon(CloseOutlined).callback(({ record }: any) => list.removeRecord(record)))

        section.add(list)
        section.add(new Space().top(12))
        section.add(new SectionModel().row().end()
            .add(new Button()
                .link()
                .ignoreClear()
                .loadable(false)
                .action(new Action()
                    .label('Add empty row')
                    .callback(() => list.setRecord(new ListItem(defaultItem, list))))
            ))

        return section;
    }

    const [section, setSection] = useState<any>({
        key: 0,
        section: buildSection()
    });

    /** === FORMULA SPECIFIC === */

    const onChange = (value: any, object: any, rebuild: boolean = false) =>
    {
        model._defaultObject = {
            value: value,
            object: object,
        }

        if (model._formula) model.value(value);
        model._onChange?.(model._defaultObject);

        /** Debug purposes */
        if (model._key) {
            if (value) {
                window.localStorage.setItem(`multiple:${model._key}`, JSON.stringify(model._defaultObject));
            } else {
                window.localStorage.removeItem(`multiple:${model._key}`);
            }
        }
    };

    const onClear = () => {
        model._data = undefined;
        if (model._formula) model.value(undefined);
    };

    model._onError = () => onClear();
    model._onComplete = () => onClear();

    // Register the defaultValue to the formula.
    if (model._default && model._formula) {
        model.value(model._default);
    }

    useEffect(() => {
        /** Debug purposes */
        try {
            let store = window.localStorage.getItem(`multiple:${model._key}`);
            if (store) {
                let data = JSON.parse(store);
                setTimeout(() => {
                    // onChange(data.value, data.object, true);
                }, 250);
            }
        } catch (e) { console.log(e) }
    }, [])

    return (
        <div style={model._style ?? {}}>
            <Section key={section.key} main={props.main} section={section.section} parent={model}/>
            { model._required && model._data === undefined && <div style={{ color: '#ff4d4f', fontSize: 14, fontWeight: 300, paddingTop: 6, paddingBottom: 12 }}>Required field</div>
                || <div style={{ paddingTop: 12 }}/>
            }
        </div>
    )
}

export default Multiple;