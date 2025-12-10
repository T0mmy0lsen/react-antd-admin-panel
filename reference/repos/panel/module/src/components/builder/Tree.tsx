import React, {useEffect, useState} from "react";
import {Tree as TreeAnt, Col} from 'antd';
import {
    Tree as TreeModel,
    Section as SectionModel, debounce,
} from "../../typescript";
import {DownOutlined} from "@ant-design/icons/lib";
import  { TreeItem as TreeItemModel } from "../../typescript";
import TreeItem from './TreeItem';

const Tree = (props: any) => {

    // The tree-model created in /views/*.tsx
    let model: TreeModel = props.model;

    let root = (() => {
        let root: TreeItemModel = model._default;
        root.get(model._getOnChild(root));
        return [root];
    })();

    const [loadedKeys, setLoadedKeys] = useState<any[]>([]);
    const [expandedKeys, setExpandedKeys] = useState<any[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<any[]>([]);
    const [tree, setTree] = useState<any>();

    /** ===================================================== */

    const getKeysOfChildren = (item: TreeItemModel) =>
    {
        let arr: any = [];

        let iterate = (el: TreeItemModel, ignore: boolean = false) => {
            if (!ignore) arr.push(el.key);
            el.children.forEach((r: TreeItemModel) => iterate(r));
        }

        iterate(item, true);

        return arr;
    }

    const getItemFromKey = (el: TreeItemModel, key: string) =>
    {
        let item: any = undefined;

        el.children.forEach(r => {
            if (r.key === key) {
                item = r;
            } else {
                let temp = getItemFromKey(r, key);
                if (temp) item = temp;
            }
        });

        return item;
    }

    // 3.1
    const expandNode = (expandedKeys: any, event: any) =>
    {
        if (loadedKeys.includes(event.node.key) && event.expanded)
        {
            let keysOfChildren = getKeysOfChildren(event.node);
            let nextLoadedKeys = loadedKeys.filter((r: any) => !keysOfChildren.includes(r));
            setLoadedKeys(nextLoadedKeys);
            fetchChildren(event.node.key, () => setAndStoreExpandedKeys(expandedKeys));
        } else {
            setAndStoreExpandedKeys(expandedKeys);
        }
    };

    // 3.
    // Expand and shot edit on select
    const selectNode = (selectedKeys: any, event: any, ignoreFetch: boolean = false) =>
    {
        setAndStoreSelectedKeys(selectedKeys);

        if (selectedKeys.length && event.node._canBeEdited) {
            props.main._setSiderRightLoading(true);
            model.editBuild(
                event.node,
                (sectionEdit: SectionModel) => {
                    props.main._setSiderRight(sectionEdit);
                    props.main._setSiderRightLoading(false);
                },
                props.main,
                model
            );
        } else {
            props.main._setSiderRightClose();
        }

        if (
            !ignoreFetch &&
            !model._getOnChildIgnoreIf?.(event.node) &&
            selectedKeys.length &&
            !expandedKeys.includes(selectedKeys[0])
        ) {
            let keysOfChildren = getKeysOfChildren(event.node);
            let nextLoadedKeys = loadedKeys.filter(r => !keysOfChildren.includes(r));
            setLoadedKeys(nextLoadedKeys);

            fetchChildren(selectedKeys[0], () => {
                setLoadedKeys(loadedKeys.concat(selectedKeys[0]))
                if (!expandedKeys.includes(selectedKeys[0])) {
                    setAndStoreExpandedKeys(expandedKeys.concat(selectedKeys[0]));
                }
            })
        }
    };

    // 2.1
    // Fetch children for a given key.
    const fetchChildren = (key: any, next: any) =>
    {
        const complete =
            debounce((children: any) => {
                setTree(drawTreeItems(root));
                children.forEach((r: TreeItemModel) => {
                    if (selectedKeys.includes(r.key)) {
                        props.main._setSiderRightLoading(true);
                        model.editBuild(
                            r,
                            (sectionEdit: SectionModel) => {
                                props.main._setSiderRight(sectionEdit);
                                props.main._setSiderRightLoading(false);
                            },
                            props.main,
                            model
                        );
                    }
                })
                next();
            }, 150, false);

        const iterate = (children: any, key: any) => {
            children.forEach((item: TreeItemModel) => {
                if (key === item.key) {
                    item.onThen((r: any, children: any) => {
                        item.children = children.map((n: TreeItemModel) => n.get(model._getOnChild(n)));
                        if (!item.children.length) item.leaf();
                        // @ts-ignore
                        complete(item.children);
                    });
                    item.fetch();
                } else if (item.children.length) {
                    iterate(item.children, key);
                }
            });
        }

        iterate(tree, key);
    };

    // 2.
    // Load when a key should expand
    const loadChildren = ({ key, children }: any) =>
    {
        return new Promise<void>((next: any) => {
            if (children && children.length) {
                next();
                return;
            } else {
                fetchChildren(key, next);
            }
        });
    }

    // 1.
    // Draws titles on the items.
    const drawTreeItems = (items: TreeItemModel[], parent: any = undefined) =>
    {
        return items.filter((r: TreeItemModel) => r._show).map(item =>
        {
            // Set the ReactNode
            item.title = <TreeItem parent={model} model={item}></TreeItem>
            item.parent(parent);

            // Recursive call draw on children.
            if (item.children.length) {
                item.children = drawTreeItems(item.children, item);
            }

            return item;
        })
    }

    const setAndStoreExpandedKeys = (value: any) => {
        setExpandedKeys(value);
        try { window.localStorage.setItem(`expandedKeys:${props.main.Store.cycle?._path._actualPath}`, JSON.stringify(value)); } catch (e) {}
    }

    const setAndStoreSelectedKeys = (value: any) => {
        setSelectedKeys(value);
        try { window.localStorage.setItem(`selectedKeys:${props.main.Store.cycle?._path._actualPath}`, JSON.stringify(value)); } catch (e) {}
    }

    model.selectNode = (key: any) =>
    {
        let item = getItemFromKey(tree[0], key);
        if (item) selectNode(item ? [item.key] : [], { node: item });
    }

    model.reloadLocal = (item: any) =>
    {
        if (item.key !== 0 && !item._parent) return;

        let prevExpandedKeys = [ ...expandedKeys ];
        let nextExpandedKeys: any;
        let node: any;

        if (item.key === 0) {
            node = item;
            nextExpandedKeys = expandedKeys.filter(r => r !== 0);
        } else {
            node = item._parent;
            nextExpandedKeys = expandedKeys.filter(r => r !== item.key && r !== item._parent.key);
        }

        expandNode(nextExpandedKeys, { expanded: false, node: node });
        setTimeout(() => {
            expandNode(prevExpandedKeys, { expanded: true, node: node });
        }, 200);
    };

    useEffect(() =>
    {
        setTree(root[0] ? drawTreeItems(root) : []);
        let expandedKeys = [root[0].key];
        let selectedKeys = [root[0].key];

        if (model.env.cacheTree) {
            try {
                let storedExpandedKeys = window.localStorage.getItem(`expandedKeys:${props.main.Store.cycle?._path._actualPath}`)
                let storedSelectedKeys = window.localStorage.getItem(`selectedKeys:${props.main.Store.cycle?._path._actualPath}`)
                if (storedExpandedKeys) expandedKeys = JSON.parse(storedExpandedKeys);
                if (storedSelectedKeys) selectedKeys = JSON.parse(storedSelectedKeys);
            } catch (e) {}
        }

        setAndStoreExpandedKeys(expandedKeys);
        setAndStoreSelectedKeys(selectedKeys);

    }, []);

    return (
        <Col>
            <TreeAnt
                loadData={loadChildren}
                treeData={tree}
                onSelect={selectNode}
                onExpand={expandNode}
                selectedKeys={selectedKeys}
                onLoad={setLoadedKeys}
                loadedKeys={loadedKeys}
                expandedKeys={expandedKeys}
                switcherIcon={<DownOutlined style={{ fontSize: 12, opacity: 0.5 }}/>}
                showLine={{ showLeafIcon: false }}
            />
        </Col>
    );
}

export default Tree;