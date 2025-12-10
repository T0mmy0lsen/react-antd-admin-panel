import React, {useEffect, useState} from "react";
import {ConfigProvider, Table} from "antd";
import {CloseCircleOutlined} from "@ant-design/icons/lib";

import handleSearchProps from "./extensions/ListSearch";
import handleActionProps from "./extensions/ListActions";
import ListEdit from "./extensions/ListEdit";

import Section from "../Section";

import {Helpers, Item, List as ListModel, ListHeader, ListItem} from "../../typescript";
import handleMenuProps from "./extensions/ListMenu";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";
import handleDefaultProps from "./extensions/ListDefault";

const List = (props: any) => {

    const model: ListModel = props.model;
    const addProps: any = {};

    const [deletedKey, setDeletedKey] = useState<any>([]);
    const [editingKey, setEditingKey] = useState<any>([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);
    const [searchValue, setSearchValue] = useState<any>([]);
    const [columnValue, setColumnValue] = useState<any>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);

    const [sourceData, setSourceDataState] = useState<any>({
        d: [],
        h: [],
        f: model.getDefaultFilter(),
        p: model._pageSize ?? 20,
        s: { text: '', column: '' },
        who: { caller: '', _onComplete: () => {} }
    });

    const setSourceData = (data: any, who?: any) => {
        setSourceDataState({
            d: data.d ?? sourceData.d,
            h: data.h ?? sourceData.h,
            f: data.f ?? sourceData.f,
            p: data.p ?? sourceData.p,
            s: data.s ?? sourceData.s,
            who: who ?? sourceData.who
        })
    }

    // Create the header-object and the row-render function.
    const handleCreateHeader = (data: any) => {
        if (!data[0]) return [];
        let remove = ['key', 'index'];
        return Object.keys(data[0]._object)
            .filter(r => !remove.includes(r))
            .map((r: string) => {
                return ListEdit.handleRowProps(r, { model: model })
            });
    }

    const handleHeader = (data: any, filters: any) => {

        let header: any = model._headerCreate ? handleCreateHeader(data) : [];

        props.model._headerAppend.forEach((r: ListHeader) => {
            r._render = ListEdit.handleRowProps(r._key, { model: model, render: r._renderCustom, onChange: r._onChange }).render;
            header = [ ...[r.getObject()], ...header ]
        })

        props.model._headerPrepend.forEach((r: ListHeader) => {
            r._render = ListEdit.handleRowProps(r._key, { model: model, render: r._renderCustom, onChange: r._onChange }).render;
            header = [ ...header, ...[r.getObject()] ]
        })

        // Hide headers and build default header object
        header = header
            .filter((r: any) => !props.model._headerHide.includes(r.key) && !r.key.startsWith('_'))
            .map((col: any) => {
                return handleDefaultProps(col, { data: data });
            });

        header = header
            .map((col: any) => {
                if (col.filterable || col.searchable) col.filteredValue = filters[col.dataIndex] || null;
                return col;
            });

        // Make the column searchable
        header = header.map((col: any) => {
            if (!col.searchable) return col;
            return {
                ...col,
                ...handleSearchProps(col, { filteredInfo: sourceData.f })
            }
        })

        // Dummy column.
        if (props.model._addDummyColumn || props.model._emptyColumn) {
            header = [ ...[{ key: '', title: '', width: '12px', align: 'right' }], ...header]
        }

        // Action column.
        if (props.model._actions.length) {
            header = [...header, ...[handleActionProps({ model: model, props: props })]];
        }

        // Menu column.
        if (props.model._menuSection) {
            header = [...header, ...[handleMenuProps({ model: model, props: props })]];
        }

        return header;
    }

    const customizeRenderEmpty = () => {
        return (
            <div style={{ textAlign: 'center' }}>
                { model._emptyIcon ? <model._emptyIcon style={{ fontSize: 20, marginTop: 8 }} /> : <CloseCircleOutlined style={{ fontSize: 20, marginTop: 12 }} /> }
                { model._emptyText ? <p>{ model._emptyText }</p>: <p>The list is empty</p> }
            </div>
        );
    }

    const onExpandedRowsChange = (keys: string[]) => {
        if (model._expandableSingles && expandedRowKeys.length) {
            setExpandedRowKeys([keys[keys.length - 1]])
        } else {
            setExpandedRowKeys(keys);
        }
    }

    if (model._expandableSectionActive?.() ?? model._expandableSection) {
        addProps['expandable'] = {
            expandRowByClick: model._expandableByClick,
            expandedRowKeys: expandedRowKeys,
            rowExpandable: (record: any) => model._expandable?.(record) ?? false,
            onExpandedRowsChange: onExpandedRowsChange,
            expandedRowRender: (record: ListItem) => {
                return (model._expandableSection) ? (
                    <div style={{ paddingLeft: 0, marginLeft: -40 }}>
                        <Section key={`${model._key}-${record.key}`} main={props.main} form={props.form} section={record._expandableSection} style={{ width: '100%' }}/>
                    </div>
                ) : null;
            },
            /*
            expandIcon: ({ expanded, onExpand, record }: any) => {
                if (!model._expandable?.(record)) return null;
                return expanded ? (
                    <FontAwesomeIcon
                        icon={faChevronDown}
                        style={{ paddingLeft: 6, paddingTop: 6, marginRight: -6, opacity: 0.4, fontSize: 18 }}
                        onClick={(e: any) => onExpand(record, e)}
                    />
                ) : (
                    <FontAwesomeIcon
                        icon={faChevronUp}
                        style={{ paddingLeft: 6, paddingTop: 6, marginRight: -6, opacity: 0.4, fontSize: 18 }}
                        onClick={(e: any) => onExpand(record, e)}
                    />
                )
            }
            */
        }
    }

    if (model._selectable) {
        addProps['rowSelection'] = {
            selectedRowKeys: selectedRowKeys,
            type: 'checkbox',
            onChange: (selectedRowKeys: React.Key[], selectedRows: ListItem[]) => {
                setSelectedRowKeys(selectedRowKeys);
                model._selectableModel?.formulaSetChildren(model._formula);
                if (model._selectableFormat) model._selectableModel?.value(model._selectableFormat(selectedRows));
                if (model._selectableOnChange) model._selectableOnChange(selectedRows)
            },
            getCheckboxProps: (record: ListItem) => ({
                disabled: record._object.disabled ?? false,
            })
        }
    }

    /** Implement component specific functions for LIST.TS. */

    model.clearExpandedKeys = () => setExpandedRowKeys([]);
    model.clearDeletedKeys = () => setDeletedKey([]);
    model.getDeletedKeys = () => deletedKey;
    model.getEditingKeys = () => editingKey;
    model.getRecords = () => sourceData.d;
    model.getHeaders = () => sourceData.h;
    model.tsxClear = () => setSelectedRowKeys([]);

    model.editRecord = (record: any) =>
    {
        if (editingKey.includes(record.key)) {
            let filter = editingKey.filter((r: any) => r !== record.key);
            setEditingKey(filter);
        } else {
            setEditingKey([...editingKey, ...[record.key]]);
        }
    };

    model.deleteRecord = (record: any) =>
    {
        if (deletedKey.includes(record.key)) {
            let filter = deletedKey.filter((r: any) => r !== record.key);
            setDeletedKey(filter);
        } else {
            setDeletedKey([...deletedKey, ...[record.key]]);
        }
    };

    model.removeRecords = (records: any) =>
    {
        let newSourceData = sourceData.d.filter((r: any) => !records.some((k: any) => k.key === r.key))
        newSourceData = model.setItems(newSourceData)
        setSourceData({
            d: model.setItems(newSourceData),
            h: handleHeader(newSourceData, sourceData.f),
            f: sourceData.f,
        }, 'removeRecords');
    }

    model.removeRecord = (record: any, _onComplete: any) =>
    {
        _onComplete?.();

        let newSourceData = sourceData.d.filter((r: any) => r.key !== record.key)
        newSourceData = model.setItems(newSourceData)
        setSourceData({
            d: model.setItems(newSourceData),
            h: handleHeader(newSourceData, sourceData.f),
            f: sourceData.f,
        }, { caller: 'removeRecord', _onComplete: _onComplete });
    };

    model.setRecordValue = (record: any, dataIndex: any, value: any, object?: Item) =>
    {
        setSourceData({
            h: sourceData.h,
            d: sourceData.d.map((r: any) => {
                if (r.key === record.key && record[dataIndex] !== value) {
                    record[dataIndex] = value;
                    if (object) record._objects[dataIndex] = object;
                    model._onRecordWasEdited(record);
                }
                return r;
            }),
            f: sourceData.f,
        }, 'setRecordValue')
    };

    model.setRecord = (record: ListItem) =>
    {
        let newSourceData = sourceData.d
        newSourceData.push(record);
        newSourceData = model.setItems(newSourceData);
        setSourceData({
            d: newSourceData,
            h: handleHeader(newSourceData, sourceData.f),
            f: sourceData.f,
        }, 'setRecord');
    }

    model.moveRecord = (record: any, offset: number = 0) =>
    {
        let index = sourceData.d.findIndex((r: any) => r.key === record.key)

        if (isNaN(index)) return;

        let arr = sourceData.d;

        if (index + offset < 0) {
            [arr[index], arr[0]] = [arr[0], arr[index]];
        } else if (index + offset > sourceData.d.length - 1) {
            [arr[index], arr[sourceData.d.length - 1]] = [arr[sourceData.d.length - 1], arr[index]];
        } else {
            [arr[index], arr[index + offset]] = [arr[index + offset], arr[index]];
        }

        let newSourceData = model.setItems(arr);
        setSourceData({
            d: newSourceData,
            h: handleHeader(arr, sourceData.f),
            f: sourceData.f,
        }, 'moveRecord');
    }

    /** Implement component specific functions for DEFAULT.TS */

    model._onComplete = (response?: any, data?: any) =>
    {
        if (!response?.data) {
            return;
        }
        let newSourceData = model.setItems(data ?? response.data ?? [])
        setSourceData({
            d: newSourceData,
            h: handleHeader(newSourceData, sourceData.f),
            f: sourceData.f,
        }, '_onComplete');
        if (model._expandableExpandAll) {
            setExpandedRowKeys(newSourceData.map((r) => r._object.key))
        }
    };

    const onClear = () => setSourceData({ d: [], h: handleHeader([], []), f: [] }, 'onClear');

    const onStart = () =>
    {
        model._componentIsBuild = true;
        if (model._defaultObject || model._get?._data)
        {
            let items = model.setItems();
            let headers = handleHeader(items, sourceData.f);
            setSourceData({
                d: model.setItems(),
                h: headers,
                f: sourceData.f,
            }, 'onStart');

        } else {
            onClear();
        }
    }

    model.tsxSetExpandable = (item: ListItem) =>
    {
        // TODO: This only works if the element keeps its index - it should work for any index
        let indicesOf = Helpers.getIndicesOf('-', item.key, false);
        let removeFrom = indicesOf[indicesOf.length - 1];
        let key = item.key.substr(0, removeFrom);
        onExpandedRowsChange([...[`${key}-${model._random}`], ...expandedRowKeys])
    }

    let handleChange = (pagination, filters) =>
    {
        setSourceData({
            p: pagination.pageSize,
            d: sourceData.d,
            h: handleHeader(sourceData.d, filters),
            f: filters,
        }, 'handleChange')

        Object.keys(filters).forEach((key: string) => {
            let header = sourceData.h.find((h: any) => h.key === key);
            if (header) {
                window.localStorage.setItem(`filter:${header.key}`, JSON.stringify(filters[key]))
            }
        });
    };

    useEffect(() =>
    {
        if (model._useCache && model._key) model.defaultFromCache();
        onStart();
    }, [])

    useEffect(() => {
        console.log("sourceData.who", sourceData.who)
        if (sourceData.who.caller === 'removeRecord') {
            sourceData.who._onComplete?.();
        }
    }, [sourceData]);

    useEffect(() =>
    {
        model._defaultObject = { dataSource: sourceData.d.map((r: ListItem) => r._object) }
        model._onChange?.(sourceData.d);

        if (model._formula && model._key) {
            model.value(sourceData.d);
        }

        /** Debug purposes */
        if (model._useCache && model._key) {
            window.localStorage.setItem(`list:${model._key}`, JSON.stringify(model._defaultObject));
        }
    }, [sourceData])

    return (
        <div style={model._style ?? {}}>
            <ConfigProvider renderEmpty={customizeRenderEmpty}>
                <Table
                    size={props.model._dense ? 'small' : 'middle'}
                    style={{ width: '100%' }}
                    onRow={ (record, index) => ({ onClick: e => model._onRowClicked?.(e, record, index) }) }
                    rowKey={'key'}
                    rowClassName={(record) => {
                        switch (true) {
                            case (model?.getDeletedKeys().includes(record.key)):
                                return 'rowClassName-deleted';
                            default:
                                return '';
                        }
                    }}
                    pagination={props.model._footer ? { pageSize: sourceData.p, showSizeChanger: true } : false}
                    showHeader={props.model._header ? undefined : false}
                    columns={sourceData.h}
                    dataSource={sourceData.d}
                    showSorterTooltip={false}
                    onChange={handleChange}
                    bordered={props.model._bordered ?? false}
                    tableLayout={'auto'}
                    { ...addProps }
                />
            </ConfigProvider>
        </div>
    );
}

export default List;
