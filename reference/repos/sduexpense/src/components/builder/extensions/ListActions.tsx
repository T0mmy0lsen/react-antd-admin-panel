import React, {useEffect, useState} from "react";
import {Popconfirm, Space, Tooltip} from "antd";
import {
    QuestionCircleOutlined,
    CloseOutlined,
    UndoOutlined, SaveOutlined, EditOutlined,
} from "@ant-design/icons/lib";
import {Access, Action} from "../../../typescript";

const handleIcon = (r: Action, props: any) => {
    if (r._icon) return <r._icon className={'action-icon'} { ...props }/>
    switch (r._key) {
        case 'deleteFromList':
        case 'deleteConfirm':
        case 'delete':
            return <Tooltip title={'Slet'}>
                <CloseOutlined color={'red'} { ...props } />
            </Tooltip>
        default:
            return <></>
    }
}

const onClick = ({ model, props, record, action }: any) => {
    switch (action._key) {
        default:
            action.click({ model, props, record });
            break;
    }
};

const Actions = ({
    parentProps,
    parentModel,
    record
}: any) => {

    const [state, setState] = useState({ deleted: false, editing: false })
    const [actions, setActions] = useState(parentProps.model._actions);
    const [visible, setVisible] = useState(false);

    const setDeleted = (v: boolean) => setState({ deleted: v, editing: state.editing });
    const setEditing = (v: boolean) => setState({ editing: v, deleted: state.deleted });

    return (
        <Space align={'end'} style={{ display: 'flex', justifyContent: 'flex-end' }}>

        {actions.map((r: Action, i: number) => {

            if (r._key === 'component') {
                const Component = r._component;
                return (<Component key={i} value={record} record={record} {...parentProps} />)
            }
            if (r._key === 'deleteFromList') {
                return (
                    <span key={i} style={{ marginLeft: 12, fontSize: 14, width: 36, opacity: 0.75 }}>
                        <Tooltip title={'Slet'}>
                            <CloseOutlined disabled={r._disabled} onClick={(e: any) => {
                                e.stopPropagation();
                                parentModel.removeRecord(record, r._onComplete);
                            }}/>
                        </Tooltip>
                    </span>
                )
            }
            if (r._key === 'deleteConfirm') {
                return (
                    <Popconfirm
                        key={i}
                        title="Er du sikker på at du vil slette"
                        okText="Ja" cancelText="Nej"
                        icon={<QuestionCircleOutlined style={{ color: 'grey' }}/>}
                        placement={'left'}
                        visible={visible}
                        onCancel={(e: any) => {
                            e.stopPropagation()
                            setVisible(false)
                        }}
                        onConfirm={(e: any) => {
                            e.stopPropagation()
                            setVisible(false)
                            r._componentData = record;
                            onClick({
                                action: r,
                                record: record,
                                props: parentProps,
                                model: parentModel,
                            })
                        }}
                    >
                        <span style={{ marginLeft: 12, fontSize: 14, width: 36, opacity: 0.75 }}>
                            {
                                new Access(parentProps.main)
                                    .action(r, record)
                                    .render((v) => {
                                        return <Tooltip title={'Slet'}>
                                            <CloseOutlined {...v} style={{ color: 'red'}}/>
                                        </Tooltip>
                                    })
                                    .configs({
                                        onClick: (e: any) => {
                                            e.stopPropagation()
                                            setVisible(true)
                                        }
                                    })
                            }
                        </span>
                    </Popconfirm>
                )
            }
            if (r._key === 'delete') {
                return (
                    <span key={i} style={{ marginLeft: 12, fontSize: 14, width: 36, opacity: 0.75 }}>
                        { state.deleted ? (
                            <Tooltip title={'Fortryd'}>
                                {
                                    new Access(parentProps.main).action(r, record).render((v) => <UndoOutlined { ...v } />)
                                        .configs({
                                            onClick: (e: any) => {
                                                e.stopPropagation();
                                                setDeleted(!state.deleted);
                                                parentModel.deleteRecord(record);
                                            }
                                        })
                                }
                            </Tooltip>
                        ) : (
                            <Tooltip title={'Slet'}>
                                {
                                    new Access(parentProps.main).action(r, record).render((v) => <CloseOutlined { ...v } />)
                                        .configs({
                                            onClick: (e: any) => {
                                                e.stopPropagation();
                                                setDeleted(!state.deleted);
                                                parentModel.deleteRecord(record);
                                            }
                                        })
                                }
                            </Tooltip>
                        )}
                    </span>
                )
            }
            if (r._key === 'edit') {
                return (
                    <span key={i} style={{ marginLeft: 12, fontSize: 14, width: 36, opacity: 0.75 }}>
                        { state.editing ? (
                            <Tooltip title={'Gem'}>
                                {
                                    new Access(parentProps.main).action(r, record).render((v) => <SaveOutlined { ...v } />)
                                        .configs({
                                            onClick: (e: any) => {
                                                e.stopPropagation();
                                                parentModel.editRecord(record);
                                                parentModel._onRecordWasSaved(record);
                                                setEditing(!state.editing);
                                            }
                                        })
                                }
                            </Tooltip>
                        ) : (
                            <Tooltip title={'Rediger'}>
                                {
                                    new Access(parentProps.main).action(r, record).render((v) => <EditOutlined { ...v } />)
                                        .configs({
                                            onClick: (e: any) => {
                                                e.stopPropagation();
                                                parentModel.editRecord(record);
                                                setEditing(!state.editing);
                                            }
                                        })
                                }
                            </Tooltip>
                        )}
                    </span>
                )
            }

            return (
                <Tooltip title={r._label}>
                    <span key={i} style={{marginLeft: 12, fontSize: 14, width: 36, opacity: 0.75}}>
                        {handleIcon(r, {
                            onClick: () => {
                                r._componentData = record;
                                onClick({
                                    action: r,
                                    record: record,
                                    props: parentProps,
                                    model: parentModel
                                })
                            }
                        })}
                    </span>
                </Tooltip>
            )
        })}
            <span style={{marginRight: 8}}/>
        </Space>)
}

const handleActionProps = ({props, model}: any) => ({
    key: 'action',
    title: '',
    width: '1%',
    align: 'right',
    render: (record: any) => {
        return model._disabled ? <></> : <Actions
            parentProps={props}
            parentModel={model}
            record={record}
        />
    }
});

export default handleActionProps;
