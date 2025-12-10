const handleDefaultProps = (col: any, { data }: any) => {

    col.editable = col.editable ?? false;
    col.sortable = col.sortable ?? false;
    col.searchable = col.searchable ?? false;
    col.filterable = col.filterable ?? false;

    if (col.sortable) {
        col.sorter = (a: any, b: any) => {
            if (a[col.dataIndex] < b[col.dataIndex]) return -1;
            if (a[col.dataIndex] > b[col.dataIndex]) return 1;
            return 0;
        }
    }

    if (col.filterable)
    {
        col.searchable = false;

        if (col.useFilters) {
            col.filters = [...col.useFilters];
        } else {
            col.filters = data.map((r: any) => r[col.dataIndex]).filter((item: any, i: number, self: any[]) => item && self.indexOf(item) === i);
        }

        col.filters = col.filters.map((r: any) => { return { value: r, text: r }});
        col.onFilter = (value: any, record: any) => record[col.dataIndex].indexOf(value) !== -1;
    }

    return col
};

export default handleDefaultProps;