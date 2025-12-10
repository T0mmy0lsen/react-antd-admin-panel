import React from "react";

import {
    Section,
    Title,
    Get,
    Main,
    Conditions,
    ConditionsItem,
    Typography,
    Cycle,
    Space
} from './../../typescript/index';

import {downloadExcelFile} from "../../helpers";
import SectionComponent from './../../components/Section';
import {Action, Button, List, ListHeader} from "./../../typescript/index";

export default class FormularEdit extends React.Component<any, any> {

    /**
     * 
     * Endpoints used in this view:
     * 
     * GET      /api/formularsByDatasetReader?id={id}       []
     * 
     */

    constructor(props) {
        super(props);
        this.state = {
            section: false,
            data: []
        }
    }

    build() {

        const main: Main = this.props.main;
        const cycle: Cycle = main.$cycle('/formularDataset')
        const section = new Section();

        let id = cycle._path._query?.['id']

        let formularHeaders: any = [];

        let formularData = new Get().target('/api/formularsByDataist?id=' + id)
            .onThen(() => {
                condition.checkCondition(() => true)
            })
            .onCatch(() => {
                condition.checkCondition(() => true)
            })
            .alter((v) =>
            {
                formularHeaders = Object.keys(v[0]);
                formularHeaders.forEach(h =>
                {
                    let listHeader = new ListHeader()
                        .key(`${h}`)
                        .title(h)
                        .render((v, o) => <>{ o[h] ?? '' }</>)

                    list.headerPrepend(listHeader)
                })

                return v;
            })

        let list = new List()
            .get(() => formularData)
            .addDummyColumn(true)
            .headerCreate(false)

        let button = new Button().action(new Action()
            .label('Export til Excel')
            .callback(() => {
                button.tsxSetLoading(true)
                downloadExcelFile(id, () => button.tsxSetLoading(false))
            }))

        let condition = new Conditions().default(() => false)
        let conditionLoading = new ConditionsItem()
            .condition(v => !v)
            .content((next) => next(new Section().add(new Typography().label(''))))
        let conditionSuccess = new ConditionsItem()
            .condition(v => v)
            .content((next) => {
                next(new Section()
                    .add(new Title().label(this.state.data.name).level(2))
                    .add(new Space().top(16))
                    .add(button)
                    .add(new Space().top(16))
                    .add(list))
                }
            )

        condition.add(conditionLoading)
        condition.add(conditionSuccess)

        section.style({ padding: '0px 36px 48px 36px' });
        section.add(condition)

        formularData.get()

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