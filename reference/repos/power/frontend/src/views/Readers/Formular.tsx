import React from "react";

import {
    Section,
    Title,
    Get, Main,
    Conditions, ConditionsItem, Input, Select, Typography, Cycle, SelectItem, Space, ItemValue
} from './../../typescript/index';

import SectionComponent from './../../components/Section';
import {Action, Button, Formula, Post, Selection} from "./../../typescript/index";
import {Col, Divider, Row, message} from "antd";
import {
    IElementFilterValue,
    IFormular,
    IFormularCreatorConfigs,
    IFormularCreatorElementConditionValue,
    IFormularCreatorElementConfigs,
    IFormularCreatorElements,
    IFormularValue,
    ITransform, IValue, IValueOption, IValueOptionFields
} from "../../classes";
import {
    Selections,
    List,
    ListHeader,
    Autocomplete,
    Steps,
    StepsItem
} from "../../typescript";
import {ArrowRightOutlined} from "@ant-design/icons";
import {addCondition, createAndOpenFormular, findByKey, getSortedElements} from "../../helpers";

export default class Formular extends React.Component<any, any> {

    elements: any;
    saveButtons: any;

    constructor({ props }: { props: any })
    {
        super(props);

        this.elements = {};
        this.saveButtons = [];

        this.state = {
            section: false,
            condition: {},
            filter: {},
        };

        this.setFilter = this.setFilter.bind(this);
        this.setCondition = this.setCondition.bind(this);
        this.checkConditionValue = this.checkConditionValue.bind(this);
        this.checkConditionValues = this.checkConditionValues.bind(this);
    }

    // -------------------------------------------------------------------------------------------------------------

    setFilter(d: IFormularCreatorElements, filter: IElementFilterValue) {
    // There may be multiple triggers on the same element.
    // E.g. there is two department lists, which both should be filtered by the same user list.
    this.setState(prevState => ({
        ...prevState,
        filter: {
            ...prevState.filter,
            // If there is already a filter on the element, we should add the new filter to the list.
            [filter.filter_by_element_id]: prevState.filter[filter.filter_by_element_id]
                ? [...prevState.filter[filter.filter_by_element_id], filter]
                : [filter]
            }
        }));
    }

    checkFiltersForInitialFields(d: IFormularCreatorElements, valueOptions: IValueOption[], formularData: Get): IValueOption[]
    {
        let filter: IFormularCreatorElementConfigs = d.configs.filter((r: IFormularCreatorElementConfigs) => r.config.config === 'filterByOtherInput')?.[0]

        if (!filter) {
            return valueOptions
        }

        let filterValue: IElementFilterValue = filter.inputs[0].filter

        // We should check if formularValues has a value for the filter_by_element_id
        let formularValues: IFormularValue[] = formularData._data.formular_values
        let formularValue: IFormularValue = formularValues.filter((v: IFormularValue) => v.formular_creator_element_id === filterValue.filter_by_element_id)[0]

        // Next we get the value we should match on. This will likely be the label or id of "Department"
        let targetHeader = filterValue.target_header.key

        // Let's get the list of "Departments" in its _fields.
        let targetFields: IValueOption[] = valueOptions

        let currentSelectedValueHeader = formularValue.value.value_option.fields.filter((v: IValueOptionFields) => v.key === filterValue.filter_by_header.key)[0]

        if (!currentSelectedValueHeader) {
            return targetFields
        }

        return targetFields.filter((v: IValueOption) =>
        {
            // Let's get the fields of the department where the key is the same as the targetHeader.
            // E.g. a department has a field with key "label" and value "Aalborg".
            // The targetHeader is the field of the "Brugere" value that we should match with.
            // E.g. a user has a field with key "department" and value "Aalborg".
            let targetValueHeader = v.fields.filter((f: IValueOptionFields) => f.key === targetHeader)[0]

            // Now we can compare the value of the "Brugere" with the value of the "Departments".
            // If they match we should include the department in the filtered list.
            return targetValueHeader.value === currentSelectedValueHeader.value
        })
    }

