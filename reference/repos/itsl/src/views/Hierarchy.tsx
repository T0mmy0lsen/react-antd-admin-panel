import React from "react";
import {
    Autocomplete,
    Typography,
    Checkbox,
    Formula,
    Section,
    Button,
    Action,
    Input,
    Cycle,
    Space,
    Title,
    Tree,
    List,
    Post,
    Get, CheckboxItem, Item, ListHeader, TreeItem
} from "react-antd-admin-panel";
import { SectionComponent } from "react-antd-admin-panel";
import { Main } from "react-antd-admin-panel";
import {message, Row} from "antd";
import {
    PlusOutlined, EditOutlined, CopyrightTwoTone
} from "@ant-design/icons/lib";
import helpers from "../helpers";

export default class Created extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            section: false,
            faculty: false,
        }
    }

    edit(item: TreeItem, next: (Section) => void, main: Main, tree: Tree)
    {
        let section = new Section();
        let faculty = main.$params('faculty');

        let modalCommunity = (item: TreeItem, value: any, next: (value) => void, main: Main, tree: Tree) =>
        {
            return ({
                title: 'Er du sikker?',
                label: 'Når du sætter følgende kan det kun ændres tilbage af en adminstrator.',
                visible: true,
                section: false,
                handleCancel: () => main.$modalClose(),
                handleOk: () => {
                    main.$modalLoading(true);

                    let formula = new Formula(new Post()
                        .main(main)
                        .header({ 'Faculty': helpers.facultyEnums(faculty, main) })
                        .target(() => ({
                            target: `/api/hierarchy/${item.key}/set-community`,
                            params: { community: true },
                        }))
                        .onThen(() => {
                            tree.reloadLocal(item);
                            main.$modalLoading(false);
                            main.$modalClose();
                        })
                        .onCatch(() => {
                            main.$modalLoading(false);
                            main.$modalClose();
                        })
                    )

                    formula.submit();
                }
            })
        }

        let modalTitle = (item: TreeItem, main: Main) =>
        {
            let section = new Section();

            let data = item._object.community ?? item._object;

            section
                .add(new Typography().label('Title'))
                .add(new Input()
                    .key('title')
                    .label('')
                    .style({ width: '100%' })
                    .default(data.title)
                    .autofocus()
                    .onPressEnter(() => {
                        main.$modalLoading(true);
                        section._formula.submit();
                    })
                )
                .add(new Space().top(12))
                .formula(new Formula(new Post()
                    .main(main)
                    .header({ 'Faculty': helpers.facultyEnums(faculty, main) })
                    .target(() => ({
                        method: 'POST',
                        target: `/api/hierarchy/${data.synckey}/rename`,
                    }))
                    .onThen(() => {
                        message.success('Ændringen er gemt');
                        tree.reloadLocal(item);
                        main.$modalLoading(false);
                        main.$modalClose();
                    })
                    .onCatch(() => {
                        message.error('Ændringen kunne ikke gemmes');
                        main.$modalLoading(false);
                        main.$modalClose();
                    })
                ))
                .init();

            return ({
                title: 'Ændre en titel',
                label: '',
                visible: true,
                section: section,
                handleCancel: () => {
                    main.$modalClose()
                },
                handleOk: () => {
                    main.$modalLoading(true);
                    section._formula.submit();
                }
            })
        }

        let modalNodes = (record: TreeItem,  main: Main) =>
        {
            let section = new Section();

            section
                .add(new Typography().label('Title'))
                .add(new Section().row().between()
                    .add(new Input()
                        .key('title')
                        .label('')
                        .autofocus()
                        .onPressEnter(() => {
                            main.$modalLoading(true);
                            section._formula.submit();
                        }))
                )
                .add(new Space().top(12))
                .formula(new Formula(new Post()
                    .main(main)
                    .header({ 'Faculty': helpers.facultyEnums(faculty, main) })
                    .target(() => ({
                        method: 'POST',
                        target: `/api/hierarchy/${item.key}/children`,
                    }))
                    .onThen(() => {
                        message.success('Underliggende community er blevet tilføjet');
                        tree.reloadLocal(item);
                        main.$modalLoading(false);
                        main.$modalClose();
                    })
                    .onCatch(() => {
                        message.error('Underliggende community er blevet ikke tilføjet');
                        main.$modalLoading(false);
                        main.$modalClose();
                    })
                ))
                .init();

            return ({
                title: 'Opret ny node',
                label: '',
                visible: true,
                section: section,
                handleCancel: () => {
                    main.$modalClose()
                },
                handleOk: () => {
                    main.$modalLoading(true);
                    section._formula.submit();
                }
            })
        }

        let listNodes = () =>
        {
            return new List()
                .get(() => new Get()
                    .main(main)
                    .header({ 'Faculty': helpers.facultyEnums(faculty, main) })
                    .target(`/api/hierarchy/${item.key}/children`)
                    .fail([])
                )
                .footer(false)
                .emptyIcon(PlusOutlined)
                .emptyText('Tryk på \'tilføj\' herover for at tilføje et underliggende community')
                .emptyColumn(true)
                .headerCreate(false)
                .headerPrepend(new ListHeader().key('title'))
                .actions(new Action()
                    .key('deleteConfirm')
                    .access({ feature: 'Hierarchy', level: 7 })
                    .formula(new Formula(new Post()
                        .main(main)
                        .header({ 'Faculty': helpers.facultyEnums(faculty, main) })
                        .target((args) => ({
                            method: 'DELETE',
                            target: `/api/hierarchy/${args.record.synckey}`,
                        }))
                        .onThen((r, args) => {
                            message.success('Underliggende community er blevet fjernet');
                            tree.reloadLocal(item);
                        })
                        .onCatch(() => {
                            message.error('Underliggende community blev ikke fjernet');
                        }))
                    ))
                .refresh()
        }

        let listGroups = () =>
        {
            let key = item._object.community?.synckey ?? item.key;
            return new List()
                .get(() => new Get()
                    .main(main)
                    .header({ 'Faculty': helpers.facultyEnums(faculty, main) })
                    .target(() => `/api/hierarchy/${key}/groups`)
                    .fail([])
                )
                .emptyIcon(PlusOutlined)
                .emptyText('Brug overstående søgefelt til at finde en STADS-gruppe')
                .emptyColumn(true)
                .footer(false)
                .headerCreate(false)
                .headerPrepend(new ListHeader().key('stadsGroup'))
                .actions(new Action()
                    .key('deleteConfirm')
                    .access({ feature: 'Hierarchy', level: 7 })
                    .formula(new Formula(new Post()
                        .main(main)
                        .header({ 'Faculty': helpers.facultyEnums(faculty, main) })
                        .target((args) => ({
                            method: 'DELETE',
                            target: `/api/hierarchy/${key}/groups`,
                            params: args.record,
                        }))
                        .onThen(() => {
                            message.success('STADS-gruppen er blevet fjernet');
                            groups.refresh();
                        })
                        .onCatch(() => {
                            message.error('STADS-gruppen blev ikke fjernet');
                        })
                )))
                .refresh();
        }

        let nodes = listNodes();
        let groups = listGroups();

        let sectionGroups = () =>
        {
            return new Section()
                .add(new Section().add(new Title().label('Tilføj STADS-gruppe').level(5)))
                .add(new Section().add(new Space().top(4)))
                .add(new Section().add(new Autocomplete()
                    .key('groups')
                    .access({ feature: 'Hierarchy', level: 3 })
                    .get(() => new Get()
                        .main(main)
                        .header({ 'Faculty': helpers.facultyEnums(faculty, main) })
                        .target((args) => ({ target: `/api/stap/groups/search`, params: { q: args }}))
                        .alter((v: any) => v.map((r: any) =>
                            new Item(r.studGruppeId).id(r.studGruppeId).title(r.kode).text(r.studGruppeId)
                        ))
                    )
                    .label('Find STADS-gruppe')
                    .onChange((object) => {
                        if (!object.value) return;
                        let key = item._object.community?.synckey ?? item._object.synckey;
                        let formula = new Formula(new Post()
                            .main(main)
                            .header({ 'Faculty': helpers.facultyEnums(faculty, main) })
                            .target(() => ({
                                method: 'POST',
                                target: `/api/hierarchy/${key}/groups`,
                                params: { stadsGroup: object.value },
                            }))
                            .onThen(() => {
                                message.success('STADS-gruppen er blevet tilføjet');
                                groups.refresh();
                            })
                            .onCatch(() => {
                                message.error('STADS-gruppen kunne ikke tilføjes');
                            })
                        )
                        formula.submit();
                    }))
                )
                .add(groups)
        }

        let sectionNodes = () =>
        {
            return new Section()
                .add(new Section().add(new Space().top(24)))
                .add(new Section().add(new Title().label('Underliggende Communities').level(5)))
                .add(new Section().row().end().add(new Button()
                    .access({ feature: 'Hierarchy', level: 3 })
                    .loadable(false)
                    .action(new Action()
                        .type('callback')
                        .icon(PlusOutlined)
                        .label('Opret')
                        .callback(() => {
                            main.$modal(modalNodes(item, main))
                        })
                    )))
                .add(new Space().top(12))
                .add(nodes);
        }

        section
            .get(() => new Get()
                .main(main)
                .header({ 'Faculty': helpers.facultyEnums(faculty, main) })
                .target(`/api/hierarchy/${item.key}`)
                .onThen(() => next(section)))
            .add(new Space().top(8))
            .add(new Title().label('Indstillinger').level(3))
            .add(new Title().label('Titel').level(5))
            .add(new Input()
                .readOnly(true)
                .label('Titel')
                .default(item._object.community?.title ?? item._label)
                .suffix(new Section().add(new Button()
                    .link()
                    .small()
                    .icon(EditOutlined)
                    .loadable(false)
                    .disabled(false)
                    .access({ feature: 'Hierarchy', level: 3 })
                    .action(new Action()
                        .type('callback')
                        .callback(() => main.$modal(modalTitle(item, main)))
                    )))
            )
            .add(new Title().label('Synckey').level(5))
            .add(new Input()
                .readOnly(true)
                .label('Synckey')
                .default(item._object.community?.synckey ?? item.key)
                .suffix(new Section().add(new Button()
                    .link()
                    .small()
                    .icon(EditOutlined)
                    .disabled(true)
                ))
            )
            .add(new Title().label('Community').level(5))
            .add(new Checkbox()
                .access({ feature: 'Hierarchy', level: 3 })
                .add(new CheckboxItem().key('1').label('Opret også et Community-course i itslearning').value(1))
                .default([item._object.community ? 1 : 0])
                .disabled(item._object.community)
                .onChangeNext((value, next) => {
                    main.$modal(modalCommunity(item, value, next, main, tree));
                })
            )
            .add(sectionGroups())
            .add(sectionNodes())
            .add(new Space().top(36))
            .formula(new Formula(new Post()))
            .init();

        section.refresh();
    }

    build() {

        const main: Main = this.props.main;
        const faculty: string = main.$params('faculty') ?? 'tek';
        const cycle: Cycle = main.$cycle(`/hierarchy/${faculty}`);
        const get: Get = main.$get(cycle, `/api/hierarchy`);

        const section = new Section();
        const tree = new Tree()
            .default(new TreeItem(get._data?.[0]).index(get._data?.[0].synckey).label(get._data?.[0].title))
            .edit(this.edit)
            .getOnChild(() => new Get()
                .main(main)
                .header({ 'Faculty': helpers.facultyEnums(faculty, main) })
                .target((t: TreeItem) => `/api/hierarchy/${t.key}/children`)
                .alter(data => data.filter(r => r.groupTypeId !== 2).map((r: any) => {
                    return new TreeItem(r)
                        .id(r.synckey)
                        .label(r.title)
                        .render(() => r.community
                            ? (
                                <Row>
                                    <CopyrightTwoTone style={{ fontSize: 14, paddingTop: 5, paddingRight: 5, paddingLeft: 1 }}/>
                                    <div>
                                        {r.community.title}
                                    </div>
                                </Row>
                            ) : (
                                <div>{r.title}</div>
                            ))
                }))
            )

        section.style({ padding: '24px 36px' });
        section.add(new Title().label('Communities').level(1))
        section.add(tree)

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