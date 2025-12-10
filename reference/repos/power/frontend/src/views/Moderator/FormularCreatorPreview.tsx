import React from "react";

import {
    ListHeader,
    Section,
    Space,
    Title,
    List,
    Get, Main, ListItem,
    Conditions, ConditionsItem, Input, Select, Formula, Post, Typography, Button, Action, Cycle, SelectItem
} from './../../typescript/index';

import SectionComponent from './../../components/Section';

export default class FormularCreatorPreview extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            section: false,
            text: '',
            resultSet: '',
        }
    }

    build() {

        const main: Main = this.props.main;
        const cycle: Cycle = main.$cycle('/formularCreatorPreview')
        const section = new Section();

        let id = cycle._path._query?.['id']

        section.style({ padding: '24px 36px' });
        section.add(new Title().label('Formular Creator Preview').level(2));

        this.setState({ section: section });
    }

    render() {
        return (
            <>{!!this.state.section &&
            <SectionComponent key={this.state.id} main={this.props.main} section={this.state.section}/>}</>
        );
    }

    componentDidMount() {
        this.build()
    }
}