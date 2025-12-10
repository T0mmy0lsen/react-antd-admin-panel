import React from "react";

import { Main } from "react-antd-admin-panel";
import { Section } from "react-antd-admin-panel";
import { SectionComponent } from "react-antd-admin-panel";
import helpers from "../helpers";
import {PlusOutlined, WarningOutlined} from "@ant-design/icons/lib";
import LoadingIcon from "antd/es/button/LoadingIcon";
import {message, Row} from "antd";
import {
    Action, Autocomplete, Button,
    Cycle,
    Formula,
    Get, Item,
    List,
    ListHeader,
    ListItem,
    Post, Select, Space,
    Title,
    Typography
} from "react-antd-admin-panel/dist";

export default class ProfileOverview extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            section: false,
            faculty: false,
        }
    }

    build() {

        let translateTitle = (v: string) => {
            switch (true) {
                case v === 'studysecretary':
                    return 'Studiesekretær';
                case v === 'elearncoordinator':
                    return 'Elearnkoordinator';
                default:
                    return v;
            }
        }

        const main: Main = this.props.main;
        const faculty: string = main.$params('faculty');
        const cycle: Cycle = main.$cycle(`/profile/overview/${faculty}`);
        const get: Get = main.$get(cycle, `/api/person/profile`);

        const text: string = 'Listen indeholder oprettede profiler.';

        const section = new Section();
        const users = new List()
            .get(() => get)
            .emptyText('')
            .emptyIcon(WarningOutlined)
            .emptyColumn(true)
            .bordered()
            .appends({ key: 'cities', value: (v: any) => {
                    let memberships = v.memberships?.filter(r => r.faculty.toLowerCase() === main.$params('faculty')) ?? [];
                    return memberships.map((r: any) => helpers.cityFromId(r.city, main)).join(', ');
                }
            })
            .headerCreate(false)
            .headerPrepend(new ListHeader().key('email').title('Email').searchable())
            .headerPrepend(new ListHeader().key('instroleId').title('Role').render((v: any) => <span>{ `${translateTitle(helpers.instroleFromId(v, main))}` }</span>))
            .headerPrepend(new ListHeader().key('cities').width('100px').title('Byer').searchable().render((v: any) => <div className="ellipsis" style={{ opacity: .3, width: 100 }}><i>{v}</i></div>))
            .expandable((v: ListItem) => true)
            .expandableSection((record) => {

                let button = new Button();
                let select = new Select();
                let section = new Section();

                section.style({ paddingLeft: 5 })
                section.add(new List()
                    .default({ dataSource: record._object.memberships?.filter(r => r.faculty.toLowerCase() === main.$params('faculty')) ?? [] })
                    .footer(false)
                    .emptyText('')
                    .emptyIcon(WarningOutlined)
                    .bordered()
                    .headerCreate(false)
                    .headerPrepend(new ListHeader().key('city').title('By').render((v: any) => <span>{ `${helpers.cityFromId(v, main)}` }</span>))
                    .actions(new Action()
                        .key('deleteConfirm')
                        .access({ feature: 'Profile', level: 7 })
                        .formula(new Formula(new Post()
                            .main(main)
                            .header({ 'Faculty': helpers.facultyEnums(main.$params('faculty'), main) })
                            .target((args: any) => ({
                                method: 'DELETE',
                                target: `/api/person/profile/${record._object.id}/memberships/${args.record._object.membershipId}`,
                            }))
                            .onThen(() => users.refresh(cycle)))
                        ))
                );

                section.add(new Space().top(24))
                section.addRowEnd([
                    select
                        .key('city')
                        .style({ width: 200, marginBottom: 0, marginRight: 8 })
                        .sizeString('middle')
                        .addMore(main.Store.cities.map((r: any) => new Item(r.id).title(r.name).object(r)))
                        .label('Vælg by')
                        .onChange((object: any) => {}),
                    button
                        .access({ feature: 'Profile', level: 3 })
                        .action(new Action()
                            .callback(() => new Post()
                                .header({ 'Faculty': helpers.facultyEnums(faculty, main) })
                                .target(() => {
                                    return ({
                                        target: `/api/person/profile/${record._object.id}/memberships`,
                                        params: {
                                            roleId: 2,
                                            faculty: helpers.facultyEnums(faculty, main),
                                            cityId: parseInt(select._defaultObject.value)
                                        }
                                    })
                                })
                                .onThen(() => {
                                    message.success('Rækken blev tilføjet.')
                                    users.refresh(cycle, () => {
                                        users.tsxSetExpandable(record);
                                    });
                                })
                                .onCatch(() => {
                                    message.error('Rækken blev ikke tilføjet.')
                                })
                                .submit())
                            .hideClear()
                            .label('Tilføj til profil')
                            .icon(PlusOutlined))
                ]);

                return section;
            })
            .actions(new Action()
                .key('deleteConfirm')
                .access({ feature: 'Profile', level: 7 })
                .formula(new Formula(new Post()
                    .header({ 'Faculty': helpers.facultyEnums(faculty, main) })
                    .target(({ record }) => ({
                        method: 'DELETE',
                        target: `/api/person/profile/${record._object.id}`,
                    }))
                    .onThen(() => {
                        message.success('Rækken blev slettet.')
                        users.refresh(cycle);
                    })
                    .onCatch(() => {
                        message.error('Rækken blev ikke slettet.')
                    }))
                ))

        section.style({ padding: '24px 36px' });
        section.add(new Title().label('Profil'));
        section.add(new Typography().label(text));
        section.add(users);

        this.setState({section: section, faculty: faculty});
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