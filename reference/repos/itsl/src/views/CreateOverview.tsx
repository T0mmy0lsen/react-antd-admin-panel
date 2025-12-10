import React from "react";

import { Main } from "react-antd-admin-panel";
import {
    Typography,
    Section,
    Cycle,
    Title,
    Space,
    List,
    Get, ListHeader, ListItem, Action, Post, Formula
} from "react-antd-admin-panel";

import {WarningOutlined} from "@ant-design/icons/lib";
import { SectionComponent } from "react-antd-admin-panel";
import helpers from "../helpers";
import {message} from "antd";

export default class CreateOverview extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            section: false,
            faculty: false,
        }
    }

    build() {

        const main: Main = this.props.main;
        const faculty: string = main.$params('faculty');
        const cycle: Cycle = main.$cycle(`/courses/overview/${faculty}`);
        const get: Get = main.$get(cycle, `/api/courses/manual`);
        const explain: string = 'Listen indeholder de fag som er oprettet manuelt';

        const section = new Section();
        const courses = new List()
            .get(() => get)
            .style({ paddingTop: 16 })
            .emptyIcon(WarningOutlined)
            .emptyText('Listen er tom')
            .emptyColumn(true)
            .bordered()
            .appends({ key: 'termname', value: (record: any) => record.courseId.substr(-3) })
            .headerCreate(false)
            .headerPrepend(new ListHeader().key('courseId').title('ID').searchable())
            .headerPrepend(new ListHeader().key('title').title('Title').editable().searchable())
            .headerPrepend(new ListHeader().key('createdBy').title('Oprettet af').filterable())
            .headerPrepend(new ListHeader().key('termname').title('Periode').filterable())
            .unique((v: any) => v.courseId)
            .actions(new Action()
                .key('edit')
                .access({ feature: 'Created', level: 3 })
            )
            .actions(new Action()
                .key('deleteConfirm')
                .access({ feature: 'Created', level: 7 })
                .formula(new Formula(new Post()
                    .header({ 'Faculty': helpers.facultyEnums(faculty, main) })
                    .target(({ record }) => ({
                        method: 'DELETE',
                        target: `/api/courses/${record._object.courseId}`,
                    }))
                    .onThen(() => {
                        message.success('Rækken blev slettet.')
                        courses.refresh(cycle);
                    })
                    .onCatch(() => {
                        message.error('Rækken blev ikke slettet.')
                    }))
                ))
            .onRecordWasSaved((item: ListItem) => {
                new Post()
                    .header({
                        'Faculty': helpers.facultyEnums(main.$params('faculty'), main),
                        'Content-Type': 'application/json'
                    })
                    .target(() => ({
                        target: `/api/courses/manual/rename`,
                        params: { name: item['title'], courseId: item['courseId'] }
                    }))
                    .submit()
            })

        section.style({ padding: '24px 36px' });
        section.add(new Title().label('Manuelle kurser').level(1));
        section.add(new Typography().label(explain));
        section.add(new Space().top(12))
        section.add(courses)

        this.setState({ section: section, faculty: faculty });
    }

    render() {
        return (
            <>{!!this.state.section &&
            <SectionComponent key={this.state.faculty} main={this.props.main} section={this.state.section}/>}</>
        );
    }

    componentDidMount() {
        this.build()
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        return (this.state.faculty !== this.props.main.$params('faculty'));
    }

    componentDidUpdate(prevProps, prevState, snapshot?) {
        if (snapshot) this.build();
    }
}