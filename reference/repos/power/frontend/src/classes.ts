// classes.ts
export interface IModalState {
    footer?: React.ReactNode;
    key?: string | number;
    style?: React.CSSProperties;
    className?: string;
    closable?: boolean;
    title: string | React.ReactNode;
    section: any;
    visible?: boolean;
    mask?: boolean;
    maskClosable?: boolean;
    okText?: string | React.ReactNode;
    cancelText?: string | React.ReactNode;
    handleOk: () => void;
    handleCancel: () => void;
}

export interface ITransform {
    id: number
    value: any
    description: string
    source?: any,
    color?: any
}
export interface IActions {
    // columns
    id: number
    action: string
    name: string
    description: string
    class: string
    class_id: number
    deleted_at: string|null
    created_at: string|null
    updated_at: string|null
}

export interface IArea {
    // columns
    id: number
    name: string
    description: string
    identifier: string
    parent: number
    deleted_at: string|null
    created_at: string|null
    updated_at: string|null
}

export interface IValueBoolean {
    // columns
    id: number
    value_set_id: number
    value: string
    description: string
    deleted_at: string
    created_at: string
    updated_at: string
}

export interface IValue {
    // columns
    id: number,
    value_int: IValueInt,
    value_text: IValueText,
    value_datetime: IValueDatetime,
    value_boolean: IValueBoolean,
    value_option: IValueOption,
    value_set_id: number,
    value_set_type: string,
}

export interface IConfigs {
    // columns
    id: number
    config: string
    name: string
    description: string
    class_id: number
    class: string
    deleted_at: string|null
    created_at: string|null
    updated_at: string|null
    // relations
    inputs: IConfigsInput[]
    related_config: IFormularCreatorElementConfigs | IFormularCreatorConfigs;
}

export interface IConfigsInput {
    id: number
    input_value_id: number
    input_class_id: number
    input_value_set_id: number
    // relations
    input_value: IValue
    input_value_set: IValueSets
    input_class: IElementClass
    // Added by me
    related_input: IFormularCreatorElementConfigsInput | IFormularCreatorConfigsInput;
}

export interface IElementClass {
    // columns
    id: number
    class: string
    value_set_able: boolean
    deleted_at: string|null
    created_at: string|null
    updated_at: string|null
    // relations
    actions: IActions[]
    configs: IConfigs[]
}

export interface IFormularStateValue {
    // columns
    id: number,
    backendClass: string,
    config_id: number,
    formular_state_id: number
    value_id: number
    // relations
    value: IValue
    config: IConfigs,
}

export interface IFormularState {
    // columns
    id: number,
    backendClass: string,
    formular_creator_config_id: number|null,
    formular_creator_id: number
    formular_id: number
    state_value: IFormularStateValue[]
}

export interface IFormular {
    // columns
    id: number
    user_id: number
    formular_creator_id: number
    deleted_at: string|null
    created_at: string|null
    updated_at: string|null
    // relations
    formular_values: IFormularValue[]
    formular_creator: IFormularCreator
    formular_states: IFormularState[]
    triggers: IFormularTrigger[]
}

export interface IFormularCreator {
    // columns
    id: number
    name: string
    description: string
    deleted_at: string|null
    created_at: string|null
    updated_at: string|null
    // relations
    elements: IFormularCreatorElements[]
    formulars: IFormular[]
    formular_roles: IFormularCreatorRoles[]
    configs: IFormularCreatorConfigs[]
}

export interface IFormularCreatorConfigs {
    // columns
    id: number
    formular_creator_id: number
    config_id: number
    config_value_id: number
    deleted_at: string|null
    created_at: string|null
    updated_at: string|null
    // relations
    config: IConfigs
    inputs: IFormularCreatorConfigsInput[]
}

export interface IFormularCreatorConfigsInput {
    // columns
    id: number
    formular_creator_config_id: number
    configs_input_id: number
    value_id: number
    // relations
    configs_input: IConfigsInput
    value: IValue
}

export interface IFormularCreatorElementAccess {
    // columns
    id: number
    formular_creator_element_id: number
    formular_creator_id: number
    area_id: number
    role_id: number
    deleted_at: string|null
    created_at: string|null
    updated_at: string|null
    // relations
    role: IRole
    area: IArea
}

export interface IFormularCreatorElementActions {
    // columns
    id: number
    formular_creator_element_id: number
    formular_creator_id: number
    action_id: number
    action: string
    label: string
    deleted_at: string|null
    created_at: string|null
    updated_at: string|null
}

export interface IFormularCreatorElementConditionValue {
    // columns
    id: number
    element_id_condition: number
    element_id_target: number
    value_option_id: number
    deleted_at: string|null
    created_at: string|null
    updated_at: string|null
}

