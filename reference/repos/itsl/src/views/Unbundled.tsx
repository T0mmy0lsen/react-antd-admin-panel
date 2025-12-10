import React from "react";
import {
    ConditionsItem,
    Autocomplete,
    Conditions,
    Typography,
    Formula,
    Section,
    Action,
    Button,
    Title,
    Radio,
    Post,
    Item,
    Get
} from "react-antd-admin-panel";
import { SectionComponent } from "react-antd-admin-panel";

import {message} from "antd";
import helpers from "../helpers";

export default class Unbundled extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            section: false,
            faculty: false,
        }
    }

    s1({ s1, s2 }) {

        s1.section
            .add(new Title().label('Opsplittede Kurser').level(1))
            .add(new Title().step().level(4).label('1. Vælg et kursus der skal opsplittes.'))
            .add(s1.autocomplete
                .key('courseId')
                .label('Find kursus')
                .get((value) => new Get()
                    .target(() => ({
                        target: `/api/courses/search`,
                        params: { with: 3, query: value, page: 1, take: 25 }
                    }))
                    .alter((v: any) => v
                        .map((r: any) => new Item(r.courseId).id(r.courseId).title(r.title).text(r.courseId).object(r))
                        .filter((r: any) => {
                            return !((r._object.source === 'TRANSFERRED' || r._object.source === 'SCHEDULED') && v.some((s: any) => s.courseId === r._object.courseId && (s.source === 'MANUAL' || s.source === 'EXCLUDED')));
                        })
                    )
                )
                .onChange((object: any) => {
                    if (object.value) {
                        s2.conditions.checkCondition(object);
                    }
                })
            )
    }

    s2({ s2, s3 }) {

        s2.r1.key('deleteParentCourse').label('Skriv en titel')
            .format((v) => v.value === '1')
            .add(new Item(1).title('Ja, slet det oprindelige kursus'))
            .add(new Item(2).title('Nej, det oprindelige kursus må ikke slettes'))
            .onChange((v: any) => s3.conditions.checkCondition(v))

        s2.r2.key('deleteParentCourse').label('Skriv en titel')
            .disabled(true)
            .default({ value: '2' })
            .format((v) => v.value === '1')
            .add(new Item('1').title('Ja, slet det oprindelige kursus'))
            .add(new Item('2').title('Nej, det oprindelige kursus må ikke slettes'))
            .onChange((v: any) => s3.conditions.checkCondition(v))

        s2.section
            .add(s2.conditions
                .add(new ConditionsItem()
                    .condition((value: any) => !!value?.value && value.object.object.source !== 'TRANSFERRED')
                    .content((next) => {
                        next(new Section().style({ paddingTop: 16 })
                            .add(new Title().step().level(4).label('2. Vælg hvorvidt moderkurset skal slettes.'))
                            .add(s2.r1)
                        )
                    })
                )
                .add(new ConditionsItem()
                    .condition((value: any) => !!value?.value && value.object.object.source === 'TRANSFERRED')
                    .content((next) => {
                        next(new Section().style({ paddingTop: 16 })
                            .add(new Title().level(4).label('2. Vælg hvorvidt moderkurset skal slettes.'))
                            .add(new Typography().label('Kurset er allerede overført og kan derfor ikke slettes'))
                            .add(s2.r2)
                        )
                    })
                )
            )
    }

    s3({ s3 }) {

        s3.section
            .add(s3.conditions
                .add(new ConditionsItem()
                    .condition((v: any) => !!v?.value)
                    .content((next) => {
                        next(new Section().style({ paddingTop: 16 })
                            .addRowEnd(new Button().primary().action(new Action().hideClear().label('Gem').type('submit')))
                        )
                    })
                )
            )
    }

    build() {

        const page = {
            clear: () => {
                page.s1.autocomplete.clearSelf();
                page.s2.r1.clearSelf();
                page.s2.r2.clearSelf();
            },
            main: this.props.main,
            faculty: this.props.main.$params('faculty'),
            section: new Section(),
            s1: { section: new Section(), conditions: new Conditions(), autocomplete: new Autocomplete() },
            s2: { section: new Section(), conditions: new Conditions(), r1: new Radio(), r2: new Radio() },
            s3: { section: new Section(), conditions: new Conditions() },
        }

        this.s1(page);
        this.s2(page);
        this.s3(page);

        page.section.style({ padding: '24px 36px' });
        page.section.formula(new Formula(new Post()
            .target(`/api/unbundled`)
            .header({ 'Content-Type': 'application/json', 'Faculty': helpers.facultyEnums(page.faculty, page.main) })
            .onThen(() => {
                message.success('Kurset er tilføjet');
            })
            .onCatch(() => {
                message.error('Kurset blev ikke tilføjet');
            })
        ))

        page.section.add(page.s1.section)
        page.section.add(page.s2.section)
        page.section.add(page.s3.section)
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