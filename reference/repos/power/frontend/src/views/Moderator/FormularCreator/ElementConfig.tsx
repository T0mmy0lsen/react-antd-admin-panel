
import {
    Section,
    Title,
    Space,
    Get,
    List,
    ListHeader,
    Autocomplete,
    Button,
    Select,
    Action,
    Post,
    Typography, Input, Formula, ItemValue, Main
} from "../../../typescript";
import { Collapse, message } from "antd";
import SectionComponent from "../../../components/Section";
import { addCondition } from "../../../helpers";
import {
    IArea,
    IConfigs, IFormularCreatorElementConfigsInput, IFormularCreatorElements,
    IRole,
    IValueOption, IValueSetsHeader
} from "../../../classes";

const configSectionConfiguration = (v, main: Main, get: Get, element: IFormularCreatorElements) =>
{
    return (next) => {

        const section = new Section();

        // The Get for Values
        let elementConfig = new Get()
            .target(() => ({
                target: '/api/configsForElements',
                params: { id: element.id, class: element.class }
            }))
            .onThen(() => {
                listWithConditionsCondition.checkCondition(true)
            })

        let elementConfigFormular = new Formula(new Post()
            .main(main)
            .target(() => ({
                target: '/api/configsForElementsSave',
            }))
            .onThen(() => {
                main.$modalLoading(false);
                main.$modalClose();
            })
            .onCatch(() => {
                main.$modalLoading(false);
                main.$modalClose();
            })
        )

        elementConfig.get()

        // This gets called when the Condition is meet.
        let sectionWithElementConfig = () =>
        {
            let section = new Section()

            section.style({ padding: 16 })
            section.formula(elementConfigFormular);

            elementConfig._data?.forEach((e: IConfigs) => {
                switch (e.config) {
                    case 'filterByOtherInput':
                        handleFilterByOtherInput(e, element, get._data.elements, section, elementConfigFormular)
                        break;
                    default:
                        handleInputFields(e, element, section, elementConfigFormular)
                        break;
                }
            })

            section.add(new Button().action(new Action().label('Gem').callback(() => {
                elementConfigFormular.submit()
            })));

            return section
        }

        let listWithConditionsCondition = addCondition(sectionWithElementConfig, elementConfigFormular);

        section.add(listWithConditionsCondition)
        section.formula(elementConfigFormular)
        section.init()
        next(section)
    }
}

const handleInputFields = (
    e: IConfigs,
    element: IFormularCreatorElements,
    section: Section,
    form: Formula,
) => {

    let input = e.inputs[0].related_input as IFormularCreatorElementConfigsInput

    switch (e.inputs[0].input_class.class) {
        case 'List':
            section.add(new Typography()
                .label(e.name)
                .style({opacity: 0.9})
            )
            section.add(new Typography()
                .label(e.description)
                .style({opacity: 0.6, marginTop: -16})
            )
            section.add(
                new Select()
                    .key(e.id)
                    .label(e.name)
                    .default(input?.value)
                    .addMore(e.inputs[0].input_value_set.collection.map((v: IValueOption) => v))
                    .addMoreOverwriteItems((v: ItemValue) => {
                        v.getFormsValue = () => ({
                            config_id: e.id,
                            config_input_id: e.inputs[0].id,
                            value: v.getId(),
                            value_id: input?.value.id,
                            value_set_type: e.inputs[0].input_value_set.type,
                            value_set_id: e.inputs[0].input_value_set.id,
                            formular_creator_element_id: element.id,
                        })
                    })
            )
            break;
        default:
            section.add(
                new Input()
                    .key(e.id)
                    .label(e.name)
                    .default(input?.value)
            )
            break;
    }
}

