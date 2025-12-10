import React from "react";

import { Main } from "react-antd-admin-panel";
import { Section } from "react-antd-admin-panel";
import { SectionComponent } from "react-antd-admin-panel";
import {
    Action,
    Alert,
    Autocomplete, Button, Conditions,
    ConditionsItem, Formula,
    Get,
    Item, List, ListHeader, ListItem, Post, Result, Select,
    Space,
    Steps,
    StepsItem,
    Title,
    Typography
} from "react-antd-admin-panel/dist";
import helpers from "../helpers";
import {CloseOutlined, WarningOutlined} from "@ant-design/icons/lib";
import {message} from "antd";

export default class Profile extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            section: false,
            faculty: false,
        }
    }

    s1({ s1, s2, steps, main, faculty })
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
                .key('user')
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
                        steps.done(1, true);
                        s1.condition.checkCondition(object);
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
                                        steps.done(2, false);
                                        s1.condition.checkCondition(false);
                                        s1.autocomplete.tsxSetDisabled(false);
                                    }
                                })
                            )
                        )
                    })
                )
            )
    }

    s2({ s1, s2, steps, main, faculty })
    {
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

        s2.section
            .add(s2.select
                .key('profile')
                .label('Vælg en profil')
                .addMore((() => {
                    let items = main.Store.instrole.map((r: any) =>
                        new Item(`${r.id}`)
                            .value(`${r.id}`)
                            .title(translateTitle(r.type))
                            .text(r.type)
                            .object(r)
                            .access(['elearncoordinator', 'studysecretary'].includes(r.type))
                    )
                    items.reverse();
                    return items;
                })())
                .onChange((object: any) => {
                    s2.create.tsxSetDisabled(!object.value);
                })
            )
            .add(new Space().top(12))
            .addRowEnd(s2.create.disabled(true).action(new Action().label('Opret').callback(() => {
                new Post()
                    .onThen((r: any) => {
                        steps.done(2, true);
                        s2.profile = r.data;
                        s2.create.tsxSetDisabled(true);
                        s2.select.tsxSetDisabled(true);
                        message.success('Profilen blev oprettet.')
                    })
                    .onCatch(() => {
                        steps.done(2, false);
                        message.error('Profilen kunne ikke oprettes.')
                    })
                    .header({ ...helpers.facultyHeader(main), ...{ 'Content-Type': 'application/json' }})
                    .target(() => ({
                        target: `/api/person/profile`,
                        params: {
                            instroleId: parseInt(s2.select._defaultObject.value),
                            email: s1.autocomplete._defaultObject.object.object.email
                        }
                    }))
                    .submit();
            })))
    }

    s3({ s2, s3, steps, main, faculty })
    {
        s3.section
            .add(new Typography().label('Vælg byer. Der kan vælges flere byer. Hvis du ikke vælger nogle byer vil profilen få adgang til alle byer.'))
            .add(s3.select
                .key('city')
                .addMore(main.Store.cities.map((r: any) => new Item(r.id).title(r.name).object(r)))
                .label('Vælg by')
                .onChange((object: any) => {
                    if (object.value) {
                        s3.list.setRecord(object.object._object)
                    }
                })
            )
            .add(new Space().top(12))
            .add(s3.list
                .key('cities')
                .format((v: any) => v.map((r: ListItem) => r._object.courseId))
                .footer(false)
                .actions(new Action().icon(CloseOutlined).callback(({ record }: any) => s3.list.removeRecord(record)))
                .addDummyColumn(true)
                .headerCreate(false)
                .emptyIcon(WarningOutlined)
                .emptyText('Der er ikke valgt nogen by')
                .headerPrepend(new ListHeader()
                    .key('name')
                    .title('By')
                )
            )
            .add(new Space().top(24))
            .addRowEnd(s3.create.action(new Action().label('Opret').callback(() =>
            {
                let report: any = [];
                let recordsToDelete: any = [];
                let records = s3.list.getRecords();
                let reportToUser = () => {
                    report.forEach((r: any, i: number) => setTimeout(() => r(), i * 250));
                    s3.list.removeRecords(recordsToDelete);
                }
                records.map((r: any) => {
                    new Post()
                        .onThen(() => {
                            steps.done(3, true);
                            report.push(() => message.success(`${r.name} blev tilføjet.`));
                            recordsToDelete.push(r);
                            if (report.length === records.length) reportToUser();
                        })
                        .onCatch(() => {
                            report.push(() => message.error(`${r.name} blev ikke tilføjet.`));
                            if (report.length === records.length) reportToUser();
                        })
                        .header({ ...helpers.facultyHeader(main), ...{ 'Content-Type': 'application/json' }})
                        .target(() => ({
                            target: `/api/person/profile/${s2.profile.id}/memberships`,
                            params: {
                                cityId: r.id,
                                faculty: main.$params('faculty').toUpperCase(),
                                roleId: 2,
                            }
                        }))
                        .submit();
                })
            })))
    }

    s4({ s4, steps, clear })
    {
        s4.section = new Section()
            .add(new Result()
                .title('Godkendt')
                .status('success')
                .subTitle('Profil og medlemskaber er blevet oprettet.')
                .add(new Section().row().center().add(
                    new Button()
                        .middle()
                        .primary()
                        .action(new Action()
                            .label('Afslut')
                            .callback(() => {
                                steps.clear()
                                clear()
                            })
                ))
            ))
    }

    build() {

        const main: Main = this.props.main;
        const faculty: string = main.$params('faculty');

        const page = {
            main: main,
            faculty: faculty,
            section: new Section(),
            steps: new Steps(),
            s1: { section: new Section(), condition: new Conditions(), select: new Select(), autocomplete: new Autocomplete() },
            s2: { section: new Section(), condition: new Conditions(), select: new Select(), create: new Button(), profile: undefined },
            s3: { section: new Section(), condition: new Conditions(), select: new Select(), autocomplete: new Autocomplete(), list: new List(), create: new Button() },
            s4: { section: new Section(), condition: new Conditions(), autocomplete: new Autocomplete() },
            clear: () => {
                page.s1.autocomplete.clearSelf();
            }
        }

        page.section['_inspectPage'] = page;

        this.s1(page);
        this.s2(page);
        this.s3(page);
        this.s4(page);

        page.steps
            .add(new StepsItem()
                .done(false)
                .title('Bruger')
                .content((next) => next(page.s1.section)))
            .add(new StepsItem()
                .done(false)
                .title('Profil')
                .content((next) => next(page.s2.section)))
            .add(new StepsItem()
                .done(false)
                .title('Medlemskab')
                .content((next) => next(page.s3.section)))
            .add(new StepsItem()
                .done(false)
                .title('Godkend')
                .content((next) => next(page.s4.section))
        )

        page.section.style({ padding: '24px 36px' });
        page.section.formula(new Formula(new Post().target('/api/profile').header({ 'Faculty': helpers.facultyEnums(page.faculty, page.main) })));
        page.section.add(new Title().label('Profil').level(1));
        page.section.add(new Typography().label('Her kan du tilføje en profil til en bruger som er oprettet i ITSLearning.'));
        page.section.add(new Space().top(12))
        page.section.add(page.steps)
        page.section.init();

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