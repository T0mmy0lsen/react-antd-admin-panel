import React from "react";

import {
    ListHeader,
    Section,
    Space,
    Title,
    List,
    Get, Main, ListItem,
    Conditions, ConditionsItem, Input, Select, Formula, Post, Typography, Button, Action, SelectItem
} from './../../typescript/index';

import SectionComponent from './../../components/Section';
import {Col, message, Row} from "antd";
import {ArrowRightOutlined, WarningOutlined} from "@ant-design/icons";
import {Autocomplete, Item} from "./../../typescript/index";
import {addCondition} from "../../helpers";

export default class Users extends React.Component<any, any> {

    /**
     * Endpoints used in this view:
     *
     * -> USER
     * POST         /api/userCreate         [] OK
     * POST         /api/userRoleCreate     [] OK
     * GET          /api/users              [] OK
     *
     * -> AREA
     * GET          /api/areaSearch         [] OK
     *
     * -> ROLE
     * GET          /api/roles              [] OK
     * GET|DELETE   /api/userRoles          [] TODO: DELETE is not created in backend.
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

        let users = new Get().target('/api/users')
            .onThen(() => {
                condition.checkCondition(() => true)
            })
            .onCatch(() => {
                condition.checkCondition(() => true)
            })

        let userRoles = (item : ListItem) =>
        {
            return (next) => {

                let button = new Button()
                let selectRole = new Select()
                let autocompleteArea = new Autocomplete()
                let sectionUserRoles = new Section()

                let dataUserRoles = new Get()
                    .target(() => ({
                        target: '/api/userRoles',
                        params: { user_id: item._object.id }
                    }))
                    .onThen(() => conditionUserRoles.checkCondition(() => true))

                let listForUserRoles = new List()
                    .get(() => dataUserRoles)
                    .footer(false)
                    .headerCreate(false)
                    .headerPrepend(new ListHeader().key('role').title('Role').render(v => {
                        return <>{ v?.name ?? '' }</>
                    }))
                    .headerPrepend(new ListHeader().key('area').title('Area').render(v => {
                        return <>{ v?.name ?? '' }</>
                    }))
                    .emptyText('')
                    .emptyIcon(WarningOutlined)
                    .emptyColumn(true)
                    .actions(new Action()
                        .key('deleteConfirm')
                        // .access({ feature: 'Enrollment', level: 7 })
                        .formula(new Formula(new Post()
                            .target((args) => ({
                                method: 'delete',
                                target: `/api/userRoles/${item._object.roleId}`
                            }))
                            .onThen(() => {
                                message.success('Rækken blev slettet.')
                                list.refresh(() => {});
                            })
                            .onCatch(() => {
                                message.error('Rækken blev ikke slettet.')
                            }))
                        )
                    )

                // --------------------------------------------------
                // Add user role

                let dataRoles = new Get()
                    .target(() => ({
                        target: '/api/roles'
                    }))
                    .onThen(() => conditionRoles.checkCondition(() => true))

                dataRoles.get()

                let sectionForAddUserRole = () => new Section()
                    .add(new Space().top(24))
                    .addRowEnd([
                        selectRole
                            .key('role_id')
                            .label('Find et Area')
                            .styleForm({ marginBottom: 0, marginRight: 8 })
                            .sizeString('middle')
                            .ignoreOnChange(true)
                            .clearable(false)
                            .addMore(dataRoles._data.map((r: any) => new SelectItem(r.name).object(r))),
                        autocompleteArea
                            .key('id')
                            // .access({ feature: 'Enroll', level: 8 })
                            .label('Find et Area')
                            .styleForm({ paddingLeft: 8, marginBottom: 0, marginRight: 8, minWidth: '40%' })
                            .sizeString('middle')
                            .ignoreOnChange(true)
                            .clearable(false)
                            .get(() => new Get()
                                .target((args) => ({ target: `/api/areaSearch`, params: { q: args }}))
                                .alter((v: any) => v.map((r: any) => new Item(r.id)
                                    .id(r.id)
                                    .value(r.name)
                                    .title(r.name)
                                    .text(r.description)
                                    .object(r)))
                            ),
                        button
                            // .access({ feature: 'Profile', level: 3 })
                            .style({ marginRight: 8 })
                            .action(new Action()
                                    .callback(() => new Post()
                                        .target(() => {
                                            return ({
                                                target: `/api/userRoleCreate`,
                                                params: {
                                                    area_id: autocompleteArea._defaultObject.object.object.id,
                                                    user_id: item._object.id,
                                                    role_id: selectRole._defaultObject.object._object.id
                                                }
                                            })
                                        })
                                        .onThen(() => {
                                            message.success('Rækken blev tilføjet.')
                                            listForUserRoles.refresh(() => {
                                                listForUserRoles.tsxSetExpandable(item);
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

                // --------------------------------------------------

                let conditionUserRoles = addCondition(listForUserRoles, undefined)



                sectionUserRoles.add(conditionUserRoles)
                sectionUserRoles.add(conditionRoles)

                listForUserRoles.refresh()

                next(sectionUserRoles);
            }
        }

        let list = new List()
            .get(() => users)
            .expandable(() => true)
            .expandableSection((e : ListItem) => userRoles(e))
            .headerCreate(false)
            .headerPrepend(new ListHeader().key('name').title('').render((v, o) => {
                return <>
                    <Col>
                        <Row style={{ fontWeight: 600 }}>{ o.name }</Row>
                        <Row>{ o.email }</Row>
                    </Col></>
            }))
            .actions(new Action()
                .icon(ArrowRightOutlined)
                .callback((v) => {
                    main.$route(`/open?id=` + v.record.id);
            }))

        section.style({ padding: '0px 36px 48px 36px' });
        section.add(new Title().label('Brugere').level(2));
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

        let addUserModal = () => {

            let section = new Section()

            let formula = new Formula(new Post()
                .main(main)
                .target(() => ({
                    target: '/api/userCreate',
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
            section.add(new Input().key('email').label('Email'))
            section.add(new Input().key('password').label('Kode'))
            section.add(new Input().key('password_confirmation').label('Gentag kode'))
            section.init()

            return ({
                title: 'Opret en bruger',
                label: 'Her kan du oprette en bruger',
                visible: true,
                section: section,
                handleCancel: () => main.$modalClose(),
                handleOk: () => {
                    main.$modalLoading(true);
                    formula.submit();
                }
            })
        }

        let addUser = new Button().action(new Action().label('Opret en bruger').callback(() => main.$modal(addUserModal())))

        section.add(addUser)
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