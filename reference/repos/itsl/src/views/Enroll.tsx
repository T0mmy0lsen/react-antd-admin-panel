import React from "react";

import {
    ConditionsItem,
    Typography,
    StepsItem,
    Formula,
    Section,
    Alert,
    Steps,
    Title,
    Item,
    Post,
    Get, Conditions, Autocomplete, List, ListItem, Action, ListHeader, Button, Result, DatePicker, Select
} from "react-antd-admin-panel";

import { SectionComponent } from "react-antd-admin-panel";
import {message} from "antd";
import helpers from "../helpers";
import {CloseOutlined, WarningOutlined} from "@ant-design/icons/lib";

export default class Enroll extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            section: false,
            faculty: false,
        }
    }

    s1({ s1, faculty, steps, main }: any) {
        s1.section
            .add(new Typography().label('Vælg tilkoblings-faget. Du kan kun vælge ét fag.'))
            .add(s1.autocomplete
                .key('courseId')
                .label('Find kursus')
                .get((value) => new Get()
                    .target(() => ({
                        target: `/api/courses/search`,
                        params: {
                            query: value,
                            page: 1,
                            take: 25
                        }
                    }))
                    .header({ 'Faculty': helpers.facultyEnums(faculty, main) })
                    .alter((v: any) => v
                        .map((r: any) => new Item(r.courseId).id(r.courseId).title(r.title).text(r.courseId).object(r))
                        .filter((r: any) => {
                            return !((r._object.source === 'TRANSFERRED' || r._object.source === 'SCHEDULED') && v.some((s: any) => s.courseId === r._object.courseId && (s.source === 'MANUAL' || s.source === 'EXCLUDED')));
                        })
                    )
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
                                .add(new Item('course').title(args.object.title).text(args.object.id).description('Dette er det valgte tilkoblings-fag'))
                                .clearable(true)
                                .onChange((object: any) => {
                                    if (!object) {
                                        steps.done(2, false);
                                        s1.condition.checkCondition(false);
                                        s1.autocomplete.clearSelf();
                                        s1.autocomplete.tsxSetDisabled(false);
                                    }
                                })
                            )
                        )
                    })
                )
            )
    }

    s2({ s2, faculty, steps, main }: any) {

        s2.list
            .key('stadsCourses')
            .format((v: any) => v.map((r: ListItem) => r._object.kode))
            .footer(false)
            .actions(new Action().icon(CloseOutlined).callback(({ record }: any) => s2.list.removeRecord(record)))
            .addDummyColumn(true)
            .headerCreate(false)
            .emptyIcon(WarningOutlined)
            .emptyText('Der er ikke valgt nogen fag')
            .headerPrepend(new ListHeader().key('studGruppeId').title('ID'))
            .headerPrepend(new ListHeader().key('kode').title('Kode'))

        s2.section
            .add(new Typography().label('Søg efter en STADS-gruppe. Der kan vælges flere STADS-grupper.'))
            .add(s2.autocomplete
                .ignoreOnChange(true)
                .label('Find STADS-gruppe')
                .get(() => new Get()
                    .header({ 'Faculty': helpers.facultyEnums(faculty, main) })
                    .target((args) => ({ target: `/api/stap/groups/search`, params: { q: args }}))
                    .alter((v: any) => v.map((r: any) => new Item(r.studGruppeId).id(r.studGruppeId).title(r.kode).text(r.studGruppeId).object(r)))
                )
                .onChange((object: any) => {
                    if (s2.list.getRecords().length === 0) steps.done(3, false);
                    if (object?.object) {
                        s2.list.setRecord(object.object.object)
                        steps.done(2, true);
                    }
                })
            )
            .add(s2.list)
    }

    s3({ s3, faculty, steps, main }) {

        s3.section
            .add(new Typography().label('Vælg et semester for tilkoblingen.'))
            .add(new Select().key('term').addMore(main.Store.semester.map((r: any) => new Item(r)))
                .onChange((v: any) => {
                    steps.done(3, !!v?.value);
                })
            )
    }

    s4({ s4, steps, clear }: any) {

        let button = new Button()
            .middle()
            .primary()
            .action(new Action()
                .label('Godkend')
                .callback(() => {
                    button._formula._post
                        .onThen(() => {
                            clear();
                            steps.clear();
                            message.success('STADS-koblingen er registreret');
                        })
                        .onCatch(() => {
                            button.tsxSetLoading(false);
                            message.error('STADS-koblingen kunne ikke registreres');
                        });
                    button._formula.submit();
                }));

        s4.section = new Section()
            .add(new Result()
                .title('Godkend')
                .status('success')
                .subTitle('Når du trykker godkend vil STADS-koblingen blive gemt')
                .add(new Section().row().center().add(button))
            )
    }

    build()
    {
        const page = {
            main: this.props.main,
            steps: new Steps(),
            faculty: this.props.main.$params('faculty'),
            section: new Section(),
            s1: { section: new Section(), autocomplete: new Autocomplete(), condition: new Conditions() },
            s2: { section: new Section(), autocomplete: new Autocomplete(), list: new List() },
            s3: { section: new Section() },
            s4: { section: new Section() },
            clear: () => {
                page.s1.autocomplete.clearSelf();
                page.s2.autocomplete.clearSelf();
                page.s2.list.clearSelf();
            },
        }

        page.section
            .style({ padding: '24px 36px' })
            .add(new Title().label('STADS-kobling').level(1).style({ paddingBottom: 16 }))
            .add(page.steps)
            .formula(new Formula(new Post().target('/api/enrollment').header({ 'Faculty': helpers.facultyEnums(page.faculty, page.main) })))
            .init()

        this.s1(page);
        this.s2(page);
        this.s3(page);
        this.s4(page);

        page.steps
            .add(new StepsItem()
                .done(false)
                .title('Kursus')
                .content((next) => next(page.s1.section))
            )
            .add(new StepsItem()
                .done(false)
                .title('STADS-grupper')
                .content((next) => next(page.s2.section))
            )
            .add(new StepsItem()
                .done(false)
                .title('Semester')
                .content((next) => next(page.s3.section))
            )
            .add(new StepsItem()
                .done(false)
                .title('Godkend')
                .content((next) => next(page.s4.section))
            )

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