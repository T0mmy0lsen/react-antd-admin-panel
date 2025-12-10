import React from "react";

import { Main } from "react-antd-admin-panel";
import {Action, Button, Formula, Input, Item, Post, Section, Select, Space, Title, Typography} from "react-antd-admin-panel";
import { SectionComponent } from "react-antd-admin-panel";
import {message} from "antd";
import helpers from "../helpers";

export default class Create extends React.Component<any, any> {

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

        const section = new Section();
        const explain = 'Opret et manuelt kursus.';

        const form = {
            city: new Select(),
            title: new Input(),
            period: new Select(),
            faculty: new Select(),
        }

        section.style({ padding: '24px 36px' });
        section.formula(new Formula(new Post()
            .formatData(v => { if (v?.cityId) v.cityId = parseInt(v.cityId) })
            .header({
                'Faculty': helpers.facultyEnums(main.$params('faculty'), main),
                'Content-Type': 'application/json'
            })
            .target('/api/courses')
            .onThen(() => {
                message.success('Kurset er blevet oprettet.')
                form.city.clearSelf();
                form.title.clearSelf();
                form.period.clearSelf();
            })
            .onCatch(() => {
                message.error('Kurset blev ikke oprettet.')
            })
        ))

        section.add(new Title().label('Manuelle kurser').level(1));
        section.add(new Typography().label(explain));
        section.add(new Title().label('Titel').level(4));
        section.add(form.title.key('title').label('Angiv kursets titel'))
        section.add(new Title().label('Fakultet').level(4));
        section.add(form.faculty.key('faculty').default({ value: main.$params('faculty').toUpperCase() }).disabled(true))

        section.add(new Title().label('Semester').level(4));
        section.add(form.period.key('period').addMore(
            main.Store.semester.map((r: any) => new Item(r)))
        )

        section.add(new Title().label('By').level(4));
        section.add(form.city.key('cityId').addMore(
            main.Store.cities.map((r: any) => new Item(r.id).title(r.name).object(r)).filter((r: Item) => r._object.syncKey !== 'UNKNOWN').reverse())
        )

        section.add(new Space().top(36))
        section.addRowEnd(new Button().primary().action(new Action().label('Opret').key('submit')))
        section.init();

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