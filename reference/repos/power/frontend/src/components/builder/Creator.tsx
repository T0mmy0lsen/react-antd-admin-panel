import React from "react";
import {
    Checkbox, CheckboxItem,
    Conditions,
    ConditionsItem,
    Creator as CreatorModel, Input, Item, ListHeader, Multiple,
    Section as SectionModel, Select, SelectItem, Space, Title,
} from "../../typescript";
import Section from "../Section";

const setConditions = (conditions: Conditions) => {

    let multiple = () => {
        return new Multiple()
            .key('items')
            .label('Default')
            .headers([
                new ListHeader()
                    .key('value')
                    .title('Value')
                    .editable()
            ])
    }

    let template = () => {
        return new SectionModel()
            .add(new Title().style({ paddingLeft: 10 }).level(4).label('Settings'))
            .add(new Input().key('label').label('Label'))
            .add(new Space().top(12))
            .add(new Input().key('text').label('Text'))
            .add(new Space().top(12))
            .add(new Checkbox().key('required').add(new CheckboxItem().value(1).label('This field is required')).style({ paddingLeft: 10 }))
            .add(new Space().top(12))
    }

    conditions
        .add(new ConditionsItem()
            .condition((value: any) => value === 'input')
            .content((next) => next(template()))
        )
        .add(new ConditionsItem()
            .condition((value: any) => value === 'radio')
            .content((next) => next(template().add(multiple())))
        )
        .add(new ConditionsItem()
            .condition((value: any) => value === 'select')
            .content((next) => next(template().add(multiple())))
        )
        .add(new ConditionsItem()
            .condition((value: any) => value === 'checkbox')
            .content((next) => next(template().add(multiple())))
        )
        .add(new ConditionsItem()
            .condition((value: any) => value === 'multiple')
            .content((next) => next(template().add(multiple())))
        )

    return conditions;
}

const Creator = (props: any) => {

    let model: CreatorModel = props.model;
    let section: SectionModel = new SectionModel();
    let conditions: Conditions = new Conditions();

    conditions = setConditions(conditions);
    conditions.default(model._default);

    section.add(new Select()
        .key('type')
        .default(model._default)
        .clearable(false)
        .add(new Item('input'))
        .add(new Item('radio'))
        .add(new Item('select'))
        .add(new Item('checkbox'))
        .add(new Item('multiple'))
        .onChange((v: any) => {
            conditions.checkCondition(v);
        })
    )

    section.add(conditions);
    section.add(new Space().top(24));

    return <Section main={props.main} section={section} parent={model} />
}

export default Creator;