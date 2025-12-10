import React from "react";

import {
    ListHeader, Section, Space, Title, List, Get, Main, ListItem, Typography, Button, Action, Cycle
} from './../../typescript/index';

import SectionComponent from './../../components/Section';

import {
    CodeOutlined,
} from "@ant-design/icons";
import {IFormularCreatorElements} from "../../classes";
import {addCondition, getSortedElements} from "../../helpers";
import configSection from "./FormularCreator/ElementConfig";
import addFormular from "./FormularCreator/ElementAdd";
import configSectionCreator from "./FormularCreator/Config";

export default class FormularCreator extends React.Component<any, any> {

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
        const cycle: Cycle = main.$cycle('/formularCreator')
        const section = new Section();

        // -------------------------------------------------------------------------------------------------------------
        // Get data
        // -------------------------------------------------------------------------------------------------------------

        let classes = new Get().target('/api/classes')
            .onThen(() => {})
            .onCatch(() => {})

        let actions = new Get().target('/api/actions')
            .onThen(() => {})
            .onCatch(() => {})

        let valueSets = new Get().target('/api/valueSets')
            .onThen(() => {})
            .onCatch(() => {})

        let formular = new Get().target('/api/formularCreator?id=' + cycle._path._query?.['id'])
            .onThen(() => {
                condition.checkCondition(() => true)
            })
            .onCatch(() => {
                condition.checkCondition(() => true)
            })

        let elements = new Get().target('/api/formularCreatorElements?id=' + cycle._path._query?.['id'])
            .onThen(() => {
                condition.checkCondition(() => true)
            })
            .onCatch(() => {
                condition.checkCondition(() => true)
            })
            .alter(v =>
            {
                let list = v.filter((e: IFormularCreatorElements) => !e.parent_id);
                return getSortedElements(list);
            })


        valueSets.get()
        formular.get()
        classes.get()
        actions.get()

        // -------------------------------------------------------------------------------------------------------------
        // Expandable
        // -------------------------------------------------------------------------------------------------------------

        let expandable = (v: ListItem) => {
            return (next) => {
                let formularCreator = new Button()
                    .action(new Action()
                        .label('Opret')
                        .callback(() => main.$modal(addFormular(
                            v._object.id,
                            cycle,
                            main,
                            list,
                            actions,
                            classes,
                            valueSets,
                            formular
                        )))
                    )

                let sectionExpandable = new Section();
                let listExpandable = new List()
                    .headerCreate(false)
                    .footer(false)
                    .headerPrepend(new ListHeader().key('name').title('Navn'))
                    .headerPrepend(new ListHeader().key('class').title('Type').width('200px').render((v, o) => <>{o.class}</>))
                    // .headerPrepend(new ListHeader().key('value').title('Værdi').width('200px').render((v, o) => <>{o.value_set?.name}</>))
                    // .headerPrepend(new ListHeader().key('section').title('Sektion').width('200px').render((v, o) => <>{o.section ?? ''}</>))
                    // .headerPrepend(new ListHeader().key('group').title('Gruppe').width('200px').render((v, o) => <>{o.group ?? ''}</>))
                    // .headerPrepend(new ListHeader().key('order').title('Sortering').width('200px').render((v, o) => <>{o.order ?? ''}</>))
                    .expandable((o : IFormularCreatorElements) => o.class === 'Condition')
                    .expandableSection((v: ListItem) => {
                        // console.log('Expandable Section', v);
                        let section = new Section()
                        section.addRowStart([
                            new Typography().style({ marginRight: 4 }).label(v._object.name),
                            new Typography().style({ opacity: .6 }).label(v._object.description ?? '')
                        ])
                        section.add(expandable(v))
                        return section
                    })
                    .actions(new Action()
                        .icon(CodeOutlined)
                        .callback((v) => {
                            main._setSiderRight(configSection(v, main, list, formular));
                        }))

                listExpandable.default({ dataSource: v._object.elements.filter(e => !!e) ?? [] })

                sectionExpandable.add(listExpandable)
                sectionExpandable.add(new Space().top(24))
                sectionExpandable.addRowEnd([formularCreator])

                next(sectionExpandable)
            }
        }

        // -------------------------------------------------------------------------------------------------------------
        // List with Elements
        // -------------------------------------------------------------------------------------------------------------

        let list = new List()
            .get(() => elements)
            .headerCreate(false)
            .headerPrepend(new ListHeader().key('name').title('Navn'))
            .headerPrepend(new ListHeader().key('class').title('Type').width('200px').render((v, o) => <>{o.class}</>))
            .expandable((o : IFormularCreatorElements) => o.class === 'Condition')
            .expandableSection((v: ListItem) => {
                let section = new Section()
                section.addRowStart([
                    new Typography().style({ marginRight: 4 }).label(v._object.name),
                    new Typography().style({ opacity: .6 }).label(v._object.description ?? '')
                ])
                section.add(expandable(v))
                return section
            })
            .actions(new Action()
                .icon(CodeOutlined)
                .callback((v) => {
                    main._setSiderRight(configSection(v, main, list, formular));
                }))

        // -------------------------------------------------------------------------------------------------------------
        // Header elements
        // -------------------------------------------------------------------------------------------------------------

        section.style({ padding: '0px 36px 48px 36px' });
        section.add(new Title().label('Formular redigering').level(2));
        section.add(new Space().top(16));

        // -------------------------------------------------------------------------------------------------------------
        // Show list when loaded
        // -------------------------------------------------------------------------------------------------------------

        let condition = addCondition(list, formular);

        // -------------------------------------------------------------------------------------------------------------
        // Buttons on top of the page
        // -------------------------------------------------------------------------------------------------------------

        let formularCreator = new Button()
            .action(new Action()
                .label('Opret et nyt felt')
                .callback(() => main.$modal(addFormular(
                    undefined, // cycle._path._query?.['id'],
                    cycle,
                    main,
                    list,
                    actions,
                    classes,
                    valueSets,
                    formular
            ))))

        let formularConfig = new Button()
            .style({ marginLeft: 16 })
            .action(new Action()
                .label('Konfigurer formular')
                .callback(() => main._setSiderRight(configSectionCreator(main, formular._data))))

        let buttonSection = new Section().row().start()

        buttonSection.add(formularCreator)
        buttonSection.add(formularConfig)

        section.add(buttonSection)

        // -------------------------------------------------------------------------------------------------------------
        // Set the list through the condition
        // -------------------------------------------------------------------------------------------------------------

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