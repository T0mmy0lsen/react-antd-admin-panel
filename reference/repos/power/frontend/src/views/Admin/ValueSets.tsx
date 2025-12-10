import React from "react";

import {
    ListHeader,
    Section,
    Space,
    Title,
    List,
    Get, Main, ListItem,
    Conditions, ConditionsItem, Input, Formula, Post, Typography, Button, Action
} from './../../typescript/index';

import SectionComponent from './../../components/Section';
import {Col, message, Row} from "antd";
import LoadingIcon from "antd/lib/button/LoadingIcon";
import {Checkbox, Item} from "../../typescript";
import {ArrowRightOutlined} from "@ant-design/icons";

const findByKey = (arr, key) => arr.find(obj => obj.key === key);

export default class FormularCreator extends React.Component<any, any> {

    /**
     * 
     * Endpoints used in this view:
     * 
     * GET      /api/valueSets              [] OK
     * GET      /api/valueOptions           [] OK
     * POST     /api/valueSetCreate         [] OK
     * POST     /api/valueCreate            [] OK
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

        let valueSets = new Get().target('/api/valueSets')
            .onThen(() => {
                condition.checkCondition(() => true)
            })
            .onCatch(() => {
                condition.checkCondition(() => true)
            })

        let listWithLists = new List()
            .get(() => valueSets)
            .headerCreate(false)
            .headerPrepend(new ListHeader().key('name').title('').render((v, o) => {
                return <>
                    <Col>
                        <Row style={{ fontWeight: 600 }}>{ o.name }</Row>
                        <Row>{ o.description }</Row>
                    </Col></>
            }))
            .actions(new Action()
                .icon(ArrowRightOutlined)
                .callback((v) => {
                    main.$route(`/adminListsEdit?id=` + v.record.id);
                }))
            .expandable((v: ListItem) => true)
            .expandableSection((v: ListItem) => {
                return (next) => {

                    let addValueSetHeaders = () => {

                        let section = new Section()

                        let formula = new Formula(new Post()
                            .main(main)
                            .target(() => ({
                                target: '/api/valueSetHeaderCreate',
                            }))
                            .onThen(() => {
                                listWithLists.refresh()
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
                        section.add(new Input().key('value_set_id').default(v._object.id).hidden())
                        section.add(new Input().key('key').label('Key'))
                        section.add(new Input().key('value').label('Value'))

                        section.init()

                        return ({
                            title: 'Opret en ny kolonne',
                            label: 'Her kan du oprette en ny kolonne',
                            visible: true,
                            section: section,
                            handleCancel: () => main.$modalClose(),
                            handleOk: () => {
                                main.$modalLoading(true);
                                formula.submit();
                            }
                        })
                    }

                    let addValueSetHeader = new Button().action(new Action().label('Opret en ny kolonne').callback(() => main.$modal(addValueSetHeaders())))

                    // The Get for Values
                    let values = new Get().target(() => ({
                        target: '/api/valueOptions',
                        params: { value_set_id: v._object.id }
                    }))
                        .onThen(() => {
                            conditionValues.checkCondition(() => true)
                        })
                        .onCatch(() => {
                            conditionValues.checkCondition(() => true)
                        })

                    let sectionValues = new Section();
                    let conditionValues = new Conditions().default(() => false)
                    let listValues = new List()
                        .get(() => values)
                        .emptyText('')
                        .emptyIcon(LoadingIcon)
                        .footer(false)
                        .headerCreate(false)
                        // .headerPrepend(new ListHeader().key('value').title('Value'))

                    v._object.headers.forEach((e, i) => {
                        listValues.headerPrepend(new ListHeader().key(e.key).title(e.value).render((_, o) => {
                            return <>{ findByKey(o._object.fields, e.key)?.value }</>
                        }))
                    })

                    let inputs : Input[] = v._object.headers.map(() => new Input())

                    v._object.headers.map((e, i) => {
                        return inputs[i]
                            .key(e.key)
                            .label(e.value)
                            .ignoreOnChange(true)
                            .clearable(false)
                    });

                    let button = new Button()
                        // .access({ feature: 'Profile', level: 3 })
                        .action(new Action()
                            .callback(() => new Post()
                                .target(() => {
                                    return ({
                                        target: `/api/valueCreate`,
                                        params: {
                                            values: inputs.map((e) => ({ key: e._key, value: e.getValue() })),
                                            value_set_id: v._object.id
                                        }
                                    })
                                })
                                .onThen(() => {
                                    message.success('Rækken blev tilføjet.')
                                    listValues.refresh(() => {
                                        listValues.tsxSetExpandable(v);
                                    });
                                })
                                .onCatch(() => {
                                    message.error('Rækken blev ikke tilføjet.')
                                })
                                .submit())
                            .hideClear()
                            .label('Tilføj')
                            //.icon(PlusOutlined)
                        )

                    sectionValues.add(addValueSetHeader)
                    sectionValues.add(conditionValues)
                    sectionValues.add(new Space().top(24))

                    let sectionValueInputs = new Section().style({ padding: '8px 8px 8px 40px' })

                    inputs.forEach(e => sectionValueInputs.add(e))
                    sectionValueInputs.addRowEnd(button)

                    sectionValues.add(sectionValueInputs)

                    let conditionValuesLoading = new ConditionsItem()
                        .condition(v => !v)
                        .content((next) => next(new Section().add(new Typography().label(''))))
                    let conditionValuesSuccess = new ConditionsItem()
                        .condition(v => v)
                        .content((next) => next(new Section().add(listValues)))

                    conditionValues.add(conditionValuesLoading)
                    conditionValues.add(conditionValuesSuccess)

                    listValues.refresh()

                    next(sectionValues)
                }
            })

        section.style({ padding: '0px 36px 48px 36px' });
        section.add(new Title().label('Lister').level(2));
        section.add(new Space().top(16));

        // Condition for show list

        let condition = new Conditions().default(() => false)
        let conditionLoading = new ConditionsItem()
            .condition(v => !v)
            .content((next) => next(new Section().add(new Typography().label(''))))
        let conditionSuccess = new ConditionsItem()
            .condition(v => v)
            .content((next) => next(new Section().add(listWithLists)))

        condition.add(conditionLoading)
        condition.add(conditionSuccess)

        // Condition for user roles for each element of the list

        let addValueSets = () => {

            let section = new Section()

            let formula = new Formula(new Post()
                .main(main)
                .target(() => ({
                    target: '/api/valueSetCreate',
                }))
                .onThen(() => {
                    listWithLists.refresh()
                    main.$modalLoading(false);
                    main.$modalClose();
                })
                .onCatch(() => {
                    main.$modalLoading(false);
                    main.$modalClose();
                })
            )

            let list = new List()
                .key('config')
                .format(v => ({
                    headers: v.map((e) => e.value )
                }))
                .formula(formula)
                .footer(false)
                .header(false)
                .headerCreate(false)
                .headerPrepend(new ListHeader().key('value').title('Kolonne').editable(true))

            list._defaultObject = { dataSource: [{ value: 'Label' }] }

            section.formula(formula)
            section.add(new Space().top(24))
            section.add(new Input().key('name').label('Navn'))
            section.add(new Input().key('description').label('Beskrivelse'))
            section.add(new Section().style({ paddingLeft: 40 }).add(list))
            section.add(new Space().top(12))
            section.addRowEnd(new Button().link().action(new Action().label('Tilføj kolonne').callback(() => list.setRecord({ value: '' }))))
            section.add(new Space().top(12))

            section.init()

            return ({
                title: 'Opret en liste-værdi',
                label: 'Her kan du oprette en liste-værdi',
                visible: true,
                section: section,
                handleCancel: () => main.$modalClose(),
                handleOk: () => {
                    main.$modalLoading(true);
                    formula.submit();
                }
            })
        }

        let addValueSet = new Button().action(new Action().label('Opret en liste-værdi').callback(() => main.$modal(addValueSets())))

        section.add(addValueSet)
        section.add(new Space().top(16))
        section.add(condition)

        listWithLists.refresh()

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