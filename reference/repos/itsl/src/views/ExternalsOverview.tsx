import React from "react";

import { Main } from "react-antd-admin-panel";
import {
    Typography,
    Section,
    Cycle,
    Title,
    Space,
    List,
    Get, ListHeader, Action, Formula, Post, ListItem
} from "react-antd-admin-panel";

import {WarningOutlined} from "@ant-design/icons/lib";
import { SectionComponent } from "react-antd-admin-panel";
import helpers from "../helpers";
import {message} from "antd";

export default class CourseCreateOverview extends React.Component<any, any> {

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
        const cycle: Cycle = main.$cycle(`/externaluser/overview/${faculty}`);
        const get: Get = main.$get(cycle, `/api/external-users?take=10000`);
        const explain: string = 'Listen indeholder de manuelt oprettede brugere';
        const formatDate = (v: string) => {
            if (!v) return v;
            return `${v.substr(8,2)}-${v.substr(5,2)}-${v.substr(0,4)}`
        }

        const section = new Section();
        const externals = new List()
            .get(() => get)
            .style({ paddingTop: 16 })
            .emptyIcon(WarningOutlined)
            .emptyText('Listen er tom')
            .emptyColumn(true)
            .bordered()
            .appends({ key: 'searchGroups', value: (v: any) => v.groups.join(', ') })
            .headerCreate(false)
            .headerPrepend(new ListHeader().key('firstname').title('Fornavn').searchable())
            .headerPrepend(new ListHeader().key('lastname').title('Efternavn').searchable())
            .headerPrepend(new ListHeader().key('email').title('Email').searchable())
            .headerPrepend(new ListHeader().key('searchGroups').width('100px').title('Grupper').searchable().render((v: any) => <div className="ellipsis" style={{ opacity: .3, width: 100 }}><i>{v}</i></div>))
            .headerPrepend(new ListHeader().key('expireAt').title('Udløbsdato').render((v) => <span>{formatDate(v)}</span>))
            .expandable((v: ListItem) => v._object.groups.length)
            .expandableSingles()
            .expandableSection((item: ListItem) =>
            {
                let section = new Section();
                section.add(new List()
                    .unique((r: any) => r)
                    .default({ dataSource: item._object.groups.map(r => ({ synckey: r })) })
                    .footer(false)
                    .header(false)
                    .headerCreate(false)
                    .headerPrepend(new ListHeader().key('synckey').title('Nøgle'))
                    .emptyText('')
                    .emptyIcon(WarningOutlined)
                    .emptyColumn(true)
                    .actions(new Action()
                        .key('deleteConfirm')
                        .access({ feature: 'Enrollment', level: 7 })
                        .formula(new Formula(new Post()
                            .header({ 'Faculty': helpers.facultyEnums(faculty, main) })
                            .target((args) => ({
                                method: 'DELETE',
                                target: `/api/external-users/${item._object.email}/memberships/${args.record.synckey}`
                            }))
                            .onThen(() => {
                                message.success('Rækken blev slettet.')
                                externals.refresh(cycle, () => {
                                    externals.tsxSetExpandable(item);
                                });
                            })
                            .onCatch(() => {
                                message.error('Rækken blev ikke slettet.')
                            }))
                        )
                    )
                )

                return section;
            })
            .actions(new Action()
                .key('deleteConfirm')
                .access({ feature: 'ExternalUser', level: 7 })
                .formula(new Formula(new Post()
                    .target((args) => ({
                        method: 'DELETE',
                        target: `/api/external-users/${args.record.email}`
                    }))
                    .header({ 'Faculty': helpers.facultyEnums(faculty, main) })
                    .onThen(() => {
                        externals.refresh(cycle)
                        message.success('Brugeren er blevet slettet.')
                    })
                    .onCatch(() => { message.error('Brugeren blev ikke slettet.') })
                )));

        section.style({ padding: '24px 36px' });
        section.add(new Title().label('Brugere').level(1));
        section.add(new Typography().label(explain));
        section.add(new Space().top(12))
        section.add(externals)

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