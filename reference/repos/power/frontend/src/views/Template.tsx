import React from "react";

import {
    ListHeader,
    Section,
    Space,
    Title,
    List,
    Get, Main, ListItem,
    Conditions, ConditionsItem, Input, Select, Formula, Post, Typography, Button, Action, Cycle
} from './../typescript/index';

import SectionComponent from './../components/Section';
import {message} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";

export default class Day extends React.Component<any, any> {

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
        const cycle: Cycle = main.$cycle('/')
        const section = new Section();

        section.style({ padding: '24px 36px' });
        section.add(new Space().top(8))
        section.add(new Input().key('key'))

        const formular = new Formula(
            new Post()
                .main(main)
                .target(() => ({
                    method: 'POST',
                    target: `/api/`,
                }))
                .onThen(() => {
                    message.success('Det blev gemt!');
                })
                .onCatch(() => {
                    message.error('Det blev ikke gemt!');
                })
            )

        section.formula(formular).init();
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