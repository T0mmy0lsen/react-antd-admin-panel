import React, {useEffect, useRef, useState} from 'react';

import SectionComponent from "./Section";
import Mapping from "./Mapping";
import Header from './Header';

import {Button, Divider, Layout, Modal, Tooltip, Col, Row, Progress} from "antd";
import {CloseOutlined, MenuOutlined} from "@ant-design/icons/lib";
import {BrowserRouter, Route as RouteComponent, Routes} from "react-router-dom";
import Route from "../typescript/models/Route";
import Main from "../typescript/main";

const LoadingTopBar = () =>
{
    const [progress, setProgress] = useState(0);
    const interval = [5, 25, 50, 75, 85, 90, 95]
    const mounted = useRef(false);

    const increase = (i: number) => {
        setProgress(interval[i]);
        if (i < 6) {
            setTimeout(() => {
                if (mounted.current) increase(i + 1)
            }, 100);
        }
    }

    useEffect(() => {
        mounted.current = true;
        setTimeout(() => {
            if (mounted.current) increase(0)
        }, 100);
        return () => {
            mounted.current = false;
        };
    }, []);

    return (
        <div style={{ top: 0, left: 0, height: 24, width: '100vw',  position: 'absolute', overflow: 'hidden' }}>
            <div style={{ top: -14, left: '-5vw', zIndex: 11, width: '110vw', position: 'absolute' }}>
                <Progress
                    strokeLinecap={'square'}
                    percent={progress}
                    status={'active'}
                />
            </div>
        </div>
    )
}

const LoadingTopBarComplete = () =>
{
    const [show, setShow] = useState(true);
    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;
        setTimeout(() => {
            if (mounted.current) setShow(false)
        }, 250);
        return () => {
            mounted.current = false;
        };
    }, []);

    if (!show) return null;

    return (
        <div style={{ top: 0, left: 0, height: 24, width: '100vw',  position: 'absolute', overflow: 'hidden' }}>
            <div style={{ top: -14, left: '-5vw', zIndex: 11, width: '110vw', position: 'absolute' }}>
                <Progress
                    strokeLinecap={'square'}
                    percent={100}
                />
            </div>
        </div>
    )
}

export default class App extends React.Component<any, any> {

    main: Main;
    defaultModal: any = {
        modal: {
            key: 0,
            title: 'Title',
            label: 'Label',
            visible: false,
            section: false,
            handleOk: () => {},
            handleCancel: () => {},
        }
    }

    state = {
        toggleLoading: (value: any) => this.setState({ loading: value }),
        siderRightSection: { _key: 0, refresh: () => {} },
        sider: undefined,
        loadingRightSection: false,
        loading: true,
        initiated: false,
        booted: false,
        modalLoading: false,
        modal: this.defaultModal,
        collapsed: !!this.props.config?.config?.drawer?.collapsed,
        routeKey: '/',
    };

    constructor(props: any)
    {
        super(props);

        this.main = new Main(this, this.props.config);
        this.main.setModal((v: any) => this.setState({ modal: v }))
        this.main.setRouteKey((v: any) => this.setState({ routeKey: v }))
        this.main.setModalClose(() => this.setState(this.defaultModal))
        this.main.setModalLoading((v: any) => this.setState({ modalLoading: v }))
        this.main.setSiderRight((v: any) => this.setState({ siderRightSection: v }))
        this.main.setSiderRightLoading((v: any) => this.setState({ loadingRightSection: v }))
        this.main.setSiderRightReload(() => this.state.siderRightSection?.refresh())
        this.main.setSiderRightClose(() => this.setState({ siderRightSection: { _key: 0, refresh: () => {} } }))
    }

    componentDidMount() {
        let route = () => {
            this.main.$route(`${document.location.pathname}${document.location.search}`,
                () => this.setState({ initiated: true }),
                () => this.main.$config.config.bootFailed(this.main));
        }
        if (this.main.$config.config.boot) {
            this.main.$config.config.boot(this.main, route);
        } else {
            route();
        }
    }

    getRouteComponent(main: Main, route: Route, i: number) {
        if (!this.state.initiated) return;
        return (
            <RouteComponent
                key={i}
                path={route._path._matchedPath}
                element={<route.Component main={main} />}
            />
        );
    }

