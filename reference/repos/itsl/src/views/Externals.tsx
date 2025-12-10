import React from "react";

import { SectionComponent } from "react-antd-admin-panel";
import { Main } from "react-antd-admin-panel";
import {
    Typography,
    ListHeader,
    StepsItem,
    Section,
    Action,
    Button,
    Result,
    Upload,
    Steps,
    Title,
    List,
    Get,
    Select,
    Radio,
    Space,
    Conditions,
    ConditionsItem,
    Autocomplete,
    Post,
    Formula,
    Checkbox, Item, DatePicker, ListItem
} from "react-antd-admin-panel";
import {
    CheckCircleTwoTone,
    CloseCircleTwoTone,
    CloseOutlined,
    DownloadOutlined,
    FileExcelOutlined,
    SyncOutlined,
    UserAddOutlined, WarningOutlined
} from "@ant-design/icons/lib"
import {Breadcrumb, message, Tooltip, Typography as TypographyAnt } from "antd";
import axios from "axios";
import helpers from "../helpers";
import moment from "moment";

export default class Users extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            section: false,
            faculty: false,
        }
    }

    sectionTemplate(page: any)
    {
        let textTemplate: any = () => {
            return (
                <>
                    For at kunne importerer studerende til kurser skal man uploade en excel-fil ud fra den angiven skabelon.
                    Tryk på download herunder for at hente skabelonen.
                </>
            )
        }

        page.template.section.add(new Typography().label(textTemplate()))
            .add(new Button()
                .icon(DownloadOutlined)
                .sizeString('middle')
                .loadable(false)
                .action(new Action()
                    .type('callback')
                    .label('Download template')
                    .callback(() => {
                        fetch('/files/User-Template.xlsx')
                            .then(resp => resp.blob())
                            .then(blob => {
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.style.display = 'none';
                                a.href = url;
                                a.download = 'User-Template.xlsx';
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                            })
                            .catch(() => {});
                    })
                ))
            .add(new Space().top(16))
    }

    sectionReview(page: any)
    {
        let listHeader = new ListHeader()
            .key('errorIndicator')
            .title('')
            .width('70px')
            .render((v, record) => {
                let errors = '';
                if (record.errors) record.errors.forEach(r => errors += `${r} `);
                if (
                    page.courses.radio._defaultObject.value === '1' &&
                    page.courses.checkbox._default.length === 0 &&
                    record.groups.some(r => r.state !== 'Creatable')) errors += ' Expand record for more info.';
                if (errors.length) {
                    return (<Tooltip title={errors}><CloseCircleTwoTone style={{ paddingRight: 8 }} twoToneColor={'#F44336'} /></Tooltip>);
                } else {
                    return (<CheckCircleTwoTone style={{ paddingRight: 8 }} twoToneColor={'#4CAF50'} />);
                }

            })

        let listHeaderExists = new ListHeader()
            .key('existsIndicator')
            .title('')
            .width('70px')
            .render((v, record) => {
                if (record.email?.includes('sdu.dk')) {
                    return (<Tooltip title={'Oprettes ikke'}><WarningOutlined style={{ paddingRight: 8, opacity: 0.75 }} /></Tooltip>);
                } else if (record.exists === false) {
                    return (<Tooltip title={'Ny bruger'}><UserAddOutlined style={{ paddingRight: 8, opacity: 0.75 }} /></Tooltip>);
                } else {
                    return (<UserAddOutlined style={{ paddingRight: 8, opacity: 0 }} />);
                }
            })

        let listHeaderExpand = new ListHeader()
            .key('errorIndicator')
            .title('')
            .width('70px')
            .render((value, record) => {
                if (record.state !== 'Creatable') {
                    return (<Tooltip title={'Kurset findes ikke'}><CloseCircleTwoTone style={{ paddingRight: 8 }} twoToneColor={'#F44336'} /></Tooltip>)
                } else {
                    return (<CheckCircleTwoTone style={{ paddingRight: 8 }} twoToneColor={'#4CAF50'} />);
                }
            })

        let listExpandableSection = (record) => {
            let section = new Section();
            section.style({ paddingLeft: 1 })
            section.add(new List()
                .default({ dataSource: record.groups })
                .emptyText('')
                .emptyIcon(WarningOutlined)
                .emptyColumn(true)
                .header(false)
                .footer(false)
                .headerCreate(false)
                .headerPrepend(listHeaderExists)
                .headerPrepend(listHeaderExpand)
                .headerPrepend(new ListHeader().key('name').width('100%').editable())
                .actions(new Action().key('delete'))
                .onRecordWasEdited(() => page.steps.done(5, false))
            )
            return section;
        }

        page.review.list
            .get(() => page.get)
            .default([])
            .style({ paddingTop: 18, paddingBottom: 24 })
            .emptyText('Afventer uploaded xlxs-fil')
            .emptyIcon(FileExcelOutlined)
            .emptyColumn(true)
            .headerCreate(false)
            .headerPrepend(listHeader)
            .headerPrepend(listHeaderExists)
            .headerPrepend(new ListHeader().key('firstname').width('20%').title('Fornavn').editable())
            .headerPrepend(new ListHeader().key('lastname').width('20%').title('Efternavn').editable())
            .headerPrepend(new ListHeader().key('email').width('30%').title('Email').editable())
            .appends({ key: 'creatable', value: (record) => !(record.errors.length || !record.groups.every(r => r.state === 'Creatable'))})
            .actions(new Action().key('delete'))
            .onRecordWasEdited(() => page.steps.done(5, false))
            .expandableSectionActive(() => !(page.courses.checkbox._default.length || page.courses.radio._default === 2))
            .expandableSection(listExpandableSection)
            .expandable((v: ListItem) => {
                if (page.courses.checkbox._default.length || page.courses.radio._default === 2) return false;
                return !!v._object.groups.length;
            })

        page.review.list.headerPrepend(new ListHeader().width('15%').key('password').title('Kode').render((v) => {
            if (page.user.select._defaultObject.value === 'EXTERNALSTUDENTS') return <span style={{ opacity: 0.6, paddingLeft: 6 }}>Oprettes automatisk</span>
            return <span style={{ paddingLeft: 6 }}>{v}</span>
        }))

        page.review.list.headerPrepend(new ListHeader().width('15%').key('expireAt').title('Udløber').render((v) => {
            return <span style={{ opacity: 0.6 }} >{v ? v.substring(0,10) : ''}</span>
        }))

        let text: string = 'Listen skal verificeres og rettes for fejl. Tryk på verificer for at tjekke listen.'

        page.review.button.icon(SyncOutlined)
            .middle()
            .action(new Action()
                .label('Verificer')
                .callback(() => {
                    axios({
                        method: 'post',
                        url: '/api/external-users/inspect',
                        data: page.review.list.getRecords()
                            .filter(r => !page.review.list.getDeletedKeys().includes(r.key))
                            .map(r => {

                                let groups;
                                let onlyCreateUsers = page.courses.checkbox._default.length;
                                let useCoursesFromExcel = page.courses.radio._defaultObject.value === '1';

                                if (onlyCreateUsers) {
                                    groups = [];
                                } else if (useCoursesFromExcel) {
                                    let groupList = r.getList();
                                    let groupListRecords = r.getListRecords();
                                    if (groupList._componentIsBuild) {
                                        groups = groupListRecords.filter(r => !groupList.getDeletedKeys().includes(r.key)).map(g => g.name);
                                    } else {
                                        groups = groupListRecords.map(g => g.name);
                                    }
                                } else {
                                    groups = page.courses.list.getRecords()?.map((r: any) => r.synckey) ?? [];
                                }

                                return ({
                                    firstname: r.firstname,
                                    lastname: r.lastname,
                                    password: r.password,
                                    expireat: r.expireAt,
                                    groups: groups,
                                    email: r.email
                                });
                            }),
                        headers: { 'Content-Type': 'application/json', 'Faculty': helpers.facultyEnums(page.faculty, page.main) },
                    })
                        .then((r) => {
                            page.review.list.clearDeletedKeys();
                            page.review.list.refreshWithoutGetCall(r);
                            if (
                                page.review.list.getRecords().every(r => !r.errors.length &&
                                    r.groups.every(g => g.state === 'Creatable'))
                            ) {
                                page.steps.done(5);
                            }
                            page.review.button.tsxSetLoading(false);
                        })
                        .catch(() => {
                            page.review.button.tsxSetLoading(false);
                        });
                })
            )

        page.review.section.style({ paddingTop: 18 })
        page.review.section.add(new Typography().label(text))
        page.review.section.add(new Section().row().start().add(page.review.button))
        page.review.section.add(page.review.list);
    }

    sectionCourses(page: any)
    {
        page.courses.list
            .key('courses')
            .actions(new Action().icon(CloseOutlined).callback(({ record }: any) => page.courses.list.removeRecord(record)))
            .emptyText('')
            .emptyIcon(WarningOutlined)
            .emptyColumn(true)
            .headerCreate(false)
            .headerPrepend(new ListHeader().key('name').title('Navn'))
            .headerPrepend(new ListHeader().key('path').title('').render((v: any) => {
                return (v) ? (<Breadcrumb>
                    { v.map((r: any, i: number) => <Breadcrumb.Item key={i}>{r}</Breadcrumb.Item>) }
                </Breadcrumb>) : ''
            }))
            .headerPrepend(new ListHeader().key('synckey').title('Synckey'))

        page.courses.radio
            .default(page.courses.radio._defaultObject?.value ?? '1')
            .add(new Item(1).render(() => <span style={{ marginLeft: 4 }}>Nej, de er angivet i excel-filen</span>))
            .add(new Item(2).render(() => <span style={{ marginLeft: 4 }}>Ja, de skal angives her</span>))
            .onChange((value: any) => {
                condition.checkCondition({ checkbox: page.courses.checkbox._default, radio: value })
            })

        page.courses.checkbox
            .default([])
            .add(new Item(1).render(() => <span style={{ marginLeft: 4 }}><strong>Der skal kun oprettes brugerer</strong></span>))
            .onChange((value: any) => {
                page.courses.radio.tsxSetDisabled(!!value?.length);
                condition.checkCondition({ checkbox: value, radio: page.courses.radio._defaultObject });
            })

        let autocomplete = new Autocomplete()
            .key('autocomplete')
            .label('Søg her ...')
            .get(() => new Get()
                .main(page.main)
                .header({ 'Faculty': helpers.facultyEnums(page.faculty, page.main) })
                .target((args) => ({ target: `/api/external-users/typeahead`, params: { query: args, take: 10 }}))
                .alter((v: any) => {
                    // TODO: The original data is not passed trough here on rebuild.
                    if (v.length) return v;
                    return [
                        // courseResults
                        ...v.courseResults?.map((r: any) => {
                            return new Item(r.synckey).object(r).title(r.name).text(r.synckey)
                        }),
                        // hierarchyResults
                        ...v.hierarchyResults?.map((r: any) => {
                            return new Item(r.synckey).object(r).render((v: any) => {
                                return (
                                    <TypographyAnt>
                                        <Breadcrumb>
                                            {v.path.map((r: any, i: number) => <Breadcrumb.Item key={i}>{r}</Breadcrumb.Item>)}
                                        </Breadcrumb>
                                    </TypographyAnt>
                                )
                            })
                        })
                    ]
                })
            )
            .onChange((object: any) => {
                if (object.value) {
                    page.courses.list.setRecord(object.object.object);
                    autocomplete.onHandleClear();
                }
            })

        let condition = new Conditions()
            .default(() => ({ checkbox: page.courses.checkbox._default, radio: page.courses.radio._defaultObject }))
            .add(new ConditionsItem()
                .condition((v: any) => {
                    // Any changes to this step should force the user to validate in step 5
                    page.steps.done(5, false);
                    page.steps.done(4, false);
                    page.upload.upload._fileWasUploaded = false;
                    page.courses.radio.tsxSetDisabled(!!v.checkbox.length);
                    return v.radio.value === '2' && !v.checkbox.length;
                })
                .content((next) => next(new Section()
                    .formula(new Formula(new Post().main(page.main)))
                    .add(new Space().top(24))
                    .add(autocomplete)
                    .add(page.courses.list)
                ))
            )

        let courseText =
            'Vælg hvorvidt kurser er angivet i excel-filen eller om de skal angives her.' +
            'Det er også muligt kun at importerer brugere. Her underlader man blot at angive nogen kurser.'

        page.courses.section.add(new Typography().label(courseText))
        page.courses.section.add(page.courses.checkbox)
        page.courses.section.add(page.courses.radio)
        page.courses.section.add(condition)
    }

    sectionUpload(page: any)
    {
        page.upload.upload
            .style({ marginBottom: 12 })
            .url(() => '/api/external-users/inspect-upload')
            .onThen((r) => {
                page.review.list.refreshWithoutGetCall(r);
                page.steps.done(4);
            })
            .onCatch(() => {})
            .default([])
            .header({ 'Faculty': helpers.facultyEnums(page.faculty, page.main) })
            .label('Upload')
            .fileType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            .onFileDeleted(() => {
                page.steps.done(4, false);
            })

        page.upload.section
            .add(new Typography().label('Tryk på knappen herunder for at vælge den excel-fil du ønsker at uploade'))
            .add(page.upload.upload)
    }

    sectionCreate(page: any)
    {
        let button = new Button()
            .middle()
            .primary()
            .action(new Action()
                .label('Godkend')
                .callback(() => {
                    axios({
                        method: 'post',
                        url: '/api/external-users/create',
                        data: page.review.list.getRecords().map(r => {
                            return ({
                                firstname: r.firstname,
                                lastname: r.lastname,
                                email: r.email,
                                password: r.password,
                                expireat: r.expireAt,
                                groups: r.groups.map(g => g.name)
                            })
                        }).filter(r => !!r),
                        headers: { 'Content-Type': 'application/json', 'Faculty': helpers.facultyEnums(page.faculty, page.main) },
                        params: {
                            year: page.user.datepicker._data?.substring(0,4) ?? 2000,
                            type: page.user.select._defaultObject.value,
                        }
                    })
                        .then((r) => {
                            page.review.list.refreshWithoutGetCall([]);
                            page.steps.goTo(0);
                            page.upload.upload.clearFiles();
                            button.tsxSetLoading(false);
                            message.success('Listen er importeret');
                        })
                        .catch((r) => {
                            button.tsxSetLoading(false);
                            message.error('Listen kunne ikke importeres');
                        });
                }));

        page.create.section = new Section()
            .add(new Result()
                .title('Godkend')
                .status('success')
                .subTitle('Når du trykker godkend vil den verificerede liste blive gemt')
                .add(new Section().row().center().add(button))
            )
    }

    sectionUser(page: any)
    {
        let condition = new Conditions();

        page.user.datepicker.default(moment().format('YYYY-MM-DD'))
            .clearable(false)
            .key('year')
            .picker('year');

        page.user.select.default({ value: page.user.select._data ?? 'EXTERNALSTUDENTS' })
            .clearable(false)
            .onChange((v: any) => condition.checkCondition(v.value))
            .addMore([
                new Item('EXTERNALSTUDENTS').title('Eksterne studerende'),
                new Item('UNITEST').title('Unitest brugere')
            ])

        condition.default(() => page.user.select._default).add(new ConditionsItem()
            .condition((v) => v === 'UNITEST')
            .content((next) => {
                next(new Section()
                    .add(new Typography().label('Til hvilket år skal Unitest-brugeren oprettes?'))
                    .add(page.user.datepicker)
                    .add(new Space().top(12))
                )
            })
        )

        page.user.section.add(new Typography().label('Vælg den type bruger som ønskes oprettet.'))
        page.user.section.add(page.user.select)
        page.user.section.add(condition)
    }

    sectionSteps(faculty: string, main: Main)
    {
        const page = {
            get: new Get().main(main),
            main: main,
            steps: new Steps(),
            faculty: faculty,
            user: { section: new Section, select: new Select(), datepicker: new DatePicker() },
            upload: { section: new Section(), upload: new Upload() },
            create: { section: new Section(), button: new Button() },
            review: { section: new Section(), button: new Button(), list: new List() },
            courses: { section: new Section(), checkbox: new Checkbox(), radio: new Radio(), list: new List() },
            template: { section: new Section },
        }

        this.sectionUser(page);
        this.sectionReview(page);
        this.sectionUpload(page);
        this.sectionCreate(page);
        this.sectionCourses(page);
        this.sectionTemplate(page);

        page.steps
            .add(new StepsItem()
                .title('Skabelon')
                .content((next) => next(page.template.section))
            )
            .add(new StepsItem()
                .title('Bruger')
                .content((next) => next(page.user.section))
            )
            .add(new StepsItem()
                .title('Kurser')
                .content((next) => next(page.courses.section))
            )
            .add(new StepsItem()
                .done(false)
                .title('Upload')
                .content((next) => next(page.upload.section))
            )
            .add(new StepsItem()
                .done(false)
                .title('Verificer')
                .content((next) => next(page.review.section))
            )
            .add(new StepsItem()
                .title('Afslut')
                .content((next) => next(page.create.section))
            )

        return page.steps;
    }

    build() {
        const main: Main = this.props.main;
        const faculty: string = main.$params('faculty');
        const section: Section = new Section();

        section.style({ padding: '24px 36px' });
        section.add(new Title().label('Brugere').level(1).style({ paddingBottom: 16 }));
        section.add(this.sectionSteps(faculty, main));

        this.setState({ section: section, faculty: faculty });
    }

    render() {
        return (
            <>{!!this.state.section &&
            <SectionComponent main={this.props.main} section={this.state.section}/>}</>
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