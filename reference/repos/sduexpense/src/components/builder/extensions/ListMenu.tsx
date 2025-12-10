import React, {useEffect} from "react";
import Section from "../../Section";
import {Button, Dropdown} from "antd";
import {EllipsisOutlined} from "@ant-design/icons/lib";
import {ListItem} from "../../../typescript";

const Actions = ({
    parentProps,    // Props for the List.tsx
    parentModel,    // List
    section,        // Section for the menu
    record,         // ListItem
}: any) => {

    const menu = (
        <Section key={record.key} main={parentProps.main} section={section} args={{ list: parentModel, record: record }}/>
    )

    useEffect(() => {

    }, [])

    return (
        <Dropdown overlay={menu} placement="bottomCenter">
            <Button type={'link'} color={'default'}>
                <EllipsisOutlined />
            </Button>
        </Dropdown>
    )
}

const handleMenuProps = ({ props, model }: any) => ({
    key: 'menu',
    title: '',
    width: '10%',
    align: 'right',
    render: (record: ListItem) => {
        return <Actions
            parentProps={props}
            parentModel={model}
            section={record._menuSection}
            record={record}
        />
    }
});

export default handleMenuProps;