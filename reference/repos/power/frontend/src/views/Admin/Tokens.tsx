import React from "react";

import {
    ListHeader,
    Section,
    Space,
    Title,
    List,
    Get, Main, Input, Formula, Post, Button, Action
} from '../../typescript/index';

import SectionComponent from '../../components/Section';
import { addCondition } from "../../helpers";
import { IModalState } from "../../classes";

export default class Tokens extends React.Component<any, any> {

    /**
     * 
     * Endpoints used in this view:
     * 
     * GET      /api/tokens              [] OK
     * POST     /api/tokensCreate        [] OK
     * 
     */

    constructor(props) {
        super(props);
        this.state = {
            section: false,
        }
    }

    build() {

        const main: Main = this.props.main;
        const section = new Section();

        let tokens = new Get().target('/api/tokens')
            .onThen(() => {
                condition.checkCondition(() => true)
            })
            .onCatch(() => {
                condition.checkCondition(() => true)
            })

        let listWithTokens = new List()
            .get(() => tokens)
            .headerCreate(false)
            .addDummyColumn(true)
            .headerPrepend(new ListHeader().key('name').title(''))

        section.style({ padding: '0px 36px 48px 36px' });
        section.add(new Title().label('Tokens').level(2));
        section.add(new Space().top(16));

        // Condition for show list

        let condition = addCondition(listWithTokens, new Formula(new Post()))

        // Condition for user roles for each element of the list

        let addTokenModal = () => {

            let section = new Section()

            let tokenField = new Input()
                .key('token')
                .label('Token')
                .clearable(false)
                .copyable(true)

            let formula = new Formula(new Post()
                .main(main)
                .target(() => ({
                    target: '/api/tokensCreate',
                }))
                .onThen((data) => {
                    listWithTokens.refresh()
                    tokenField.tsxSetValue(data.data.token)
                })
                .onCatch(() => {
                    // console.log('Error for /api/tokensCreate');
                })
            )

            section.formula(formula)
            section.add(new Space().top(24))
            section.add(new Input().key('name').label('Navn'))
            section.add(tokenField).disabled(true)
            section.add(new Space().top(12))
            section.add(new Button().action(new Action().label('Opret').callback(() => formula.submit())))

            section.init()

            let state: IModalState = {
                visible: true,
                title: 'Opret en ny Token',
                section: section,
                closable: false,
                maskClosable: false,
                handleCancel: () => main.$modalClose(),
                handleOk: () => main.$modalClose(),
            }

            return state;
        }

        let addToken = new Button().action(new Action().label('Opret en Token').callback(() => main.$modal(addTokenModal())))

        section.add(addToken)
        section.add(new Space().top(16))
        section.add(condition)

        listWithTokens.refresh()

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