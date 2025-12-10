import React from "react";
import {Button, Input, Space} from "antd";
import {SearchOutlined} from "@ant-design/icons/lib";

let searchInput: any;

const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any, props: any) => {
    confirm();
};

const handleReset = (clearFilters: any, props: any) => {
    clearFilters();
};

const handleSearchProps = (col: any, props: {
    filteredInfo: any
}) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => {
        return (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        searchInput = node;
                    }}
                    placeholder={`Søg ${col.dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, col.dataIndex, props)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, col.dataIndex, props)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Søg
                    </Button>
                    <Button onClick={() => handleReset(clearFilters, props)} size="small" style={{ width: 90 }}>
                        Nulstil
                    </Button>
                </Space>
            </div>
        )
    },
    filterIcon: (filtered: any) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilterDropdownVisibleChange: (visible: any) => {
        if (visible) {
            setTimeout(() => searchInput.select(), 100);
        }
    },
    onFilter: (value: any, record: any) => {
        return record[col.dataIndex]
            ? record[col.dataIndex].toString().toLowerCase().includes(value.toLowerCase())
            : '';
    },
});

export default handleSearchProps;