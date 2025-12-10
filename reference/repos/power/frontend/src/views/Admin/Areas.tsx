import React from "react";

import {
    ListHeader,
    Section,
    Space,
    Title,
    List,
    Get,
    Main,
    Conditions,
    ConditionsItem,
    Input,
    Select,
    Formula,
    Post,
    Typography,
    Button,
    Action,
    SelectItem,
    Checkbox,
    CheckboxItem
} from './../../typescript/index';

import SectionComponent from './../../components/Section';
import {ArrowLeftOutlined} from "@ant-design/icons";

export default class Areas extends React.Component<any, any> {

    /**
     * 
     * Endpoints used in this view:
     * 
     * GET      /api/areas              [] OK
     * POST     /api/areaCreate         [] OK
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

        // The Get for features
        let areas = new Get().target('/api/areas')
            .onThen(() => {
                condition.checkCondition(() => true)
            })
            .onCatch(() => {
                condition.checkCondition(() => true)
            })

        let list = new List()
            .get(() => areas)
            .headerCreate(false)
            .addDummyColumn(true)
            .headerPrepend(new ListHeader().key('id').title(''))
            .headerPrepend(new ListHeader().key('name').title('Navn'))
            .headerPrepend(new ListHeader().key('description').title('Beskrivelse'))
            .headerPrepend(new ListHeader().key('identifier').title('Identifikation'))
            .headerPrepend(new ListHeader().key('parent').title('Forældre'))

        section.style({ padding: '0px 36px 48px 36px' });
        section.add(new Title().label('Områder').level(2));
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

        let addFeaturesModal = () => {

            let section = new Section()

            let formula = new Formula(new Post()
                .main(main)
                .target(() => ({
                    target: '/api/areaCreate',
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
            section.add(new Input().key('description').label('Beskrivelse'))
            section.add(new Input().key('identifier').label('Identifikation'))
            section.add(new Select().key('parent').label('Forældre')
                .addMore(areas._data.map((e : any) => new SelectItem(e.id, e.id, e.name, e.description)))
            )
            section.add(new Checkbox().key('area_is_root')
                .add(new CheckboxItem().value(true).label('Området skal være adskilt fra andre områder'))
            )
            section.init()

            return ({
                title: 'Opret et område',
                label: 'Her kan du oprette et område',
                visible: true,
                section: section,
                handleCancel: () => main.$modalClose(),
                handleOk: () => {
                    main.$modalLoading(true);
                    formula.submit();
                }
            })
        }

        let addArea = new Button().action(new Action().label('Opret nyt område').callback(() => main.$modal(addFeaturesModal())))

        section.add(addArea)
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