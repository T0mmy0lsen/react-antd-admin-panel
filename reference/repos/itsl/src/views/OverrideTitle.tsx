import React from "react";

import { Main } from "react-antd-admin-panel";
import {
    Typography,
    Formula,
    Section,
    Action,
    Cycle,
    Space,
    Title,
    List,
    Post,
    Get, ListHeader
} from "react-antd-admin-panel";
import { SectionComponent } from "react-antd-admin-panel";
import helpers from "../helpers";
import {WarningOutlined} from "@ant-design/icons/lib";
import {message} from "antd";

export default class OverrideTitle extends React.Component<any, any> {

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
        const cycle: Cycle = main.$cycle(`/override/title/${faculty}`);
        const get: Get = main.$get(cycle, `/api/courses/renames`);

        const explain: string = 'Listen indeholder ændringer af titler sendt til ITSLearning';

        const section = new Section();
        const merged = new List()
            .get(() => get)
            .emptyIcon(WarningOutlined)
            .emptyText('Listen er tom')
            .emptyColumn(true)
            .bordered()
            .headerCreate(false)
            .headerPrepend(new ListHeader().key('courseId').title('Kursus ID').searchable())
            .headerPrepend(new ListHeader().key('fieldValue').title('Navn').searchable())
            .headerPrepend(new ListHeader().key('termname').title('Periode').filterable())
            .actions(new Action()
                .key('deleteConfirm')
                .access({ feature: 'Override', level: 7 })
                .formula(new Formula(new Post()
                    .target((args) => ({
                        method: 'DELETE',
                        target: `/api/courses/renames/${args.record.courseId}`
                    }))
                    .header({ 'Faculty': helpers.facultyEnums(faculty, main) })
                    .onThen(() => {
                        merged.refresh(cycle)
                        message.success('Ændringen er blevet slettet.')
                    })
                    .onCatch(() => { message.error('Ændringen blev ikke slettet.') })
                )));

        section.style({ padding: '24px 36px' });
        section.add(new Title().label('Ændringer af Titler').level(1));
        section.add(new Typography().label(explain));
        section.add(new Space().top(12))
        section.add(merged)

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