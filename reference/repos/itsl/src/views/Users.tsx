import React, {useState} from "react";
import helpers from "../helpers";
import { SectionComponent } from "react-antd-admin-panel";
import {Button, message, Modal, Popover, Row, Select, Space, Tooltip, Typography as TypographyAnt} from "antd";
import {PlusOutlined, WarningOutlined} from "@ant-design/icons/lib";

import { Main } from "react-antd-admin-panel";
import {
    ListHeader,
    Typography,
    Checkbox,
    ListItem,
    Formula,
    Section,
    Action,
    Cycle,
    Title,
    Item,
    List,
    Post,
    Get, Access,
} from "react-antd-admin-panel";
import LoadingIcon from "antd/es/button/LoadingIcon";

let getPermFromLevel = (v: number) => {
    return (
        v === 7 ? ['Read', 'Write', 'Delete'] :
            v === 6 ? ['Write', 'Delete'] :
                v === 5 ? ['Read', 'Delete'] :
                    v === 4 ? ['Delete'] :
                        v === 3 ? ['Read', 'Write'] :
                            v === 2 ? ['Write'] :
                                v === 1 ? ['Read'] : []
    )
}
let getLevelFromPerm = (v: any) => {
    v = v.sort().toString();
    return (
        v == 'Delete,Read,Write' ? 7 :
            v == 'Delete,Write' ? 6 :
                v == 'Delete,Read' ? 5 :
                    v == 'Delete' ? 4 :
                        v == 'Read,Write' ? 3 :
                            v == 'Write' ? 2 :
                                v == 'Read' ? 1 : 0
    )
}
let getMenuFromFeature = (v: any) => {
    switch (v) {
        case 'Scheduled': return 'Planlagt';
        case 'Created': return 'Overført';
        case 'Unbundled': return 'Opsplittet';
        case 'Excluded': return 'Slettet';
        case 'Hierarchy': return 'Communities';
        case 'Enrollment': return 'Sammenkobling';
        case 'Courses': return 'Manuelle kurser';
        case 'Merged': return 'Samlekurser';
        case 'Override': return 'Ændringer';
        case 'ExternalUser': return 'Eksterne brugere';
        case 'Users': return 'Administratorer';
        case 'SemesterCopy': return 'Kopiering';
        case 'Support': return 'Support';
        case 'Sandbox': return 'Sandbox';
        default: return v;
    }
}
let getIsWriteDisabled = (v: any) => {
    return ['Scheduled', 'Created', 'Sandbox', 'Support'].includes(v);
}
let getIsDeleteDisabled = (v: any) => {
    return ['Scheduled', 'Created', 'Sandbox', 'Support'].includes(v);
}

