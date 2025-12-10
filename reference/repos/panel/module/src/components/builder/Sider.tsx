import React, {useEffect} from "react";
import {Menu} from "antd";
import {Button as ButtonModel, Main} from "../../typescript";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const Sider = (props: any) => {

    const main: Main = props.main;
    const [openKeys, setOpenKeys] = React.useState<string[]>([]);
    const [defaultKey, setDefaultKey] = React.useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);

    const Icon = (model: ButtonModel, marginRight: number = 8) => {
        if (model._action?._fontawesome) return (<FontAwesomeIcon style={{ opacity: .6, marginRight: marginRight, width: 26 }} icon={model._action._fontawesome} />)
        if (model._fontawesome) return (<FontAwesomeIcon style={{ opacity: .6, marginRight: marginRight, width: 26 }} icon={model._fontawesome} />)
        if (model._action?._icon) return <model._action._icon />
        if (model._icon) return <model._icon />
        return <Empty/>
    };

    const Empty = () => {
        return (
            <></>
        )
    };

    function getItem(i: any, field: any, handleClick, children = undefined) {
        let access = main.$access(field._access);
        let hide = access.hidden;
        let el = hide ? null : {
            disabled: !access.access,
            key: field._fields.length ? `sub-${i}` : main.$path(field._action._route())?._matchedPath,
            icon: Icon(field),
            label: field._action?._label ?? field._label ?? '',
        };
        if (el && children != undefined) {
            el['children'] = children;
        } else if (el) {
            el['onClick'] = () => handleClick(field._action._route())
        }
        return el;
    }

    function handleClick(to: any) {
        console.log(to);
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
        <>
            <Menu
                mode="inline"
                style={{ height: 'calc(100vh - 236px)', paddingTop: 0 }}
                openKeys={openKeys}
                onOpenChange={onOpenChange}
                selectedKeys={selectedKeys.length ? selectedKeys : [main.$config.config.defaultRoute()]}
                defaultSelectedKeys={defaultKey.length ? defaultKey : [main.$config.config.defaultRoute()]}
                items={
                    props.model._fields.map((field: any, i: number) => {
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
        </>
    );
};

export default Sider;