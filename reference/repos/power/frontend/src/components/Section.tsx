import React, { useEffect, useRef, useState} from "react";
import {Main, Section as SectionModel} from "../typescript";
import {Col, Row, Form, Card} from "antd";
import {FormInstance} from "antd/lib/form";

import DatePickerToggle from "./builder/DatePickerToggle";
import DatePickerRange from "./builder/DatePickerRange";
import Autocomplete from "./builder/Autocomplete";
import RangePicker from "./builder/RangePicker";
import Typography from "./builder/Typography";
import DatePicker from "./builder/DatePicker";
import Conditions from "./builder/Conditions";
import Selections from "./builder/Selections";
import Selection from "./builder/Selection";
import Checkbox from "./builder/Checkbox";
import Multiple from "./builder/Multiple";
import Carousel from "./builder/Carousel";
import Creator from "./builder/Creator";
import Result from "./builder/feedback/Result";
import Upload from "./builder/Upload";
import Drawer from "./builder/Drawer";
import Select from "./builder/Select";
import Button from "./builder/Button";
import Search from "./builder/Search";
import Switch from "./builder/Switch";
import Slider from "./builder/Slider";
import Sider from "./builder/Sider";
import Space from "./builder/Space";
import Steps from "./builder/Steps";
import Modal from "./builder/Modal";
import Title from "./builder/Title";
import Input from "./builder/Input";
import Radio from "./builder/Radio";
import Alert from "./builder/Alert";
import Tree from "./builder/Tree";
import List from "./builder/List";
import Menu from "./builder/Menu";
import Default from "./builder/Default";

function getComponent(props: any) {

    // We must remove the section s.t. a Section-component can't iterate on itself.
    let addProps = { ...props };

    if (typeof props.model === 'function') {
        return <Section {...addProps} />
    }

    if (props.model._class === 'Section' && !!props.model._component) {
        const Component = props.model._component;
        addProps['args'] = props.model._componentArgs;
        return (<Component {...addProps} />)
    }

    switch (props.model._class) {
        case 'DatePickerToggle': return <DatePickerToggle {...addProps} />;
        case 'DatePickerRange': return <DatePickerRange {...addProps} />;
        case 'Autocomplete': return <Autocomplete {...addProps} />;
        case 'RangePicker': return <RangePicker {...addProps} />;
        case 'Typography': return <Typography {...addProps} />;
        case 'DatePicker': return <DatePicker {...addProps} />;
        case 'Conditions': return <Conditions {...addProps} />;
        case 'Selections': return <Selections {...addProps} />;
        case 'Selection': return <Selection {...addProps} />;
        case 'Checkbox': return <Checkbox {...addProps} />;
        case 'Multiple': return <Multiple {...addProps} />;
        case 'Carousel': return <Carousel {...addProps} />;
        case 'Creator': return <Creator {...addProps} />;
        case 'Section': return <Section {...addProps} />;
        case 'Result': return <Result {...addProps} />;
        case 'Upload': return <Upload {...addProps} />;
        case 'Drawer': return <Drawer {...addProps} />;
        case 'Select': return <Select {...addProps} />;
        case 'Button': return <Button {...addProps} />;
        case 'Switch': return <Switch {...addProps} />;
        case 'Slider': return <Slider {...addProps} />;
        case 'Search': return <Search {...addProps} />;
        case 'Title': return <Title {...addProps} />;
        case 'Steps': return <Steps {...addProps} />;
        case 'Modal': return <Modal {...addProps} />;
        case 'Space': return <Space {...addProps} />;
        case 'Sider': return <Sider {...addProps} />;
        case 'Input': return <Input {...addProps} />;
        case 'Radio': return <Radio {...addProps} />;
        case 'Alert': return <Alert {...addProps} />;
        case 'Menu': return <Menu {...addProps} />;
        case 'Tree': return <Tree {...addProps} />;
        case 'List': return <List {...addProps} />;
        default:
            return <div key={null}>Undefined Component</div>;
    }
}

const Formula = (props: any) => {
    return <Iterate main={props.main} form={props.form} section={props.section} />;
}

const Iterate = (props: any) => {
    if (props.section._type === 'Row') {
        return (
            <Row style={props.section._style} justify={props.section._justify}>
                { props.section._fields.map((model: any, i: number) => {
                    const addProps = { ...props, ...{ model: model, key: i }};
                    return (<Default { ...addProps } key={'d-' + i} component={getComponent({ ...addProps })}></Default>)
                }) }
            </Row>
        )
    }
    return (
        <Col style={props.section._style} span={24}>
            { props.section._fields.map((model: any, i: number) => {
                const addProps = { ...props, ...{ model: model, key: i }};
                return (<Default { ...addProps } key={'d-' + i} component={getComponent({ ...addProps })}></Default>)
            }) }
        </Col>
    )
}

const Section = (props: {
    main: Main,
    section: any,
    form?: FormInstance,
    model?: SectionModel,
    parent?: any,
    style?: any,
    args?: any,
    saveState?: boolean,
}) => {

    // If async is set to true the model or sectionModel will be a void function.
    // The first argument of sectionModel is called once the section is build.

    let [model, setModel] = useState<any>(props.saveState && props.section._saveState ? props.section._saveState : false)
    let [style, setStyle] = useState<any>(props.style ?? {});
    let [ref] = useState<any>(useRef());

    let section = props.model ?? props.section;
    if (!section) console.log('Section is all weird. What did you pass to the .tsx?', section);

    useEffect(() => {
        // If a formula is created or re-drawn, reset the fields in case the component was recycled.
        if (section && section._formulaIsRoot) {
            props.form?.resetFields();
        }
    }, [section]);

    useEffect(() => {
        // console.log('Calling onComplete', props.saveState, section._saveState)
        section._onComplete();
    }, []);

    let formula = () => <Formula main={props.main} form={props.form} section={model} />;

    section._onComplete = () =>
    {
        if (props.saveState && section._saveState) {
            console.log('Section: skipping calling next.')
            console.log('Section: restore state.', section._saveState)
        } else {
            if (section && typeof section === 'function') {
                section((r: SectionModel) => {
                    if (!section._formula && props.parent?._formula) {
                        r.formulaSetChildren?.(props.parent._formula)
                    }
                    setModel(r);
                    section._saveState = r;
                }, () => {}, props.main, props.args);
            } else {
                if (!section._formula && props.parent?._formula) {
                    section.formulaSetChildren?.(props.parent._formula)
                }
                setModel(section);
                section._saveState = section;
            }
        }
    }

    if (model) {
        return (
            <Row style={style} ref={ref} justify={ model._justify }>
                <Col lg={ model._lg } sm={ model._sm } >
                    { model._card ? <Card style={model._cardStyle ?? {}}>{formula()}</Card> : formula() }
                </Col>
            </Row>
        )
    } else {
        return null;
    }
}

export default Section

