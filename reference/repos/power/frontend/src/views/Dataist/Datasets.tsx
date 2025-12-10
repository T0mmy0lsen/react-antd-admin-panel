import React from "react";

import {
    ListHeader,
    Section,
    Space,
    Title,
    List,
    Get, Main,
    Conditions, ConditionsItem, Typography, Action, Cycle
} from './../../typescript/index';

import SectionComponent from './../../components/Section';
import {ArrowRightOutlined} from "@ant-design/icons";

export default class Frontpage extends React.Component<any, any> {

    /**
     * 
     * Endpoints used in this view:
     * 
     * GET      /api/formularCreatorsByDataist              []
     * 
     */

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
        const cycle: Cycle = main.$cycle('/formularDatasets')
        const section = new Section();

        let formularCreators = new Get().target('/api/formularCreatorsByDataist')
            .onThen(() => {
                condition.checkCondition(() => true)
            })
            .onCatch(() => {})


        let list = new List()
            .get(() => formularCreators)
            .headerCreate(false)
            .addDummyColumn(true)
            .headerPrepend(new ListHeader().key('name').title('Name'))
            .headerPrepend(new ListHeader().key('description').title('Description'))
            .actions(new Action()
                .icon(ArrowRightOutlined)
                .callback((v) => {
                    main.$route(`/formularDataset?id=` + v.record.id);
            }))

        section.style({ padding: '0px 36px 48px 36px' });
        section.add(new Title().label('Formularer').level(2));
        section.add(new Space().top(16));

        // Condition for show list

        let condition = new Conditions().default(() => false)
        let conditionLoading = new ConditionsItem()
            .condition(v => !v)
            .content((next) => next(new Section().add(new Typography().label(''))))
        let conditionSuccess = new ConditionsItem()
            .condition(v => v)
            .content((next) => next(new Section().add(list)))

        condition.add(conditionLoading)
        condition.add(conditionSuccess)

        section.add(new Space().top(16))
        section.add(condition)

        list.refresh()

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