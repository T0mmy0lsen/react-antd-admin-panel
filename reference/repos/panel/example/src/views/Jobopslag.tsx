import React from "react";
import {
    ListHeader,
    Section,
    Action,
    Cycle,
    Space,
    Title,
    List,
    Main,
    Get
} from 'react-antd-admin-panel';

import {SectionComponent} from 'react-antd-admin-panel';
import {WarningOutlined, ArrowRightOutlined} from "@ant-design/icons/lib";

export default class Jobopslag extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            section: false,
            id: false,
        }
    }

    build() {

        const main: Main = this.props.main;
        const id: string = main.$params('id');
        const cycle: Cycle = main.$cycle(`/jobopslag`);
        const get: Get = main.$get(cycle, `/jobopslag`);

        const section = new Section();
        const things = new List()
            .get(() => get)
            .emptyIcon(WarningOutlined)
            .emptyText('Listen er tom')
            .emptyColumn(true)
            .headerCreate(false)
            .headerPrepend(new ListHeader().key('title').title('title').searchable())
            .headerPrepend(new ListHeader().key('stateName').title('stateName').filterable())
            .actions(new Action()
                .icon(ArrowRightOutlined)
                .callback((v) => {
                    main.$route(`/ansoegning`);
                })
            );

        section.style({ padding: '24px 36px' });
        section.add(new Title().label('Jobopslag').level(1));
        section.add(new Space().top(12));
        section.add(things);

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

    getSnapshotBeforeUpdate(prevProps, prevState) {
        return (this.state.id !== this.props.main.$params('id'));
    }

    componentDidUpdate(prevProps, prevState, snapshot?) {
        if (snapshot) this.build();
    }
}