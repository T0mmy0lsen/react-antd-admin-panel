import React from "react";
import Button from "./Button";
import {MenuItem} from "../../typescript";
import {Col, Menu as MenuAnt} from 'antd';

const Menu = (props: any) => {
    return (
        <Col>
            { props.model._fields.map((r: MenuItem, key: number) => <Button key={key} model={r._fields[0]}/>) }
        </Col>
    )
}

export default Menu;