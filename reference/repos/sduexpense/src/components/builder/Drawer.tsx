import React, {useState} from "react";

import {Button, Drawer as DrawerAnt} from "antd"
import Section from "../Section";

const Drawer = (props: any) => {
    const [visible, setVisible] = useState(false);
    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };
    return (
        <>
            <Button type="primary" onClick={showDrawer}>
                Open
            </Button>
            <DrawerAnt
                placement={props.model._align}
                width={props.model._size}
                visible={visible}
                closable={false}
                onClose={onClose}
            >
                <Section main={props.main} section={props.model} form={props.form} />
            </DrawerAnt>
        </>
    );
}

export default Drawer;