export interface IFormularCreatorElementConfigs {
    // columns
    id: number
    formular_creator_element_id: number
    config_id: number
    deleted_at: string|null
    created_at: string|null
    updated_at: string|null
    // relations
    config: IConfigs
    inputs: IFormularCreatorElementConfigsInput[]
}

export interface IFormularCreatorElementConfigsInput {
    // columns
    id: number
    element_config_id: number
    configs_input_id: number
    filter_id: number
    value_id: number
    // relations
    configs_input: IConfigsInput
    filter: IElementFilterValue
    value: IValue
}

export interface IFormularCreatorElements {
    // columns
    id: number
    name: string
    description: string|null
    class: string
    section: number
    group: number
    order: number
    formular_creator_id: number
    parent_id: number|null
    value_set_id: number
    deleted_at: string|null
    created_at: string|null
    updated_at: string|null
    // relations
    value_set: IValueSets
    elements: IFormularCreatorElements[]
    condition: IFormularCreatorElementConditionValue[]
    action: IFormularCreatorElementActions
    configs: IFormularCreatorElementConfigs[]
    access: IFormularCreatorElementAccess[]
}

export interface IFormularCreatorRoles {
    // columns
    id: number
    formular_creator_id: number
    area_id: number
    role_id: number
    deleted_at: string|null
    created_at: string|null
    updated_at: string|null
    // relations
    role: IRole
    area: IArea
}

export interface IFormularCreatorTriggers {
    // columns
    id: number
    name: string
    description: string
    formular_creator_id_when: number
    formular_creator_id_then: number
    deleted_at: string|null
    created_at: string|null
    updated_at: string|null
    // relations
    formular_then: IFormularCreator
    formular_when: IFormularCreator
}

export interface IFormularJobStatus {
    // columns
    id: number
    formular_id: number
    formular_creator_config_id: number
    config_id: number
    deleted_at: string|null
    created_at: string|null
    updated_at: string|null
}

export interface IFormularTrigger {
    // columns
    id: number
    formular_creator_trigger_id: number
    formular_id_when: number
    formular_id_then: number
    deleted_at: string|null
    created_at: string|null
    updated_at: string|null
    // relations
    trigger_creator: IFormularCreatorTriggers
}

export interface IFormularValue {
    // columns
    id: number
    formular_id: number
    formular_creator_id: number
    formular_creator_element_id: number
    // relations
    value: IValue
}

export interface IRole {
    // columns
    id: number
    name: string
    description: string
    deleted_at: string|null
    created_at: string|null
    updated_at: string|null
}

export interface IUser {
    // columns
    id: number
    name: string
    email: string
    email_verified_at: string|null
    password?: string
    remember_token?: string|null
    deleted_at: string|null
    created_at: string|null
    updated_at: string|null
    // relations
    roles: IUserRoles[]
}

export interface IUserRoles {
    // columns
    id: number
    user_id: number
    area_id: number
    role_id: number
    deleted_at: string|null
    created_at: string|null
    updated_at: string|null
    // relations
    area: IArea
    role: IRole
}

export interface IValueDatetime {
    // columns
    id: number
    value_set_id: number
    value: string
    deleted_at: string|null
    created_at: string|null
    updated_at: string|null
}

export interface IValueInt {
    // columns
    id: number
    value_set_id: number
    value: number
    deleted_at: string|null
    created_at: string|null
    updated_at: string|null
}

export interface IValueOption {
    // columns
    id: number
    value_set_id: number
    value: string
    description: string
    deleted_at: string
    created_at: string
    updated_at: string
    // relations
    fields: IValueOptionFields[]
}

export interface IValueOptionFields {
    // columns
    id: number
    value_option_id: number
    key: string
    value: string
    deleted_at: string|null
    created_at: string|null
    updated_at: string|null
}

export interface IValueSets {
    // columns
    id: number
    name: string
    description: string
    type: string
    system: boolean
    deleted_at: string|null
    created_at: string|null
    updated_at: string|null
    // relations
    headers: IValueSetsHeader[]
    collection: IValueOption[]
}

export interface IValueSetsHeader {
    // columns
    id: number
    value_set_id: number
    key: string
    value: string
    deleted_at: string|null
    created_at: string|null
    updated_at: string|null
}

export interface IValueText {
    // columns
    id: number
    value_set_id: number
    value: string
    deleted_at: string|null
    created_at: string|null
    updated_at: string|null
}

export interface IElementFilterValue {
    // columns
    id: number
    backendClass: string,
    filter_by_element_id: number,
    // filter_by_element: IFormularCreatorElements,
    filter_by_header_id: number,
    filter_by_header: IValueSetsHeader,
    target_element_id: number,
    // target_element: IFormularCreatorElements,
    target_header_id: number
    target_header: IValueSetsHeader
    deleted_at: string|null
    created_at: string|null
    updated_at: string|null
}