const handleFilterByOtherInput = (
    e: IConfigs,
    element: IFormularCreatorElements,
    elements: IFormularCreatorElements[],
    section: Section,
    form: Formula,
) => {

    let inputs = e.inputs
    let input = inputs[0].related_input as IFormularCreatorElementConfigsInput

    switch (e.config) {
        case 'filterByOtherInput':

            // let filter: IElementFilterValue = input?.filter

            let headersFilterBy = new Get()
                .target(() => {
                    let element = elements.filter(e => e.id === filterBySelector.getId())?.[0];
                    let valueSetId = element?.value_set_id;
                    return ({
                        target: `/api/valueSetHeaders`,
                        params: {
                            'value_set_id': valueSetId,
                        }
                    })
                })
                .alter((v: IValueSetsHeader[]) => {
                    return v.map((h: IValueSetsHeader) => {
                        return ({
                            'id': h.id,
                            'value': h.key,
                        }) as IValueOption
                    })
                })
                .onThen(() => {
                    listWithHeadersFilterBy.addMore(headersFilterBy._data)
                    listWithHeadersFilterByCondition.checkCondition(true)
                })

            let headersTarget = new Get()
                .target(() => ({
                    target: `/api/valueSetHeaders`,
                    params: {
                        'value_set_id': element.value_set_id,
                    }
                }))
                .alter((v: IValueSetsHeader[]) => {
                    return v.map((h: IValueSetsHeader) => {
                        return ({
                            'id': h.id,
                            'value': h.key,
                        }) as IValueOption
                    })
                })
                .onThen(() => {
                    listWithHeadersTarget.addMore(headersTarget._data)
                    listWithTargetCondition.checkCondition(true)
                })

            let listWithHeadersFilterBy = new Select()
                    .get(() => headersFilterBy)
                    .label('Filter på')
                    .addMore(headersFilterBy._data)

            let listWithHeadersTarget = new Select()
                    .get(() => headersTarget)
                    .label('Match på')
                    .addMore(headersTarget._data)

            let listWithHeadersFilterByCondition = addCondition(listWithHeadersFilterBy, form);
            let listWithTargetCondition = addCondition(listWithHeadersTarget, form);

            let filterBySelector = new Select()
                .key(e.id)
                .label('')
                .onChange((s: ItemValue) => {
                    if (s && !!s.getValue()) {
                        headersFilterBy.get()
                        headersTarget.get()
                    }
                })
                .addMore(elements.map((e: IFormularCreatorElements) => {
                    return ({
                        id: e.id,
                        value: e.name,
                    }) as IValueOption
                }))
                .addMoreOverwriteItems((v: ItemValue) => {
                    v.getFormsValue = () => v.getId() ? ({
                        config_id: e.id,
                        config_input_id: inputs[0].id,
                        formular_creator_element_id: element.id,
                        filter_by_element_id: v.getId(),
                        filter_by_header_id: listWithHeadersFilterBy.getId(),
                        target_header_id: listWithHeadersTarget.getId(),
                        target_element_id: element.id,
                    }) : undefined
                })

            section.add(new Typography()
                .label(e.name)
                .style({ opacity: 0.9 })
            )
            section.add(new Typography()
                .label('Dette felt filtrerer på et andet felt. Angiv herunder hvilket, samt hvilke kolonner der skal sorteres på.')
                .style({ opacity: 0.6, marginTop: -16 })
            )
            section.add(new Typography()
                .label('Vælg et element som skal filtreres på.')
                .style({ opacity: 0.6 })
            )
            section.add(filterBySelector)
            section.add(new Typography()
                .label('Vælg en nøgle som der skal bruges til fitleret.')
                .style({ opacity: 0.6 })
            )
            section.add(listWithHeadersFilterByCondition)
            section.add(new Typography()
                .label('For elementet der konfigureres, hvilken nøgle skal matche den overstående.')
                .style({ opacity: 0.6 })
            )
            section.add(listWithTargetCondition)
    }
}

const configSectionAccessCreate = (
    v,
    main,
    listToUpdate
) => {

    const object = v.record._object;

    let dataRoles = new Get()
        .target(() => ({ target: '/api/roles' }))
        .onThen(() => condition.checkCondition(() => true))

    dataRoles.get()

    let autocompleteArea = new Autocomplete();
    let button = new Button();
    let selectRole = new Select();
    let autocompleteSearched = '';

    let sectionForAddAccess = () => new Section()
        .add(new Space().top(24))
        .add(selectRole
            .key('role_id')
            .label('Find en Role')
            .styleForm({ marginBottom: 8 })
            .sizeString('middle')
            .ignoreOnChange(true)
            .clearable(false)
            .addMore(dataRoles._data.map((r: IRole) => r)))
        .add(autocompleteArea
            .key('id')
            .label('Find et Area')
            .styleForm({ marginBottom: 8 })
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
                    values: v.map((a: IArea) => a),
                }))
            ))
        .add(button
            .style({ marginTop: 16 })
            .action(new Action()
                .callback(() => new Post()
                    .target(() => {
                        return ({
                            target: `/api/formularCreatorElementAccessCreate`,
                            params: {
                                formular_creator_id: object.formular_creator_id,
                                formular_creator_element_id: object.id,
                                area_id: autocompleteArea.getId(),
                                role_id: selectRole.getId()
                            }
                        })
                    })
                    .onThen(() => {
                        message.success('Rækken blev tilføjet.')
                        listToUpdate.refresh(() => {
                            listToUpdate.tsxSetExpandable(v);
                        });
                    })
                    .onCatch(() => {
                        message.error('Rækken blev ikke tilføjet.')
                    })
                    .submit())
                .hideClear()
                .label('Tilføj')
            ))

    let condition = addCondition(sectionForAddAccess, undefined)

    return condition
}