    checkFilters(d: IFormularCreatorElements, value: ItemValue | undefined)
    {
        if (this.state.filter[d.id])
        {
            let filters: IElementFilterValue[] = this.state.filter[d.id]

            // console.log('checkFilters', this.state.filter[d.id])

            filters.forEach(filter =>
            {
                if (!value) {
                    this.elements[filter.target_element_id].tsxSetFields(this.elements[filter.target_element_id]._fieldsOriginal.map((v: ItemValue) => v.getValueOption()))
                    return
                }

                // The filter is saved in the "id" og the element triggering the filter.
                // So, say we have a "Department" which should be filtered by "Brugere" then the filter is saved in the "Brugere" element.
                // We have to think about each process we may go through.
                //      1. Filter by "Brugere" is selected. Then we should filter the target elements "Departments".
                //          () 1.1 The target element has a list -> filter the list.
                //          () 1.2 The target element is an Autocomplete -> filter the list after the call.

                // console.log('The "filter by" element was triggered.')
                // console.log('checkFilters', d, value, this.state.filter[d.id])

                // This element is the one we would like to filter on.
                // Let's get the target element "Department".
                let targetElement = this.elements[filter.target_element_id]
                // console.log('targetElement', targetElement)

                // Next we get the value we should match on. This will likely be the label or id of "Department"
                let targetHeader = filter.target_header.key
                // console.log('targetElement', targetElement)

                // Let's get the list of "Departments" in its _fields.
                let targetFields: IValueOption[] = targetElement._fieldsOriginal.map((v: ItemValue) => v.getValueOption())
                // console.log('targetFields', targetFields)

                // Now we should get the value of the header of the current selected value for "Brugere".
                let currentSelectedValue: IValueOption = this.elements[d.id]._fields.filter((v: IValueOption) => v.id === value.getId())[0]

                if (!currentSelectedValue) {
                    // console.error('The currentSelectedValue is not found.')
                    // console.log(this.elements[d.id])
                    // console.log(this.elements[d.id]._fields)
                    // console.log(value)
                    // console.log(value.getId())
                    return
                }

                // console.log('Formular: currentSelectedValue', currentSelectedValue)

                let currentSelectedValueHeader = currentSelectedValue.fields.filter((v: IValueOptionFields) => v.key === filter.filter_by_header.key)[0]
                //console.log('Formular: currentSelectedValueHeader', currentSelectedValueHeader)

                if (!currentSelectedValueHeader) {
                    return
                }

                // Now we can filter the "Departments" list.
                let filteredFields = targetFields.filter((v: IValueOption) =>
                {
                    // Let's get the fields of the department where the key is the same as the targetHeader.
                    // E.g. a department has a field with key "label" and value "Aalborg".
                    // The targetHeader is the field of the "Brugere" value that we should match with.
                    // E.g. a user has a field with key "department" and value "Aalborg".

                    let targetValueHeader = v.fields.filter((f: IValueOptionFields) => f.key === targetHeader)[0]

                    // Now we can compare the value of the "Brugere" with the value of the "Departments".
                    // If they match we should include the department in the filtered list.
                    return targetValueHeader.value === currentSelectedValueHeader.value
                })

                this.elements[filter.target_element_id].tsxSetFields(filteredFields)

                console.log('filteredFields', filteredFields)
            });
        }
    }

    // -------------------------------------------------------------------------------------------------------------

    // This way an element with value_set_id
    setCondition(d, condition) {
        let values = d.condition.map((e: IFormularCreatorElementConditionValue) => e.value_option_id)
        this.setState(prevState => ({
            ...prevState,
            condition: {
                ...prevState.condition,
                [d.condition[0]?.element_id_target]: { condition: condition, value_ids: values },
            },
        }));
    }

    checkConditionValue(d: IFormularCreatorElements, value: ItemValue)
    {
        if (this.state.condition[d.id]) {
            // console.log(!!value && this.state.condition[d.id].value_ids.includes(parseInt(value)))
            this.state.condition[d.id].condition.checkCondition(
                // Check if the value is included in the value_ids
                !!value && this.state.condition[d.id].value_ids.includes(value?.getId())
            )
        }
    }

    checkConditionValues(formular_creator_element_id: number, values: ItemValue[])
    {
        if (this.state.condition[formular_creator_element_id]) {
            // Check if any of the values are included in the value_ids
            const isAnyValueIncluded = values.some(value =>
                this.state.condition[formular_creator_element_id].value_ids.includes(value?.getId())
            );
            // Check the condition
            this.state.condition[formular_creator_element_id].condition.checkCondition(isAnyValueIncluded);
        }
    }


