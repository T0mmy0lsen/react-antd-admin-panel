import React from "react";

import { Main } from "react-antd-admin-panel";
import {
    Get,
    List,
    Item,
    Post,
    Cycle,
    Space,
    Title,
    Action,
    Button,
    Section,
    Formula,
    ListHeader,
    Typography,
    Autocomplete,
} from "react-antd-admin-panel";

import {PlusOutlined, WarningOutlined} from "@ant-design/icons/lib";
import { SectionComponent } from "react-antd-admin-panel";
import {message} from "antd";
import helpers from "../helpers";
import {Select} from "react-antd-admin-panel/dist";

export default class Excluded extends React.Component<any, any> {

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
        const cycle: Cycle = main.$cycle(`/excluded/${faculty}`);
        const get: Get = main.$get(cycle, `/api/excluded`);

        const text: string = 'Listen indeholder de fag fra Odin der ikke skal overføres til itslearning.';
        const explain: string = 'Her kan du søge efter alle fag fra Odin. Tilføj faget ved at trykke på knappen tilføj.';

        const select = new Select();
        const section = new Section();
        const autocomplete = new Autocomplete();

        const courses = new List()
            .get(() => get)
            .emptyColumn(true)
            .emptyIcon(WarningOutlined)
            .emptyText('Listen er tom')
            .bordered()
            .headerCreate(false)
            .headerPrepend(new ListHeader().key('courseId').title('Kursus ID').searchable())
            .headerPrepend(new ListHeader().key('termname').title('Periode').filterable())
            .headerPrepend(new ListHeader().key('createdby').title('Oprettet af').filterable())
            .actions(new Action()
                .key('deleteConfirm')
                .access({ feature: 'Excluded', level: 7 })
                .formula(new Formula(new Post()
                    .target((args) => ({
                        method: 'DELETE',
                        target: `/api/excluded/${args.record.courseId}`,
                    }))
                    .header({ 'Faculty': helpers.facultyEnums(faculty, main) })
                    .onThen(() => courses.refresh(cycle)))
                ));

        section.style({ padding: '24px 36px' });
        section.formula(new Formula(new Post()
            .target(`/api/excluded?faculty=${faculty.toUpperCase()}`)
            .header({ 'Content-Type': 'application/json', 'Faculty': helpers.facultyEnums(faculty, main) })
            .onThen(() => {
                courses.refresh(cycle);
                message.success('Kurset er blevet slettet');
            })
            .onCatch(() => {
                message.error('Kurset blev ikke slettet');
            })
        ))

        section.add(new Title().label('Slettede Kurser').level(1))
        section.add(new Typography().label(explain))
        section.add(new Space().left(12))

        section.add(select
            .style({ width: '100%', marginRight: 0, marginBottom: 0 })
            .default({ value: 'itsl' })
            .add(new Item('itsl').title('Søg i ITSL').text('Manuelle, planlagte og overførte kurser'))
            .add(new Item('stads').title('Søg i STADS').text('Brug STADS hvis kurset ikke findes i ITSL'))
            .onChange(() => autocomplete.clearSelf()),
        )

        section.add(autocomplete
            .key('courseId')
            .label('Find kursus')
            .styleForm({ width: '100%' })
            .get((value) => new Get()
                .target(() => {
                    if (select._defaultObject.value === 'itsl') return ({
                        target: `/api/courses/search`,
                        params: {
                            with: 7,
                            query: value,
                            page: 1,
                            take: 25
                        }
                    })
                    return ({
                        target: `/api/stads/${faculty}/search/${value}`,
                    })
                })
                .header({ 'Faculty': helpers.facultyEnums(faculty, main), 'Content-Type': 'application/json' })
                .alter((v: any) => v
                    .map((r: any) => new Item(r.courseId).id(r.courseId).title(select._defaultObject.value === 'itsl' ? r.title : r.courseName).text(r.courseId).object(r))
                    .filter((r: any) => {
                        return !((r._object.source === 'TRANSFERRED' || r._object.source === 'SCHEDULED') && v.some((s: any) => s.courseId === r._object.courseId && (s.source === 'MANUAL' || s.source === 'EXCLUDED')));
                    })
                ))
        )

        section.add(new Section().row().end()
            .add(new Button()
                .access({ feature: 'Excluded', level: 3 })
                .action(new Action()
                    .type('submit')
                    .label('Tilføj til liste')
                    .icon(PlusOutlined))))

        section.add(new Space().top(12))
        section.add(new Title().label('Slettet').level(3));
        section.add(new Typography().label(text));
        section.add(courses)
        section.init()

        this.setState({ section: section, faculty: faculty });
    }

    title = (faculty: string) => {

        let text: string = '';
        switch (faculty) {
            case 'tek':
                text = 'Det Tekniske Fakultet';
                break;
            case 'hum':
                text = 'Det Humanistiske Fakultet';
                break;
            case 'sam':
                text = 'Det Samfundsfaglige Fakultet';
                break;
            case 'sun':
                text = 'Det Sundhedsvidenskabenlige Fakultet';
                break;
            case 'nat':
                text = 'Det Naturvidenskabenlige Fakultet';
                break;
        }

        return new Title().label(text);
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