const configSectionAccess = (
    v,
    main
) => {

    return (next) =>
    {
        const object = v.record._object;
        const section = new Section();

        let access = new Get().target(() => ({
            target: '/api/formularCreatorElementAccess',
            params: { formular_creator_element_id: object.id }
        }))
            .onThen(() => {})
            .onCatch(() => {})

        let accessList = new List()
            .get(() => access)
            .emptyText('Ingen adgangskontrol')
            .footer(false)
            .addDummyColumn(true)
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

        accessList.refresh()

        let conditionAccessCreate = configSectionAccessCreate(v, main, accessList)

        section.style({ padding: '16px' })
        section.add(new Typography()
            .label('Listen indeholder de områder og roller, som har adgang til dette element.')
            .style({ opacity: 0.6 })
        )
        section.add(accessList);
        section.add(conditionAccessCreate);

        next(section)
    }
}

const configSectionMeta = (v, main, list) =>
{
    return (next) =>
    {
        const object = v.record._object;
        const section = new Section();

        const formular = new Formula(
            new Post()
                .target(() => ({
                    method: 'POST',
                    target: `/api/formularCreatorElementUpdateMeta`,
                }))
                .onThen(() => {
                    message.success('Det blev gemt!');
                })
                .onCatch(() => {
                    message.success('Det blev gemt!');
                    // message.error('Det blev ikke gemt!');
                })
        )

        section.style({ padding: '16px' })
        section.formula(formular)

        section.add(new Input().key('formular_creator_element_id').default(object.id).hidden())
        section.add(new Input().key('name').default(object.name))
        section.add(new Input().key('description').default(object.description))
        section.add(new Input().key('section').default(object.section))
        section.add(new Input().key('group').default(object.group))
        section.add(new Input().key('order').default(object.order))

        section.add(new Button().action(new Action().label('Gem').callback(() => {
            formular.submit()
            list.refresh()
        })));

        section.init()

        next(section)
    }
}

const configSection = (v, main: Main, list: List, get: Get) =>
{
    const element: IFormularCreatorElements = v.record._object;
    const section = new Section();

    // section.style({ padding: '0px 36px 48px 36px' });
    section.add(new Title().label(element.name).level(4));
    section.add(new Space().top(16));

    section.add(new Section().component(() => {
        return (
            <Collapse
                defaultActiveKey={[]}
                items={[
                    {
                        key: '1',
                        label: 'Meta',
                        children: <SectionComponent
                            main={main}
                            section={configSectionMeta(v, main, list)}
                            style={{ margin: '-16px' }}
                        />
                    },
                    {
                        key: '2',
                        label: 'Adgangskontrol',
                        children: <SectionComponent
                            main={main}
                            section={configSectionAccess(v, main)}
                            style={{ margin: '-16px' }}
                        />
                    },
                    {
                        key: '3',
                        label: 'Konfiguration',
                        children: <SectionComponent
                            main={main}
                            section={configSectionConfiguration(v, main, get, element)}
                            style={{ margin: '-16px' }}
                        />
                    },
                ]}
            />
        )
    }))

    section.add(new Space().top(24))
    section.add(new Section().addRowEnd([
        new Button()
            .link()
            .danger()
            .action(new Action()
                .label('Slet')
                .callback(() => {
                    new Post()
                        .target(() => ({
                            target: `/api/formularCreatorElementDelete`,
                            params: { formular_creator_element_id: element.id }
                        }))
                        .onThen(() => {
                            message.success('Elementet blev slettet.')
                            list.refresh();
                        })
                        .onCatch(() => {
                            message.error('Elementet blev ikke slettet.')
                        })
                        .submit()
                })
            )
    ]))
    section.add(new Space().top(24))

    return section
}

export default configSection;