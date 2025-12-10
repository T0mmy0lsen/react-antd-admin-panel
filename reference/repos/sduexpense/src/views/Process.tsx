import React, {Component} from "react";
import {
    Main,
} from "../typescript/index";

import SectionComponent from "../components/Section";
import klinikophold from "./processes/klinikophold";
import externalsProcess from "./processes/externals";
import {Section, Space, Title, Typography} from "../typescript";

export default class Process extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            section: false,
            filter: false,
            id: false,
        }
    }

    build() {

        const main: Main = this.props.main;
        const id: string = main.$params('id');
        const type = main.$query('type')
        const section = new Section()

        const setCurrent = (current: number) => {
            this.setState({ current: current })
        }

        const getElement = (type: string) => {
            switch (type) {
                case 'klinikophold':
                    return klinikophold(main)
                case 'externals':
                    return externalsProcess(main)
            }

            console.log(main)
            console.log(main.$account.idTokenClaims.name)

            return new Section().style({ marginLeft: 12 })
                .add(new Title().label("SDU Expense"))
                .add(new Typography().label("You need a unique link to continue."))
        }

        let element = getElement(type)
        section.add(element)

        this.setState({ section: section, id: id });
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

    componentDidUpdate(prevProps, prevState, snapshot?) {
        if (snapshot) this.build();
    }
}
