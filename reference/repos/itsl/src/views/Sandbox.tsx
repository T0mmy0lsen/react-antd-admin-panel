import React from "react";

import { Main } from "react-antd-admin-panel";
import { Section } from "react-antd-admin-panel";
import { SectionComponent } from "react-antd-admin-panel";

export default class Users extends React.Component<any, any> {

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