import React from "react";
import moment from "moment";

import {Action, Button, Carousel, Get, Main, Post, Section, Typography} from './../../typescript/index';
import SectionComponent from "./../../components/Section";

import {Button as ButtonAntd, Col, Row} from "antd";
import {HeartOutlined, HomeOutlined, SmileOutlined} from "@ant-design/icons";
import {Autocomplete, Item, Space} from "../../typescript";
import {IFormular, IFormularCreator, IFormularCreatorConfigs, IFormularState} from "../../classes";
import {addCondition} from "../../helpers";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import Formular from "./Formular";

const highlightText = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
        <span>
            {parts.map((part, index) =>
                part.toLowerCase() === highlight.toLowerCase()
                    ? <span key={index} style={{ backgroundColor: '#f5e5c4' }}>{part}</span>
                    : part
            )}
        </span>
    );
};
const createAndOpen = (id, main) => {
    if (id) {
        new Post()
            .target(() => ({
                target: '/api/formularCreate',
                params: { id: id }
            }))
            .onThen((e) => {
                main.$route(`/formular?id=` + e.data.id);
            })
            .submit();
    }
}
const getIcon = (e: Item) => {
    let icon: any = undefined
    switch (e._icon) {
        case 'Home':
            icon = <HomeOutlined />
            break;
        case 'Heart':
            icon = <HeartOutlined />
            break;
        case 'Smile':
            icon = <SmileOutlined />
            break;
    }
    return icon ? <div style={{ fontSize: 20, opacity: .4, margin: '4px 20px 0px 4px' }}>{ icon }</div> : <></>
}
const getCarousel = (main: Main, section: Section, formularCreators) => {

    let carouselCreatorElement = new Carousel()

    let carousel = () => {
        return (next) => {
            let section = new Section()
            let element= carouselCreatorElement
                .style({ backgroundColor: 'rgba(228,242,253,0.3)', color: '#7db5fd' })
                .label('Opret ny')
                .addLabel((item: Item) => '')
                .addLabel((item: Item) => '')
                .getIconText((item: Item) => item.getData()?.configs?.find((e: IFormularCreatorConfigs) => e.config.config === 'icon')?.inputs[0].value.value_option.value)
                .getNameText((item: Item) => item.getData()?.name)
                .getDescriptionText((item: Item) => item.getData()?.description)
                .addMore(formularCreators._data
                    .map((e: IFormularCreator) => {
                        let id = e.id.toString()
                        return new Item(id)
                            .object(e)
                            .callback(() => createAndOpen(id, main))
                    })
                )
            section.add(element)
            next(section)
        }
    }

    return addCondition(() => carousel(), undefined)
}
const getCarouselFormular = (main: Main, section: Section, formulars) => {

    let carouselFormularElement = new Carousel()

    let carouselFormular = () => {
        return (next) => {
            let section = new Section()
            let element = carouselFormularElement
                .style({ backgroundColor: 'rgba(198,233,213,0.3)', color: '#50c878' })
                .label('Mine formularer')
                .addLabel((item: Item) => {
                    let formularState = item.getData()?.formular_states?.find((e: IFormularState) => e.state_value[0].config.config === 'deleteEmptyDisplay')
                    let dateText =  formularState ? formularState.state_value[0].value.value_text.value : undefined
                    return dateText ? 'Tom formular, slettes ' + dateText : ''
                })
                .addLabel((item: Item) => {
                    let formularState = item.getData()?.formular_states?.find((e: IFormularState) => e.state_value[0].config.config === 'deleteIdleDisplay')
                    let dateText = formularState ? formularState.state_value[0].value.value_text.value : undefined
                    return dateText ? 'Ikke afsluttet, slettes ' + dateText : ''
                })
                .getIconText((item: Item) => item.getData()?.configs?.find((e: IFormularCreatorConfigs) => e.config.config === 'icon')?.inputs[0].value.value_option.value)
                .getNameText((item: Item) => item.getData()?.formular_creator.name)
                .getDescriptionText((item: Item) => item.getData()?.formular_creator.description)
                .filterFunction([
                    { key: 'updated_at', label: 'Opdateret' },
                    { key: 'created_at', label: 'Oprettet' },
                ])
                .addMore(formulars._data
                    .map((e: IFormular) => {
                        let formularId = e.id.toString()
                        return new Item(formularId)
                            .object(e)
                            .callback(() => main.$route(`/formular?id=` + formularId))
                    })
                )
            section.add(element)
            next(section)
        }
    }

    return addCondition(() => carouselFormular(), undefined);
}
const getAutocomplete = (main: Main, section: Section) => {

    let autocomplete = new Autocomplete()
    let autocompleteSearched = '?'

    autocomplete
        .styleForm({ paddingLeft: 16, paddingRight: 16, width: '100%' })
        .sizeString('large')
        .clearable(false)
        .ignoreOnChange(false)
        .onChange((e) => createAndOpen(e.object?.object?.id, main))
        .get(() => new Get()
            .onThen((data) => {
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
                    target: '/api/formularCreatorsByUserSearch',
                    params: { q: args }
                })
            })
            // The Autocomplete expects Item[].
            .alter((v: any) => v.map((r: IFormularCreator, index) => {
                let item = new Item(r.id.toString())
                    .id(r.id.toString())
                    .value(r.name)
                    .icon(r.configs?.find((e: IFormularCreatorConfigs) => e.config.config === 'icon')?.inputs[0].value)
                    .object(r);
                item.render(() => {
                    return (
                        <Row style={{ margin: '4px 0' }}>
                            <Col>{ getIcon(item) }</Col>
                            <Col>
                                <Row style={{ fontWeight: 600 }}>{highlightText(r.name, autocompleteSearched)}</Row>
                                <Row>{highlightText(r.description, autocompleteSearched)}</Row>
                            </Col>
                        </Row>
                    )
                });
                return item;
            }))
        )

    return autocomplete
}

export default class Formulars extends React.Component<any, any> {

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

        let formularCreators = new Get().target('/api/formularCreatorsByReader')
            .onThen(() => {
                conditionCarousel.checkCondition(() => true)
            })
            .onCatch(() => {})

        let formulars = new Get().target('/api/formularsByUser')
            .onThen(() => {
                conditionCarouselFormular.checkCondition(() => true)
            })
            .onCatch(() => {})

        formularCreators.get()
        formulars.get()

        // -------------------------------------------------------------------------------------------------------------

        let conditionCarousel = getCarousel(main, section, formularCreators)

        let conditionCarouselFormular = getCarouselFormular(main, section, formulars)

        // let autocomplete = getAutocomplete(main, section)

        // -------------------------------------------------------------------------------------------------------------

        section.style({ padding: '36px 36px 48px 36px' });
        section.add(conditionCarousel)
        section.add(new Section().row().end().add(
            new Button()
                .link()
                .fontawesome(faChevronRight)
                .style({ fontSize: 12 })
                .iconPosition('right')
                .action(new Action().label('Se list med formularer').route(() => '/'))
        ))
        section.add(new Space().top(24))
        section.add(conditionCarouselFormular)
        section.add(new Section().row().end().add(
            new Button()
                .link()
                .fontawesome(faChevronRight)
                .style({ fontSize: 12 })
                .iconPosition('right')
                .action(new Action().label('Se liste alle oprettede').route(() => '/'))
        ))
        // section.add(autocomplete)

        // -------------------------------------------------------------------------------------------------------------

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