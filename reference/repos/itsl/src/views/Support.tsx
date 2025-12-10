import React from "react";

import { Main } from "react-antd-admin-panel";
import { Section } from "react-antd-admin-panel";
import { SectionComponent } from "react-antd-admin-panel";
import {
    Alert,
    Autocomplete,
    Conditions,
    ConditionsItem,
    Get,
    Item, List, ListHeader,
    Select, Space,
    Title,
    Typography
} from "react-antd-admin-panel/dist";
import helpers from "../helpers";
import {WarningOutlined} from "@ant-design/icons/lib";

export default class Users extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            section: false,
            faculty: false,
        }
    }

    s1({ s1, s2, main, faculty })
    {
        s1.section

            .add(s1.select
                .style({ width: '100%', marginRight: 0, marginBottom: 0 })
                .default({ value: 'name' })
                .add(new Item('name').title('Søg efter navn'))
                .add(new Item('email').title('Søg efter email'))
                .onChange(() => s1.autocomplete.clearSelf()),
            )

            .add(s1.autocomplete
                .key('synckey')
                .label('Find bruger')
                .get((value) => new Get()
                    .target(() => {
                        switch (s1.select._defaultObject.value) {
                            case 'name':
                                let split = value.split(" ")
                                return ({ target: `/api/person/search`, params: {
                                        firstname: split[0],
                                        lastname: split[0] === split[split.length - 1] ? '' : split[split.length - 1] ?? '',
                                        page: 1,
                                        take: 25
                                    }})
                            case 'email':
                                return ({ target: `/api/person/search`, params: { email: value, page: 1, take: 25 }})
                        }
                    })
                    .header({ 'Faculty': helpers.facultyEnums(faculty, main), 'Content-Type': 'application/json' })
                    .alter((v: any) => (v.data ?? v ?? []).map((r: any) => new Item(r.email).title(`${r.firstname} ${r.lastname}`).text(r.email).object(r)))
                )
                .onChange((object: any) => {
                    if (object.value) {
                        s1.condition.checkCondition(object);
                        s2.condition.checkCondition(object);
                        s1.autocomplete.tsxSetDisabled(true);
                    }
                })
            )

            .add(s1.condition
                .add(new ConditionsItem()
                    .condition((value: any) => !!value?.value)
                    .content((next, callback, main, args) => {
                        next(new Section()
                            .add(new Alert()
                                .add(new Item('user').title(args.object.title).text(args.object.key).description('Dette er den valgte bruger'))
                                .clearable(true)
                                .onChange((object: any) => {
                                    if (!object) {
                                        s1.condition.checkCondition(false);
                                        s2.condition.checkCondition(false);
                                        s1.autocomplete.tsxSetDisabled(false);
                                    }
                                })
                            )
                        )
                    })
                )
            )
    }

    s2({ s1, s2, main, faculty }) {

        s2.section

            .add(s2.condition
                .add(new ConditionsItem()
                    .condition((value: any) => !!value?.value)
                    .content((next, callback, main, args) => {
                        next(new Section()
                            .add(new Title().level(5).style({ marginBottom: 0, marginLeft: 16, marginTop: 16 }).label('STADS-grupper'))
                            .add(new List()
                                .fetch(() => new Get()
                                    .header(helpers.facultyHeader(main))
                                    .target(() => `/api/person/stads-groups/${args.object.object.synckey}`)
                                    .fail([])
                                )
                                .style({ paddingTop: 8 })
                                .emptyColumn(true)
                                .emptyIcon(WarningOutlined)
                                .emptyText('Listen er tom')
                                .bordered()
                                .headerCreate(false)
                                .headerPrepend(new ListHeader().key('kode').searchable())
                                .headerPrepend(new ListHeader().key('kommentar').searchable())
                                .headerPrepend(new ListHeader().key('status').filterable())
                                .headerPrepend(new ListHeader().key('aendret').sortable())
                            )
                        )
                    })
                )
            )
    }

    build() {

        const main: Main = this.props.main;

        const page = {
            main: main,
            faculty: main.$params('faculty'),
            section: new Section(),
            s1: { section: new Section(), select: new Select(), autocomplete: new Autocomplete(), condition: new Conditions() },
            s2: { section: new Section(), condition: new Conditions() }
        }

        this.s1(page);
        this.s2(page);

        page.section.style({ padding: '24px 36px' });
        page.section.add(new Title().label('Support').level(1));
        page.section.add(new Typography().label('Værktøj til diverse praktiske opslag.'));
        page.section.add(new Space().top(12))
        page.section.add(page.s1.section)
        page.section.add(page.s2.section)

        this.setState({ section: page.section, faculty: page.faculty });
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