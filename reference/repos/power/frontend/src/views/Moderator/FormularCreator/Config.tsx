
import {
    Section,
    Title,
    Space,
    Get,
    Button,
    Select,
    Action,
    Post,
    Typography,
    Input,
    Formula,
    ItemValue
} from "../../../typescript";
import { Collapse } from "antd";
import SectionComponent from "../../../components/Section";
import { addCondition } from "../../../helpers";
import {
    IConfigs,
    IFormularCreator, IFormularCreatorConfigs,
    IFormularCreatorConfigsInput,
    IFormularCreatorElementConfigs,
    IValueOption
} from "../../../classes";

const configSectionConfiguration = (main, formular: IFormularCreator) =>
{
    return (next) => {

        const section = new Section();

        // The Get for Values
        let elementConfig = new Get()
            .target(() => ({
                target: '/api/formularCreatorConfigsForFormularCreator',
                params: { id: formular.id }
            }))
            .onThen(() => {
                listWithConditionsCondition.checkCondition(true)
            })

        let elementConfigFormular = new Formula(new Post()
            .main(main)
            .target(() => ({
                target: '/api/formularCreatorConfigsForFormularCreatorSave',
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
                let input = e.inputs[0].related_input as IFormularCreatorConfigsInput
                switch (e.inputs[0].input_class.class) {
                    case 'List':
                        section.add(new Typography()
                            .label(e.name)
                            .style({ opacity: 0.9 })
                        )
                        section.add(new Typography()
                            .label(e.description)
                            .style({ opacity: 0.6, marginTop: -16 })
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
                                        formular_creator_id: formular.id
                                    })
                                })
                        )
                        break;
                    case 'Integer':
                        section.add(new Typography()
                            .label(e.name)
                            .style({ opacity: 0.9 })
                        )
                        section.add(new Typography()
                            .label(e.description)
                            .style({ opacity: 0.6, marginTop: -16 })
                        )
                        section.add(
                            new Input()
                                .key(e.id)
                                .label(e.name)
                                .default(input?.value.value_int.value)
                                .accessItemValue((v: ItemValue) => {
                                    v.getFormsValue = () => ({
                                        config_id: e.id,
                                        config_input_id: e.inputs[0].id,
                                        value: v.getValue(),
                                        value_id: input?.value.id,
                                        value_set_type: 'Integer',
                                        value_set_id: e.inputs[0].input_value_set.id,
                                        formular_creator_id: formular.id
                                    })
                                })
                        )
                }
            })

            section.add(new Space().top(16))
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

const configSectionCreator = (main, formular: IFormularCreator) =>
{
    const section = new Section();

    // section.style({ padding: '0px 36px 48px 36px' });
    section.add(new Title().label('Konfiguration').level(4));
    section.add(new Space().top(16));

    section.add(new Section().component(() => {
        return (
            <Collapse
                defaultActiveKey={[]}
                items={[
                    {
                        key: '1',
                        label: 'Konfiguration',
                        children: <SectionComponent
                            main={main}
                            section={configSectionConfiguration(main, formular)}
                            style={{ margin: '-16px' }}
                        />
                    },
                ]}
            />
        )
    }))

    section.add(new Space().top(32))

    return section
}

export default configSectionCreator;