import React from "react";

import {
    ListHeader,
    Section,
    Space,
    Title,
    List,
    Get, Main, ListItem,
    Conditions, ConditionsItem, Input, Select, Formula, Post, Typography, Button, Action
} from './../../typescript/index';

import SectionComponent from './../../components/Section';
import {Col, message, Row} from "antd";
import {ArrowRightOutlined} from "@ant-design/icons";
import {Autocomplete, Item, SelectItem} from "./../../typescript/index";
import LoadingIcon from "antd/lib/button/LoadingIcon";
import {addCondition} from "../../helpers";
import {ItemValue} from "../../typescript";
import {IArea, IFormular, IFormularCreator, IRole, IValueOption} from "../../classes";

export default class FormularCreators extends React.Component<any, any> {

    /**
     * 
     * Endpoints used in this view:
     * 
     * GET      /api/areas                                      [] OK
     * GET      /api/formularCreatorsByModerator                [] OK
     * GET      /api/formularCreatorRoles                       [] OK
     * GET      /api/formularCreatorTriggers                    [] OK
     * GET      /api/formularCreatorTriggerSearch               [] OK
     * POST     /api/formularCreatorCreate                      [] OK
     * POST     /api/formularCreatorRolesCreate                 [] OK
     * POST     /api/formularCreatorTriggerCreate               [] OK
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
        const section = new Section();

        let areas = new Get().target('/api/areas')
            .onThen(() => {})
            .onCatch(() => {})

        areas.get()


        let formulars = new Get().target('/api/formularCreatorsByModerator')
            .onThen(() => {
                condition.checkCondition(() => true)
            })
            .onCatch(() => {
                condition.checkCondition(() => true)
            })

        let list = new List()
            .get(() => formulars)
            .expandableSingles()
            .headerCreate(false)
            .headerPrepend(new ListHeader().key('name').title('Navn').render((v, o) => {
                return <>
                    <Col>
                        <Row style={{ fontWeight: 600 }}>{ o.name }</Row>
                        <Row>{ o.description }</Row>
                    </Col></>
            }))
            // .headerPrepend(new ListHeader().key('area').title('Område').render((v, o) => <>{o.area.name}</>))
            .actions(new Action()
                .icon(ArrowRightOutlined)
                .callback((v) => {
                    main.$route(`/formularCreator?id=` + v.record.id);
            }))
            .expandable((v: ListItem) => true)
            .expandableSection((v: ListItem) => {
                return (next) => {

                    // The Get for formularCreatorRoles
                    let formularCreatorRoles = new Get().target(() => ({
                        target: '/api/formularCreatorRoles',
                        params: { id: v._object.id }
                    }))
                        .onThen(() => {
                            conditionCreatorRoles.checkCondition(() => true)
                        })
                        .onCatch(() => {})

                    let formularCreatorTriggers = new Get().target(() => ({
                        target: '/api/formularCreatorTriggers',
                        params: { id: v._object.id }
                    }))
                        .onThen(() => {
                            conditionCreatorTriggers.checkCondition(() => true)
                        })
                        .onCatch(() => {})

                    let sectionExpand = new Section();

                    let conditionCreatorRoles = new Conditions().default(() => false)
                    let conditionCreatorTriggers = new Conditions().default(() => false)

                    let listCreatorRoles = new List()
                        .get(() => formularCreatorRoles)
                        .emptyText('')
                        .emptyIcon(LoadingIcon)
                        .footer(false)
                        .headerCreate(false)
                        .headerPrepend(new ListHeader()
                            .key('area')
                            .title('Område')
                            .render((v: any, o: any) => <span>{o.area.name}</span>)
                        )
                        .headerPrepend(new ListHeader()
                            .key('role')
                            .title('Role')
                            .render((v: any, o: any) => <span>{o.role.name}</span>)
                        )

                    let listCreatorTriggers = new List()
                        .get(() => formularCreatorTriggers)
                        .emptyText('')
                        .emptyIcon(LoadingIcon)
                        .footer(false)
                        .headerCreate(false)
                        .headerPrepend(new ListHeader()
                            .key('formular_creator_id')
                            .title('Formular')
                            .render((v: any, o: any) => <span>{o.formular_then.name}</span>)
                        )

                    let autocompleteFormularCreator = new Autocomplete()
                    let buttonFormularCreator = new Button()

                    sectionExpand.add(new Title().level(5).label('Angiv hvilke områder der må udfylde formularen'))
                    sectionExpand.add(conditionCreatorRoles)
                    sectionExpand.add(new Space().top(24))

                    // -------------------------------------------------------------------------------------------------
                    // Add user roles

                    let dataRoles = new Get()
                        .target(() => ({
                            target: '/api/roles'
                        }))
                        .onThen(() => conditionRoles.checkCondition(() => true))

                    dataRoles.get()

                    let autocompleteArea = new Autocomplete();
                    let button = new Button();
                    let selectRole = new Select();
                    let autocompleteSearched = '';
                    let autocompleteSearchedTrigger = '';

                    let sectionForAddUserRole = () => new Section()
                        .add(new Space().top(0))
                        .addMore([
                            selectRole
                                .key('role_id')
                                .label('Find et Area')
                                .sizeString('middle')
                                .ignoreOnChange(true)
                                .clearable(false)
                                .addMore(dataRoles._data.map((r: IRole) => (
                                    {
                                        id: r.id,
                                        value: r.name
                                    } as IValueOption
                                ))),
                            autocompleteArea
                                .key('id')
                                .label('Find et Area')
                                .styleForm({ marginTop: 8 })
                                .sizeString('middle')
                                .ignoreOnChange(true)
                                .clearable(false)
                                .get(() => new Get()
                                    .target((args) => {
                                        autocompleteSearched = args;
                                        return ({ target: `/api/areaSearch`, params: { q: args }})
                                    })
                                    .alter((v: any) => ({
                                        autocompleteSearched: autocompleteSearched,
                                        values: v.map((r: IArea) => (
                                            {
                                                id: r.id,
                                                value: r.name
                                            } as IValueOption
                                        ))
                                    }))
                                ),
                            button
                                .style({ marginTop: 12 })
                                .action(new Action()
                                    .callback(() => new Post()
                                        .target(() => {
                                            return ({
                                                target: `/api/formularCreatorRolesCreate`,
                                                params: {
                                                    formular_creator_id: v._object.id,
                                                    area_id: autocompleteArea.getId(),
                                                    role_id: selectRole.getId()
                                                }
                                            })
                                        })
                                        .onThen(() => {
                                            message.success('Rækken blev tilføjet.')
                                            listCreatorRoles.refresh(() => {
                                                listCreatorRoles.tsxSetExpandable(v);
                                            });
                                        })
                                        .onCatch(() => {
                                            message.error('Rækken blev ikke tilføjet.')
                                        })
                                        .submit())
                                    .hideClear()
                                    .label(' Tilføj til Role')
                                    // .icon(PlusOutlined)
                                )
                        ])

                    let conditionRoles = addCondition(sectionForAddUserRole, undefined)

                    sectionExpand.add(conditionRoles)

                    // -------------------------------------------------------------------------------------------------

                    sectionExpand.add(new Space().top(24))
                    sectionExpand.add(new Title().level(5).label('Angiv hvilke formularer der skal udløses'))
                    sectionExpand.add(conditionCreatorTriggers)
                    sectionExpand.add(new Space().top(24))
                    sectionExpand.addMore([
                        autocompleteFormularCreator
                            .key('id')
                            .label('Find en formular')
                            .styleForm({ marginTop: 8 })
                            .sizeString('middle')
                            .ignoreOnChange(true)
                            .clearable(false)
                            .label('Find en formular')
                            .get(() => new Get()
                                .target((args) => {
                                    autocompleteSearchedTrigger = args
                                    return ({ target: `/api/formularCreatorsByModeratorSearch`, params: { q: args }})
                                })
                                .alter((v: IFormularCreator[]) => ({
                                    autocompleteSearched: autocompleteSearchedTrigger,
                                    values: v.map((r: IFormularCreator) => (
                                        {
                                            id: r.id,
                                            value: r.name,
                                            description: r.description
                                        } as IValueOption
                                    ))
                                }))
                            ),
                        buttonFormularCreator
                            .style({ marginTop: 12 })
                            .action(new Action()
                                .callback(() => new Post()
                                    .target(() => {
                                        return ({
                                            target: `/api/formularCreatorTriggerCreate`,
                                            params: {
                                                name: 'Name',
                                                description: 'Description',
                                                formular_creator_id_when: v._object.id,
                                                formular_creator_id_then: autocompleteFormularCreator.getId(),
                                            }
                                        })
                                    })
                                    .onThen(() => {
                                        message.success('Rækken blev tilføjet.')
                                        listCreatorTriggers.refresh(() => {
                                            listCreatorTriggers.tsxSetExpandable(v);
                                        });
                                    })
                                    .onCatch(() => {
                                        message.error('Rækken blev ikke tilføjet.')
                                    })
                                    .submit())
                                .hideClear()
                                .label('Tilføj til udløser')
                            )
                    ])

                    let conditionCreatorRolesLoading = new ConditionsItem()
                        .condition(v => !v)
                        .content((next) => next(new Section().add(new Typography().label(''))))
                    let conditionCreatorRolesSuccess = new ConditionsItem()
                        .condition(v => v)
                        .content((next) => next(new Section().add(listCreatorRoles)))

                    conditionCreatorRoles.add(conditionCreatorRolesLoading)
                    conditionCreatorRoles.add(conditionCreatorRolesSuccess)

                    let conditionFormularCreatorTriggerLoading = new ConditionsItem()
                        .condition(v => !v)
                        .content((next) => next(new Section().add(new Typography().label(''))))
                    let conditionFormularCreatorTriggerSuccess = new ConditionsItem()
                        .condition(v => v)
                        .content((next) => next(new Section().add(listCreatorTriggers)))

                    conditionCreatorTriggers.add(conditionFormularCreatorTriggerLoading)
                    conditionCreatorTriggers.add(conditionFormularCreatorTriggerSuccess)

                    listCreatorRoles.refresh()
                    listCreatorTriggers.refresh()

                    next(sectionExpand)
                }
            })

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

        // Condition for user roles for each element of the list

        let addFormular = () => {

            let section = new Section()

            let formula = new Formula(new Post()
                .main(main)
                .target(() => ({
                    target: '/api/formularCreatorCreate',
                }))
                .onThen(() => {
                    list.refresh()
                    main.$modalLoading(false);
                    main.$modalClose();
                })
                .onCatch(() => {
                    main.$modalLoading(false);
                    main.$modalClose();
                })
            )

            section.formula(formula)
            section.add(new Space().top(24))
            section.add(new Input().key('name').label('Navn'))
            section.add(new Input().key('description').label('Beskrivelse'))
            section.add(new Select().key('area_id').label('Område')
                .addMore(areas._data.map((e: IArea) => (
                    {
                        id: e.id,
                        value: e.name
                    } as IValueOption
                )))
            )

            section.init()

            return ({
                title: 'Opret en formular',
                label: 'Her kan du oprette en formular',
                visible: true,
                section: section,
                handleCancel: () => main.$modalClose(),
                handleOk: () => {
                    main.$modalLoading(true);
                    formula.submit();
                }
            })
        }

        let formularCreator = new Button().action(new Action().label('Opret formular').callback(() => main.$modal(addFormular())))

        section.add(formularCreator)
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