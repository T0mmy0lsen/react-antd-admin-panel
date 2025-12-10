import {List, Section} from "../../index";
import DefaultItem from "../builder/DefaultItem";

export default class ListItem extends DefaultItem {

    _expandableSection: Section;
    _menuSection: Section;

    constructor(r: any, list: List) {
        super(r);
        this._expandableSection = list._expandableSection?.(this);
        this._menuSection = list._menuSection?.(this);
    }

    getList() {
        return this._expandableSection?.getFieldByClass('List') ?? []
    }

    getListRecords() {
        // The List-component would always have the true-value. However, sometimes the component may not have been drawn.
        // Thus, we expect the List.ts to have been build. In here we should be able to fetch the data.

        let list = this.getList()
        if (list.length === 0) return [];

        let records = list.getRecords();
        if (records) return records;

        return list.setItems();
    }
}