let AddFaculty = (props: any) =>
{
    let [visible, setVisible] = useState(false);

    let handleVisibleChange = visible =>
    {
        setVisible(visible)
    };

    function success()
    {
        setVisible(false);
        Modal.success({
            title: 'Tilføjet',
            content: 'Fakultet blev tilføjet til brugeren.',
        });
    }

    function error()
    {
        setVisible(false);
        Modal.error({
            title: 'Fejl',
            content: 'Fakultet kunne ikke tilføjes til brugeren. Prøv igen.',
        });
    }

    function onClick(value, main)
    {
        if (value) {
            new Post()
                .main(main)
                .target(() => `/api/users/${props.record._object.email}/faculty`)
                .header({ 'Faculty': helpers.facultyEnums(props.main.$params('faculty'), props.main) })
                .onThen(() => {
                    success()
                    props.model.refresh()
                })
                .onCatch(() => error())
                .submit();
        }
    }

    const content = () =>
    {
        let items: any = props.main.Store.faculty.filter(r => r.facultyCode.toLowerCase() === props.main.$params('faculty'));
        let children: any = items.map(r => {
            return <Select.Option key={r.facultyId} value={r.facultyId}>{ r.hierarchyName }</Select.Option>
        });

        return (
            <Space align={'start'} direction="vertical" size={12} style={{ maxWidth: 280, padding: 6 }}>
                <TypographyAnt.Text>Det valgte fakultet er styret af det fakultet du agerer på</TypographyAnt.Text>
                <Select
                    defaultValue={items[0]?.hierarchyName}
                    style={{ width: 264, marginTop: 6 }}
                    disabled={true}
                >
                    {children}
                </Select>
                <Button style={{ marginTop: 12 }} type="primary" onClick={(e: any) => {
                    onClick(items[0], props.main);
                    e.stopPropagation();
                }}>Tilføj</Button>
            </Space>
        );
    }

    return (
        <Space align={'end'}>
            <Popover placement="left" content={content} trigger="click" visible={visible} onVisibleChange={handleVisibleChange} style={{ maxWidth: 280 }}>
                <span style={{ marginLeft: 12, fontSize: 14, width: 36, opacity: 0.75 }}>
                    <Tooltip title={'Tilføj fakultet'}>
                        {
                            new Access(props.main)
                                .action(new Action().access({ feature: 'Users', level: 3 }), props.record)
                                .render((v) => <PlusOutlined { ...v }/>)
                                .configs({
                                    onClick: (e: any) => {
                                        setVisible(true);
                                        e.stopPropagation();
                                    }
                                })
                        }
                    </Tooltip>
                </span>
            </Popover>
        </Space>
    )
}

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
        const cycle: Cycle = main.$cycle(`/users/${faculty}`);
        const get: Get = main.$get(cycle, `/api/users/`);

        const text: string = 'Listen indeholder registerede administratorer.';

        const section = new Section();
        const users = new List()
            .get(() => get
                .main(main)
                .target(() => main.$user().isAdmin ? `/api/users/all` : `/api/users`)
                .header({ Faculty: helpers.facultyEnums(cycle.params('faculty'), main) })
            )
            .emptyText('')
            .emptyIcon(WarningOutlined)
            .emptyColumn(true)
            .bordered()
            .headerCreate(false)
            .headerPrepend(new ListHeader().key('firstName').title('Fornavn').searchable())
            .headerPrepend(new ListHeader().key('lastName').title('Efternavn').searchable())
            .headerPrepend(new ListHeader().key('email').title('Email').searchable())
            .actions(new Action().key('component').component(AddFaculty))
            .expandable((v: ListItem) => v._object.faculties.length && v._object.faculties.some(r => r.name.toLowerCase() === main.$params('faculty')))
            .expandableSection((record) => {
                let section = new Section();
                section.add(new List()
                    .default({ dataSource: record._object.faculties.filter(r => r.name.toLowerCase() === main.$params('faculty')) })
                    .footer(false)
                    .header(false)
                    .emptyText('')
                    .emptyIcon(WarningOutlined)
                    .headerCreate(false)
                    .headerPrepend(new ListHeader().key('name'))
                    .actions(new Action()
                        .key('deleteConfirm')
                        .access({ feature: 'Users', level: 7 })
                        .formula(new Formula(new Post()
                            .main(main)
                            .header({ 'Faculty': helpers.facultyEnums(main.$params('faculty'), main) })
                            .target(() => ({
                                method: 'DELETE',
                                target: `/api/users/${record._object.email}/faculty`,
                            }))
                            .onThen(() => users.refresh(cycle)))
                        ))
                    .expandable((v: ListItem) => v._object.permissions)
                    .expandableSection((subRecord) => {
                        let subSection = new Section();
                        subSection.add(new List()
                            .default({ dataSource: subRecord._object.permissions })
                            .addDummyColumn(true)
                            .emptyText('')
                            .emptyIcon(LoadingIcon)
                            .headerCreate(false)
                            .headerPrepend(new ListHeader()
                                .key('menuName')
                                .render((v: any, subSubRecord: any) => <span>{getMenuFromFeature(subSubRecord._object.feature)}</span>)
                            )
                            .headerPrepend(new ListHeader()
                                .key('menuKey')
                                .render((v: any, subSubRecord: any) => <span style={{ opacity: 0.5 }}>{subSubRecord._object.feature}</span>)
                            )
                            .headerPrepend(new ListHeader()
                                .key('permissionsCheckbox')
                                .render((v: any, subSubRecord: any) =>
                                {
                                    let checkbox = new Section().add(
                                        new Checkbox()
                                            .access({ feature: 'Users', level: 3 })
                                            .styleForm({ height: 22 })
                                            .default(getPermFromLevel(subSubRecord._object.level))
                                            .add(new Item('Read').title('Read').style({ width: 80 }))
                                            .add(new Item('Write')
                                                .title('Write')
                                                .style({ width: 80 })
                                                .access(true)
                                                .disabled(() => getIsWriteDisabled(subSubRecord._object.feature))
                                            )
                                            .add(new Item('Delete')
                                                .title('Delete')
                                                .style({ width: 80 })
                                                .access(true)
                                                .disabled(() => getIsDeleteDisabled(subSubRecord._object.feature))
                                            )
                                            .onChange((v: any, history: any) => {
                                                new Post()
                                                    .main(main)
                                                    .header({ 'Faculty': helpers.facultyEnums(main.$params('faculty'), main) })
                                                    .target(() => ({
                                                        target: `/api/users/${record._object.email}/set-permission`,
                                                        params: { feature: subSubRecord._object.feature, level: getLevelFromPerm(v) },
                                                    }))
                                                    .onThen(() => {
                                                        message.success('Ændringen er gemt')
                                                    })
                                                    .onCatch(() => {
                                                        checkbox.tsxHistoryRevert(history);
                                                    })
                                                    .submit();
                                            })
                                    )

                                    return (
                                        <Row justify={'end'} style={{ marginRight: 12 }}>
                                            <SectionComponent main={main} section={checkbox} />
                                        </Row>
                                    );
                            }))
                            .footer(false)
                            .header(false)
                        )
                        return subSection;
                    })
                );
                return section;
            })
            .actions(new Action()
                .key('deleteConfirm')
                .access({ feature: 'Users', level: 7 })
                .formula(new Formula(new Post()
                    .header({ 'Faculty': helpers.facultyEnums(faculty, main) })
                    .target(({ record }) => ({
                        method: 'DELETE',
                        target: `/api/users/${record._object.email}/faculty`,
                    }))
                    .onThen(() => {
                        message.success('Rækken blev slettet.')
                        users.refresh(cycle);
                    })
                    .onCatch(() => {
                        message.error('Rækken blev ikke slettet.')
                    }))
                ))

        section.style({ padding: '24px 36px' });
        section.add(new Title().label('Administratorer'));
        section.add(new Typography().label(text));
        section.add(users);

        this.setState({ section: section, faculty: faculty });
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