    getHeader() {
        if (this.main.$config.config?.hideHeader) return (<></>);
        return (
            <Row justify={'start'}>
                <Row style={{ width: '100%' }}>
                    <Row justify={'start'} style={{ width: '50%' }}>
                        <Header
                            main={this.main}
                            logo={this.main.$config.config?.pathToLogo}
                        >
                            <div style={{ marginTop: 2, marginLeft: 36 }}>
                                <MenuOutlined onClick={() => this.setState({ collapsed: !this.state.collapsed})} />
                            </div>
                        </Header>
                    </Row>
                    <Row justify={'end'} style={{ width: '50%' }}>
                        {
                            this.state.initiated &&
                            this.main.$config.config.profile &&
                            <Layout.Header className="site-layout" style={{ padding: 0, marginRight: 36 }}>
                                <SectionComponent main={this.main} section={this.main.$config.config.profile} style={{ width: '100%' }}/>
                            </Layout.Header>
                        }
                    </Row>
                </Row>
                <Divider style={{ margin: '0px' }}/>
            </Row>
        )
    }

    render() {
        return (
            <BrowserRouter>
                <Mapping main={this.main} state={this.state} props={this.props}/>
                { this.state.modal
                && (
                    <Modal
                        key={this.state.modal.key}
                        title={this.state.modal.title}
                        visible={this.state.modal.visible}
                        onOk={this.state.modal.handleOk}
                        confirmLoading={this.state.modalLoading}
                        onCancel={this.state.modal.handleCancel}
                        closeIcon={<CloseOutlined style={{ fontSize: 12, opacity: 0.8 }}/>}
                    >
                        { this.state.modal.section ? (
                            <SectionComponent key={this.state.modal.section._key} main={this.main} section={this.state.modal.section}/>
                        ) : <p>{this.state.modal.label}</p> }
                    </Modal>
                )
                }
                { this.state.initiated && (
                    <Layout style={{ backgroundColor: 'transparent' }}>
                        { this.state.loading ? <LoadingTopBar /> : <LoadingTopBarComplete /> }
                        { this.main.$config.drawer
                            ? (
                                <Layout.Sider
                                    trigger={null}
                                    collapsed={this.state.collapsed}
                                    collapsible
                                    collapsedWidth={0}
                                    className="site-layout"
                                    width={236}
                                    style={{ minHeight: '100vh', height: '100%', left: 0, position: 'fixed', zIndex: 10 }}
                                >
                                    <Row>
                                        <Col>
                                            <Divider type="vertical" style={{ height: 64, margin: 0, top: 0 }} orientation="right"/>
                                        </Col>
                                    </Row>
                                    <Divider style={{ margin: 0 }}/>
                                    <SectionComponent main={this.main} section={this.main.$config.drawer} />
                                </Layout.Sider>
                            ) : <></>
                        }
                        <Layout className="site-layout" style={{
                            marginRight: this.state.siderRightSection._key ? 500 : 0,
                            marginLeft: this.state.collapsed ? 0 : 236,
                        }}>
                            {this.getHeader()}
                            <Layout className="site-layout" key={ this.state.routeKey }>
                                <Row justify={'start'}>
                                    <Col span={24}>
                                        <Layout.Content style={{ overflow: 'auto', height: 'calc(100vh - 65px)' }}>
                                            <Routes>
                                                {Object.keys(this.main.$config.routes).map((key: string, i: number) => {
                                                    let route: Route = this.main.$config.routes[key];
                                                    return this.getRouteComponent(this.main, route, i);
                                                })}
                                            </Routes>
                                        </Layout.Content>
                                    </Col>
                                </Row>
                            </Layout>
                        </Layout>
                        <Layout.Sider
                            trigger={null}
                            collapsed={!this.state.siderRightSection._key}
                            collapsible
                            collapsedWidth={0}
                            className="site-layout"
                            width={500}
                            style={{ minHeight: '100vh', height: '100%', position: 'fixed', right: 0, padding: 0, overflow: 'auto' }}
                        >
                            <Row>
                                <Divider type={'vertical'} style={{ height: '100vh', margin: 0 }}/>
                                <Layout style={{ backgroundColor: '#d3d3d326', margin: 0, width: 480, minHeight: '100vh', height: '100%' }}>
                                    <Layout.Header className="site-layout" style={{ padding: 0, height: 64 }}>
                                        <Row justify={'end'} style={{ marginRight: 24, marginTop: 20 }}>
                                            <Tooltip title="Close">
                                                <Button
                                                    shape="circle"
                                                    size={"small"}
                                                    icon={<CloseOutlined style={{ fontSize: 10, opacity: 0.6 }}/>}
                                                    onClick={() => this.main._setSiderRightClose()}
                                                />
                                            </Tooltip>
                                        </Row>
                                    </Layout.Header>
                                    <Divider style={{ margin: '0px' }}/>
                                    <div style={{ marginRight: 24, marginLeft: 24 }}>
                                        {
                                            this.state.siderRightSection._key ? (
                                                <SectionComponent key={this.state.siderRightSection._key} main={this.main} section={this.state.siderRightSection} />
                                            ) : null
                                        }
                                    </div>
                                </Layout>
                            </Row>
                        </Layout.Sider>
                    </Layout>
                )}
            </BrowserRouter>
        );
    }
}
