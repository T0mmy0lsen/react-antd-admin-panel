import React from "react";
import {Input} from "antd";
import {Search as SearchModel} from "../../typescript";

const Search = (props: any) => {

    const search: SearchModel = props.model;

    const onSearch = () => {
        search._action?.click();
    }

    const onChange = (e: any) => {
        search._data = e.target.value;
        search._onChange?.(search._data, search._index);
    }

    return (
        <Input.Search autoFocus={false} value={search._data} size={'large'} placeholder="Søg her ..." onSearch={onSearch} onChange={onChange} />
    )
}

export default Search;