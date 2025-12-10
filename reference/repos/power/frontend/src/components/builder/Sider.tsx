import React, {useEffect} from "react";
import {Col, Menu, Row} from "antd";
import {Button as ButtonModel, Main} from "../../typescript";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const Sider = (props: any) => {

    const main: Main = props.main;
    const [openKeys, setOpenKeys] = React.useState<string[]>([]);
    const [defaultKey, setDefaultKey] = React.useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);

    const Icon = (model: ButtonModel, marginRight: number = 8) => {
        if (model._fontawesome || model._action?._fontawesome) return (
            <div style={{ textAlign: 'center', height: 50, paddingTop: 2 }}>
                <FontAwesomeIcon
                    style={{ opacity: .5, fontSize: model._style.fontSize ?? '16px' }}
                    icon={model._fontawesome ?? model._action?._fontawesome}
                />
                <div style={{ fontSize: 10, marginTop: -22 }}>{model._action?._label ?? model._label ?? ''}</div>
            </div>
        )
        if (model._action?._icon) return <model._action._icon />
        if (model._icon) return <model._icon />
        return <Empty/>
    };

    const Empty = () => {
        return (
            <></>
        )
    };

    function getItemHeader(i: any, field: any) {
        return ({
            key: 0,
            style: { height: 54, paddingLeft: 0, paddingRight: 0 },
            onClick: () => field._action.callCallback(),
            label: (
                <div style={{textAlign: 'center', height: 50, paddingTop: 8 }}>
                    <FontAwesomeIcon
                        style={{ opacity: .6, fontSize: 22, color: '#858585' }}
                        icon={field._fontawesome}
                    />
                </div>
            )
        });
    }

    function getItem(i: any, field: any, handleClick, children = undefined)
    {
        let access = main.$access(field._access);
        let el = access.hidden || !access.access ? null : {
            disabled: !access.access,
            key: field._fields.length ? `sub-${i}` : main.$path(field._action._route())?._matchedPath,
            style: {height: 54, paddingLeft: 0, paddingRight: 0 },
            label: Icon(field),
        };
        if (el && children != undefined) {
            el['children'] = children;
        } else if (el) {
            el['onClick'] = () => handleClick(field._action._route())
        }
        return el;
    }

    function handleClick(to: any)
    {
        let goTo = typeof to === 'function' ? to() : to;
        setSelectedKeys([goTo]);
        main.$route(goTo);
    }

    const onOpenChange = (keys) => {
        const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
        setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    };

    props.main.$function((e) => setSelectedKeys(e), 'setSelectedKeys');

    return (
        <div style={props.model._style}>
            <Menu
                mode="inline"
                style={{ height: 'calc(100vh - 236px)', paddingTop: 0, background: '#f0f0f0', borderInlineEnd: '0px' }}
                openKeys={openKeys}
                onOpenChange={onOpenChange}
                selectedKeys={selectedKeys.length ? selectedKeys : [main.$config.config.defaultRoute()]}
                defaultSelectedKeys={defaultKey.length ? defaultKey : [main.$config.config.defaultRoute()]}
                items={
                    props.model._fields.map((field: any, i: number) =>
                    {
                        if (!field._fields.length) {
                            return getItem(i, field, handleClick);
                        } else {
                            let children = field._fields.map((f: any, y: number) => {
                                return getItem(`${i}-${y}`, f, handleClick);
                            });
                            return getItem(i, field, handleClick, children);
                        }
                    })
                }
            />
        </div>
    );
};

export default Sider;