    build() {

        const main: Main = this.props.main;
        const cycle: Cycle = main.$cycle('/formular')
        const section = new Section();

        let id = cycle._path._query?.['id']
        let autocompleteSearched = ''

        // -------------------------------------------------------------------------------------------------------------
        // Modal with Triggers
        // -------------------------------------------------------------------------------------------------------------

        let modalTriggers = () => {

            let data: IFormular = formularData._data;

            let section = new Section()
            let list: List = new List()

            section.add(list
                .default({ dataSource: data.triggers })
                .header(false)
                .footer(false)
                .headerCreate(false)
                .headerPrepend(new ListHeader().key('1').render((v, o) => <>{ o.trigger_creator.formular_then.id }</>))
                .headerPrepend(new ListHeader().key('2').render((v, o) => <>{ o.trigger_creator.formular_then.name }</>))
                .actions(new Action()
                    .icon(ArrowRightOutlined)
                    .callback((v) => {
                        main.$route(`/formular?id=` + v.record.formular_id_then);
                        main.$modalLoading(false)
                        main.$modalClose()
                    }))
            )

            return ({
                title: 'Der er Triggers på din formular',
                visible: true,
                section: section,
                handleCancel: () => main.$modalClose(),
                handleOk: () => {
                    main.$modalLoading(true);
                }
            })
        }

        // -------------------------------------------------------------------------------------------------------------
        //  Formulars and Gets
        // -------------------------------------------------------------------------------------------------------------

        const formular = new Formula(
            new Post()
                .main(main)
                .target(() => ({
                    method: 'POST',
                    target: `/api/formularSave`,
                }))
                .onThen(() => {
                    message.success('Det blev gemt!');
                    formularSave.tsxSetLoading(false)
                    let data: IFormular = formularData._data;
                    if (data.triggers.length) main.$modal(modalTriggers())
                })
                .onCatch(() => {
                    // message.success('Det blev gemt!');
                    message.error('Det blev ikke gemt!');
                })
            )
            .onChange(() => {
                this.saveButtons.forEach((r: any) => {
                    r.button.tsxSetDisabled(!formular.getIsAllRequiredFieldsFilled())
                });
                // formularSaveOnRequiredFilled.tsxSetDisabled(!formular.getIsAllRequiredFieldsFilled())
            })

        let formularData = new Get().target('/api/formularOpen?id=' + id)
            .onThen((response: any) => {
                condition.checkCondition(() => true)
                formular.setValuesFromFormular(formularData._data)
                formular.setValueByKey('id', id)
                this.saveButtons.forEach((r: any) => {
                    r.button.tsxSetDisabled(!formular.getIsAllRequiredFieldsFilled())
                });
                // formularSaveOnRequiredFilled.tsxSetDisabled(!formular.getIsAllRequiredFieldsFilled())
            })
            .onCatch(() => {
                condition.checkCondition(() => true)
            })

        // -------------------------------------------------------------------------------------------------------------
        //  The Header Function
        // -------------------------------------------------------------------------------------------------------------

        let page = (formular: Formula) =>
        {
            return (next: any) => {

                let page = new Section()

                let data: IFormular = formularData._data;
                let formularElements: IFormularCreatorElements[] = data.formular_creator.elements;
                let formularElementsSorted = getSortedElements(formularElements)
                let formularElementsSortedAndGrouped = getGroupedElements(formularElementsSorted)

                page.formula(formular, true)
                page.add(new Steps().addMore(
                    formularElementsSortedAndGrouped.map((elements: IFormularCreatorElements[], index: number) => {
                        let section = new Section()
                        return new StepsItem()
                            .title(elements[0].section.toString())
                            .content(fillPage(elements, data, section))
                    }
                )));
                page.init()

                return next(page)
            }
        }

        // -------------------------------------------------------------------------------------------------------------
        //  The Fill Page function
        // -------------------------------------------------------------------------------------------------------------

        let createAndRegisterSaveButton = (d: IFormularCreatorElements, formular: Formula, id: number) =>
        {
            let button = new Button()
                .disabled(true)
                .primary()
                .action(
                    new Action()
                        .label(d.name)
                        .callback(() => {
                            createAndOpenFormular(main, d.action.formular_creator_id, true, id)
                            formularSave.tsxSetLoading(true)
                            formular.submit()
                        })
                )

            if (!this.saveButtons.some((r: any) => r.id === d.id)) {
                this.saveButtons.push({
                    id: d.id,
                    button: button
                })
            }

            return button
        }

        let getFirst = (data: IFormular, d: IFormularCreatorElements) => {
            let result: IValue = data.formular_values
                .filter((r: IFormularValue) => r.formular_creator_element_id === d.id)[0]?.value
            // console.log('getFirst: data', data)
            // console.log('getFirst: creatorElements', d)
            // console.log('getFirst: result', result)
            return result
        }

        let getAll = (data: IFormular, d: IFormularCreatorElements) => {
            let result: IValue[] = data.formular_values
                .filter((r: IFormularValue) => r.formular_creator_element_id === d.id)
                .map((r: IFormularValue) => r.value)
            // console.log('getFirst: data', data)
            // console.log('getFirst: creatorElements', d)
            // console.log('getFirst: result', result)
            return result
        }

        let getInitialState = (data: IFormular, d: IFormularCreatorElements) => {

            // console.log('getInitialState', data.formular_values, d)

            let conditionValues = d.condition.map((e: IFormularCreatorElementConditionValue) => e.value_option_id)
            let conditionInitialState = data.formular_values.some((r: IFormularValue) => d.condition[0]?.element_id_target === r.formular_creator_element_id && conditionValues.includes(r.value.value_option.id))
            // console.log('getInitialState', conditionInitialState)
            return conditionInitialState
        }

        let getItemsFromValueSet = (d: IFormularCreatorElements, index: number) => {
            // console.log('getItemsFromValueSet', d)
            return !d.value_set ? [] : d.value_set.collection.map(v => v)
        }

        let getDesign = (d: IFormularCreatorElements) => {
            // console.log('getDesign', d)
            return d.configs.filter((r: IFormularCreatorElementConfigs) => r.config.config === 'selectionDesign')[0]?.inputs[0]?.value
        }

        let getGroupedElements = (elements: IFormularCreatorElements[]) =>
        {
            let groupedElements: any = [];
            let currentSection: any;
            let currentGroup: any = [];

            elements.forEach(element => {
                if (element.section !== currentSection) {
                    if (currentGroup.length > 0) {
                        groupedElements.push(currentGroup);
                    }
                    currentGroup = [];
                    currentSection = element.section;
                }
                currentGroup.push(element);
            });

            if (currentGroup.length > 0) {
                groupedElements.push(currentGroup);
            }

            return groupedElements;
        }

        let fillPage = (elements, data, section = new Section()) => {
            // console.log('fillPage', elements)
            elements.forEach((d: IFormularCreatorElements, index: number) => {

                // Register the filter if it exists in the configs.
                let filter = d.configs.filter((r: IFormularCreatorElementConfigs) => r.config.config === 'filterByOtherInput')

                if (filter.length) {
                    this.setFilter(d, filter[0].inputs[0].filter);
                }

                switch (d.class) {
                    case 'Title':
                        // -------------------------------------------------------------------------------------------------------------
                        //  Title
                        // -------------------------------------------------------------------------------------------------------------
                        section.add(new Title().level(2).label(d.name))
                        if (d.description) {
                            section.add(new Typography().label(d.description))
                        }
                        break;
                    case 'Text':
                        // -------------------------------------------------------------------------------------------------------------
                        //  Typography
                        // -------------------------------------------------------------------------------------------------------------
                        section.add(new Typography().label(d.name))
                        break;
                    case 'Input':
                        // -------------------------------------------------------------------------------------------------------------
                        //  Input
                        // -------------------------------------------------------------------------------------------------------------
                        section.add(new Title().level(3).label(d.name))
                        section.add(new Typography().label(d.name))
                        section.add(new Input()
                            .key(d.id)
                            // .default(getFirst(data, d).getValue().value)
                        );
                        break;
                    case 'Selection':
                        // -------------------------------------------------------------------------------------------------------------
                        //  Selection
                        // -------------------------------------------------------------------------------------------------------------
                        let selection = new Selection()
                            .key(d.id)
                            .label(d.name)
                            .design(getDesign(d))
                            .default(getFirst(data, d))
                            .addMore(getItemsFromValueSet(d, index))
                            .onChange((v: ItemValue) => this.checkConditionValue(d, v))

                        this.elements[d.id] = selection;

                        section.add(new Title().level(3).label(d.name))
                        section.add(selection);
                        break;
                    case 'Selections':
                        // -------------------------------------------------------------------------------------------------------------
                        //  Selections
                        // -------------------------------------------------------------------------------------------------------------
                        let selections = new Selections()
                            .key(d.id)
                            .label(d.name)
                            .default(getAll(data, d))
                            .addMore(getItemsFromValueSet(d, index))
                            .onChange((v: ItemValue[]) => this.checkConditionValues(d.id, v))

                        this.elements[d.id] = selections;

                        section.add(new Title().level(3).label(d.name))
                        section.add(selections);
                        break;
                    case 'List':
                    case 'Boolean':
                        // -------------------------------------------------------------------------------------------------------------
                        //  List
                        // -------------------------------------------------------------------------------------------------------------

                        let values = getItemsFromValueSet(d, index)
                        let valuesFromFilter = this.checkFiltersForInitialFields(d, values, formularData)

                        let list = new Select()
                            .key(d.id)
                            .label(d.name)
                            .required(true)
                            .default(getFirst(data, d))
                            .addMoreOriginal(values)
                            .addMore(valuesFromFilter)
                            .onChange((v: ItemValue) => {
                                this.checkConditionValue(d, v)
                                this.checkFilters(d, v)
                            })

                        this.elements[d.id] = list;

                        section.add(new Title().level(3).label(d.name))
                        section.add(list);
                        break;
                    case 'Autocomplete':
                        // -------------------------------------------------------------------------------------------------------------
                        //  Autocomplete
                        // -------------------------------------------------------------------------------------------------------------
                        let autocomplete = new Autocomplete();

                        this.elements[d.id] = autocomplete;

                        section.add(new Title().level(3).label(d.name))
                        section.add(
                            autocomplete
                                .key(d.id)
                                .label(d.name)
                                .default(getFirst(data, d))
                                .onClear(() => {
                                    this.checkFilters(d, undefined)
                                })
                                .onChange((v: ItemValue) => {
                                    this.checkConditionValue(d, v)
                                    this.checkFilters(d, v)
                                })
                                .get(() => new Get()
                                    .onThen((data: any) => {
                                        if (data.data.length) {
                                            autocomplete.tsxSetLoading(false)
                                            autocomplete.tsxSetSuccess(true)
                                        } else {
                                            autocomplete.tsxSetLoading(false)
                                            autocomplete.tsxSetError(true)
                                        }
                                    })
                                    .target((args) => {
                                        autocompleteSearched = args;
                                        return ({
                                            target: '/api/valuesByQuery',
                                            params: { value_set_id: d.value_set_id, q: args }
                                        })
                                    })
                                    .alter((response: IValueOption[]) => {
                                        return ({
                                            autocompleteSearched: autocompleteSearched,
                                            values: response.map((v: IValueOption) => v)
                                        })
                                    })
                                )
                        );
                        break;
                    case 'Condition':
                        // -------------------------------------------------------------------------------------------------------------
                        //  Condition
                        // -------------------------------------------------------------------------------------------------------------
                        let condition = addCondition(() => fillPage(d.elements, data), formular, () => getInitialState(data, d))
                        this.setCondition(d, condition)
                        section.add(condition);
                        break;
                    case 'Button':
                        switch (d.action?.action) {
                            case 'formularAddSame':
                            case 'formularAddOther':
                                section.add(createAndRegisterSaveButton(d, formular, id))
                                break;
                            default:
                                console.error("The Button was not created.", d)
                                break;
                        }
                        break;
                    default:
                        section.add(new Input()
                            .key(d.id)
                            .label(d.name)
                            .default(getFirst(data, d))
                        );
                        break;
                }
            });
            section.formula(formular)
            section.init()
            return section;
        };

        // -------------------------------------------------------------------------------------------------------------
        //  Condition / Styling / Footer
        // -------------------------------------------------------------------------------------------------------------

        let condition = addCondition(() => page(formular), formular)

        let formularSave = new Button()
            .primary()
            .action(new Action()
                .label('Gem')
                .callback(() => {
                    formularSave.tsxSetLoading(true)
                    formular.submit()
                })
            )

        let formularSaveOnRequiredFilled = new Button()
            .primary()
            .style({ marginLeft: 12 })
            .disabled(true)
            .action(new Action()
                .label('Gem (*)')
                .callback(() => {
                    formularSave.tsxSetLoading(true)
                    formular.submit()
                })
            )

        section
            .style({ padding: '24px 36px' })
            .center()
            .lg(12);

        section.add(condition)
        section.add(new Space().top(12))

        /*
        section.addRowEnd([
            formularSave,
            formularSaveOnRequiredFilled,
        ])
        */

        // -------------------------------------------------------------------------------------------------------------

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