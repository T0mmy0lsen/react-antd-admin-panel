import React, {useState} from "react";

import {Button, Modal as ModalAnt} from "antd"
import Section from "../Section";

const Modal = (props: any) => {
    const [visible, setVisible] = useState(false);
    const showModal = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };
    const onOk = () => {
        setVisible(false);
    };
    return (
        <>
            <Button type="primary" onClick={showModal}>
                Open
            </Button>
            <ModalAnt
                style={props.model._style}
                width={props.model._size}
                mask={props.model._mask}
                maskClosable={props.model._maskClosable}
                visible={visible}
                closable={false}
                onOk={onOk}
                onCancel={onClose}

            >
                <Section main={props.main} section={props.model} form={props.form} />
            </ModalAnt>
        </>
    );
}

export default Modal;