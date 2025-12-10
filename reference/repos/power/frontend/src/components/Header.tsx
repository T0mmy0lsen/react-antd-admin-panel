import React from "react";
import {Layout, Row, Col} from "antd";

const Header = (props: any) => {
    if (!props.logo) {
        return (
            <Layout.Header className="site-layout" style={{ padding: 0 }}>
                <Row />
            </Layout.Header>
        );
    }
    if (props.logo.textLogo) {
        return (
            <Layout.Header className="site-layout" style={{ padding: 0, lineHeight: 'initial' }}>
                <Row align="middle" style={{ height: '100%' }}>
                    <Col>
                        <div style={props.logo.style}>{props.logo.text}</div>
                    </Col>
                </Row>
            </Layout.Header>
        );
    }
    return (
        <Layout.Header className="site-layout" style={{ padding: 0 }}>
            <Row>
                {props.children}
                <Col>
                    <img
                        alt=""
                        width={props.logo.width ?? 109}
                        height={props.logo.height ?? 30}
                        src={props.logo.src ?? props.logo}
                        style={props.logo.style ?? { marginBottom: 4, marginLeft: 36 }}
                    />
                </Col>
            </Row>
        </Layout.Header>
    );
}

export default Header;