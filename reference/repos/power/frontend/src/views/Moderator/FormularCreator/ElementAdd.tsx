import {
    Autocomplete,
    Formula,
    Get,
    Input,
    ItemValue,
    List,
    ListHeader,
    Post,
    Section,
    Select
} from "../../../typescript";
import {addCondition} from "../../../helpers";
import {
    IActions,
    IElementClass,
    IFormularCreator,
    IFormularCreatorElements,
    IValueOption,
    IValueSets
} from "../../../classes";

let addFormular = (
    parentId = undefined,
    cycle: any,
    main: any,
    list: any,
    actions: any,
    classes: any,
    valueSets: any,
    formular: any
) => {

    let section = new Section()

    let values = new Get()
        .target((args: any) => ({
            target: '/api/values',
            params: { formular_creator_element_id: args }
        }))
        .onThen(() => {})
        .onCatch(() => {})

    let formula = new Formula(new Post()
        .main(main)
        .target(() => ({
            target: '/api/formularCreatorElementCreate',
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

    section.add(new Input().key('parent_formular_creator_element_id').default(parentId).disabled(true))
    section.add(new Input().key('formular_creator_id').default(cycle._path._query?.['id']).disabled(true))
    section.add(new Input().key('name').label('Navn'))
    section.add(new Input().key('description').label('Beskrivelse'))
    section.add(new Input().key('section').label('Sektion'))
    section.add(new Input().key('group').label('Gruppe'))
    section.add(new Input().key('order').label('Sortering'))

    // ---------------------------------------------------------------------------------------------------------
    // List of Classes
    // ---------------------------------------------------------------------------------------------------------

    let classesWithValueSets = [
        'Autocomplete',
        'Selections',
        'Selection',
        'List',
    ]

    let selectionOfClass = new Select()
        .key('class')
        .label('Type')
        .onChange((i: ItemValue) =>
        {
            // If Condition is selected and there is a Value Set, then open the Condition Value Selector.
            const isClassIncluded = classesWithValueSets.includes(i.getDescription());
            const isButton = i.getDescription() === 'Button'
            const isCondition = i.getDescription() === 'Condition';
            // const hasDefaultValue = !!selectionOfValueSet.getValue();

            selectionOfValueSetCondition.checkCondition(isClassIncluded);
            selectionOfActionsCondition.checkCondition(isButton);
            selectionOfElementsCondition.checkCondition(isCondition)

            if (!isButton) {
                formularAddOtherCondition.checkCondition(false);
            }

            /*
            if (isCondition && hasDefaultValue) {
                listWithConditionsCondition.checkCondition(true);
                listWithConditions.refresh();
            } else {
                listWithConditionsCondition.checkCondition(false);
            }
            */
        })
        .addMore(classes._data.map((e: IElementClass) => {
            return ({
                id: e.id,
                value: e.class,
            }) as IValueOption
        }))

    section.add(selectionOfClass)

    //----------------------------------------------------------------------------------------------------------
    // List of Button Actions, given class = Button
    //----------------------------------------------------------------------------------------------------------

    let selectionOfActionsId = new Input().key('action_id').hidden()
    let selectionOfActions = new Select()
        .key('action')
        .label('Handlinger')
        .onChange((i: ItemValue) => {
            formularAddOtherCondition.checkCondition(i.getDescription() === 'formularAddOther')
            selectionOfActionsId.setValue(i.getId());
        })
        .addMore(actions._data.map((e: IActions) => {
            return ({
                id: e.id,
                value: e.action,
            }) as IValueOption
        }))

    let selectionOfActionsCondition = addCondition(selectionOfActions, formula)

    section.add(selectionOfActionsId)
    section.add(selectionOfActionsCondition)

    //----------------------------------------------------------------------------------------------------------
    // If button is formularAddOther
    //----------------------------------------------------------------------------------------------------------

    let formularAddOther = new Autocomplete()
    let formularAddOtherSearched = '?'

    formularAddOther
        .key('formular_creator_id_add_formular_other')
        .get(() => new Get()
            .onThen((data) => {
                if (data.data.length) {
                    formularAddOther.tsxSetLoading(false)
                    formularAddOther.tsxSetSuccess(true)
                } else {
                    formularAddOther.tsxSetLoading(false)
                    formularAddOther.tsxSetError(true)
                }
            })
            .target((args) => {
                formularAddOtherSearched = args;
                return ({
                    target: '/api/formularCreatorsByModeratorSearch',
                    params: { q: args }
                })
            })
            // The Autocomplete expects Item[].
            .alter((v: any) => ({
                autocompleteSearched: formularAddOtherSearched,
                values: v.map((r: IFormularCreator) => {
                    return {
                        id: r.id,
                        value: r.name,
                        description: r.description,
                    }
                })
            }))
        )

    let formularAddOtherCondition = addCondition(formularAddOther, formula)

    section.add(formularAddOtherCondition)

    //----------------------------------------------------------------------------------------------------------
    // List of Value Sets, given class is in classesWithValueSets
    //----------------------------------------------------------------------------------------------------------

    let selectionOfValueSet = new Select()
        .key('value_set_id')
        .label('Liste')
        .onChange((s: ItemValue) => {
            // If Condition is selected and there is a Value Set, then open the Condition Value Selector.
            if (!!s.getValue() && selectionOfClass.getDescription() === 'Condition') {
                listWithConditionsCondition.checkCondition(true)
                listWithConditions.refresh()
            } else {
                listWithConditionsCondition.checkCondition(false)
            }
        })
        .addMore(valueSets._data.map((e : IValueSets) => {
            return ({
                id: e.id,
                value: e.name,
            }) as IValueOption
        }))

    let selectionOfValueSetCondition = addCondition(selectionOfValueSet, formula)

    section.add(selectionOfValueSetCondition)

    //----------------------------------------------------------------------------------------------------------
    // List of Elements, given class = Condition
    //----------------------------------------------------------------------------------------------------------

    let listWithElements = new Select()
        .key('list_of_formular_creator_element_ids')
        .label('Elementer')
        .addMore(formular._data.elements.map((e: IFormularCreatorElements) => {
            return ({
                id: e.id,
                value: e.name,
            }) as IValueOption
        }))
        .onChange((s: ItemValue) => {
            if (!!s.getValue()) {
                listWithConditionsCondition.checkCondition(true)
                listWithConditions.refresh(s.getId())
            } else {
                listWithConditionsCondition.checkCondition(false)
            }
        })

    let selectionOfElementsCondition = addCondition(listWithElements, formula);

    section.add(selectionOfElementsCondition)


    //----------------------------------------------------------------------------------------------------------
    // List of values, given class = Condition and Value Set is given
    //----------------------------------------------------------------------------------------------------------

    let listWithConditions = new List()
        .formula(formula)
        .get(() => values)
        .emptyText('')
        .footer(false)
        .headerCreate(false)
        .headerPrepend(new ListHeader().key('id').title(''))
        .headerPrepend(new ListHeader().key('value').title('Værdi'))
        .selectable('list_of_value_ids')
        .selectableFormat((v: any) => {
            // console.log('selectableFormat', v)
            return v.map((e: any) => e.id)
        })

    let listWithConditionsCondition = addCondition(listWithConditions, formula);

    section.add(listWithConditionsCondition)

    // ---------------------------------------------------------------------------------------------------------

    section.init()

    return ({
        title: 'Opret et Formular Element',
        label: 'Her kan du oprette et Formular Element',
        visible: true,
        section: section,
        handleCancel: () => main.$modalClose(),
        handleOk: () => {
            main.$modalLoading(true);
            formula.submit();
        }
    })
}

export default addFormular;
