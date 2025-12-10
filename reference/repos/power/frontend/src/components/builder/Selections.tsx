import React, {useEffect, useState} from "react";

import SelectionsModel from "../../typescript/models/builder/Selections";
import {Button, Flex} from "antd";
import {Form} from 'antd';
import {Item, ItemValue} from "../../typescript";

const Selections = (props: any) => {

    let model: SelectionsModel = props.model;

    let [defaults, setDefaults]
        = useState(model._default ?? []);

    let [defaultObjects, setDefaultObjects]
        = useState(model._fields.filter((e: Item) => model._default?.includes(e._value)) ?? []);

    const addOrRemoveValues = (values: number[], value: number) => {
        
        const index = values.indexOf(value);
        let newValues = [...values];

        if (index === -1) {
            newValues.push(value);
        } else {
            newValues.splice(index, 1);
        }

        return newValues;
    }

    const addOrRemoveObjects = (objects: Item[], object: Item) => {

        const index = objects.findIndex(o => o._value === object._value);
        let newObjects = [...objects]; // Create a copy of the array

        if (index === -1) {
            newObjects.push(object);
        } else {
            newObjects.splice(index, 1);
        }

        return newObjects;
    }


    const onChange = ({ value, object }) => {

        // console.log("Selections: onChange", value, object)

        let newValues = addOrRemoveValues(defaults, value)
        let newObjects = addOrRemoveObjects(defaultObjects, object)

        model._default = newValues;
        model._defaultObject = newObjects;

        if (model._formula) model.value(newValues);

        setDefaults(newValues)
        setDefaultObjects(newObjects)

        model._onChange({ values: newValues })
    };

    const onClear = () => {
        model._default = [];
        model._defaultObject = [];
        if (model._formula) model.value([]);
    };

    model._onError = () => onClear();
    model._onComplete = () => onClear();

    // Register the defaultValue to the formula.
    if (model._default) {
        if (model._formula) {
            model.value(model._default);
        }
    }

    return (
        <Form.Item style={ model._style ?? { marginBottom: 0 }}>
            <Flex gap="middle" vertical>
                <Flex vertical={false}>
                    { model._fields.map((r: ItemValue, index) => {

                        // if (!props.main.$access(obj._access ?? true)) return null;

                        let style: any = {
                            width: '100%',
                            marginLeft: index !== 0 ? 4 : 0,
                            marginRight: index === 0 ? 4 : 0,
                        }

                        if (r._color) {
                            style = {
                                ...style,
                                borderColor: r._color + "80",
                                backgroundColor: r._color,
                            }
                        }

                        return (
                            <Button
                                key={r.getId()}
                                type={defaults.includes(r.getValue()) ? 'primary' : 'default'}
                                style={style}
                                onClick={() => onChange({ value: r.getId(), object: r })}
                            >
                                { r.getDescription() ?? 'The Item-object should have the title-variable set.' }
                            </Button>
                        )
                    })}
                </Flex>
            </Flex>
        </Form.Item>
    );
}

export default Selections;