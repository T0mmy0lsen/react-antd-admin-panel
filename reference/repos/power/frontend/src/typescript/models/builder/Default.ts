import Get from "../Get";
import Section from "./Section";
import Formula from "../Formula";
import Action from "../Action";
import Main from "../../main";
import ItemValue from "./ItemValue";
import {IValueOption} from "../../../classes";

export default class Default {

    // -----------------------------------------------------------------------------------------------------------------

    defaultHasValue: any = () => {};

    // -----------------------------------------------------------------------------------------------------------------

    _saveState: any;
    _componentIsBuild: boolean = false;

    _hidden: boolean = false;
    hidden() {
        this._hidden = true;
        return this;
    }

    _history: any = {};
    _historyFirstKey: any;

    history(v: any) {
        let key = Math.round(Math.random() * 10000);
        this._history[key] = { success: false, completed: false, value: v };
        return key;
    }

    getFieldByClass(v: string) {
        return this._fields.find(r => r._class === v);
    }

    // What should happen to the .tsx once your /view/*.tsx calls the function.
    // This is basically the .tsx's action-interface.
    onHandleAdd: any = () => {};
    onHandleClear: any = () => {};
    onHandleReset: any = () => {};
    onHandleChange: any = () => {};
    onHandleSearch: any = () => {};
    onHandleToggle: any = () => {};
    onHandleLoading: any = () => {};

    /** */

    tsxSetSuccess: any = () => { console.log('[UNSET] tsxSetSuccess') };
    tsxSetError: any = () => { console.log('[UNSET] tsxSetError') };
    tsxHistoryRevert: any = () => { console.log('[UNSET] tsxHistoryRevert') };
    tsxSetDisabled: any = () => { console.log('[UNSET] tsxSetDisabled') };
    tsxSetLoading: any = () => { console.log('[UNSET] tsxSetLoading') };
    tsxSetFields: any = (fields: IValueOption[]) => {

        // console.log('Default: tsxSetFields: value.', this._value)
        // console.log('Default: tsxSetFields: value not in fields.', fields)

        this._fields = [];
        this.addMore(fields);

        // Reset the value if the current value is not in the new fields
        if (this._value && !this._fields.find((v: ItemValue) => v.getId() === this._value.getId())) {
            this._value = new ItemValue();
        }

        // If there is only one field, set the value to that field
        if (this._fields.length === 1) {
            this._value = this._fields[0];
        }

        this.tsxSetFieldsExtend(fields);
    };
    tsxSetFieldsExtend: any = () => { console.log('[UNSET] tsxSetFieldsExtend') };
    tsxSetValue: any = () => { console.log('[UNSET] tsxSetValue') };
    tsxRefresh: any = () => { console.log('[UNSET] tsxRefresh') };
    tsxAddMore: any = () => { console.log('[UNSET] tsxAddMore') };
    tsxClear: any = () => { console.log('[UNSET] tsxClear') };

    /** */

    _call: any = {};
    call(key: string, v: any) { this._call[key] = v; return this; }

    _alter: any;
    alter(v: any) { this._alter = v; return this; }

    _useCache: any = false;
    useCache(v: any) { this._useCache = v; return this; }

    // When triggering any onChange in the containing Fields, this class, e.g. Tree or List, will trigger its onChange.
    // This class' onChange method may use the filters from the Fields as it wants.
    _filter: any;
    filter(filter: any) { this._filter = filter; return this; }
    filters(): any[] { return this.filterModels(this._filter, []) }

    // This class may call the edit function and in return get a section.
    _editFunction: any;
    edit(edit: any) { this._editFunction = edit; return this; }
    editBuild(node: any, next: (section: Section) => void, main: Main, model: any) {
        this._editFunction?.(node, next, main, model);
    }

    // This class may call the show function and in return get a section.
    _showFunction: any;
    show(show: any) { this._showFunction = show; return this; }
    showBuild(node: any, next: (section: Section) => void, main: Main) {
        this._showFunction?.(node, next, main);
    }

    _filterFunction: any = () => false;
    filterFunction(func: any) { this._filterFunction = func; return this; }

    _ref: any;
    ref(ref: any) { this._ref = ref; return this; }

    _key: any;
    key(key: any) {
        this._key = key;
        return this;
    }

    _index: any;
    index(index: any) { this._index = index; return this; }

    _style: any;
    style(v: any) { this._style = v; return this; }

    _styleForm: any;
    styleForm(v: any) { this._styleForm = v; return this; }

    _access: boolean = true;
    access(access: any) { this._access = access; return this; }

    _accessLevel: any;
    accessLevel(feature: string, level: number) { this._accessLevel = { feature: feature, level: level }; return this; }

    _label: any;
    label(label: string) { this._label = label; return this; }

    _required: boolean = false;
    required(v: any) { this._required = !!v; return this; }

    _disabled: boolean = false;
    disabled(v: any) { this._disabled = !!v; return this; }

    _readOnly: boolean = false;
    readOnly(v?: boolean) { this._readOnly = !!v; return this; }

    _fields: any[] = [];
    _fieldsOriginal: any[] = [];
    add(v: any) { this._fields.push(v); return this; }
    addMore(v: any[]) { v.forEach((r: any) => this._fields.push(r)); return this; }

    _addMoreOverwriteItemsFunction: any;
    addMoreOverwriteItems(v: any) {
        this._addMoreOverwriteItemsFunction = v;
        this._fields.forEach((r: any) => {
            v(r);
        })
        return this;
    }

    // Set a formula if the model should be wrapped in a Form-field.
    // Any children will point to the same formula.
    _formula: any;
    _formulaIsRoot: any;
    formula(formula: Formula, root?: boolean) {
        this._formula = formula;
        this._formulaIsRoot = root ?? false;
        return this;
    }

    formulaSetChildren(formula?: Formula | any) {
        this._formula = this._formula ?? formula;
        // this._formula?.register(this);
        this._action?.formula(this._formula);
        this._fields.forEach((field: any) => { if (!field._formulaIsRoot) field.formulaSetChildren?.(this._formula) });
    }

    // Send values to the formula.
    value(value: any) { this.formulaValue(value) }
    params() { return this.formulaParams() }
    paramsRaw() { return this.formulaParamsRaw() }
    formulaValue(value: any) { this._formula.value(this, value); }
    formulaParams() { return this._formula.params() }
    formulaParamsRaw() { return this._formula.paramsRaw() }

    // Points to the Section it was created by.
    _section: any;
    section(section: Section) {
        this._section = section;
        this._action?.section(this._section);
        this._fields.forEach((field: any) => field.bindSection?.(this._section));
    }

    _get: any;
    _getFunction: any;
    // (1) Set and do nothing.
    setGet(v: (args?: any) => Get, args?: any) { return this.get(v, args) }
    get(func: (args?: any) => Get, args?: any) {
        this._getFunction = func;
        this._get = func(args);
        return this;
    }

    // (2) Set and run the Get
    fetch(func: (args?: any) => Get, args?: any) {
        this._getFunction = func;
        this.refresh(args);
        return this;
    }

    // (3) Run a Get that is already set
    refresh(args?: any, callback?: any) {
        this._get = args ? this._getFunction(args) : this._getFunction();
        // TODO: Both the GET and the calling COMPONENT should be able to call _onComplete.
        // Right now its just the calling COMPONENT, e.g. the button that set the _onComplete.
        // The button.tsx may use this to toggle its loading state.
        this._get.onComplete(this._onComplete);
        this._get.onError(this._onError);
        this._get.parent(this);
        this._get.get(args, callback);
        return this;
    }

    refreshWithoutGetCall(args: any) {
        this._get.onComplete(this._onComplete);
        this._get.onError(this._onError);
        this._get.finalize(args);
        return this;
    }

    refreshWithoutFunctionCall(args?: any) {
        this._get.onComplete(this._onComplete);
        this._get.onError(this._onError);
        this._get.get(args);
        return this;
    }

    _action: any;
    action(action: Action) { this._action = action; return this; }

    // Some function to format the value before we return it.
    _format: (value: any) => any = (value: any) => value;
    format(func: (args?: any) => any) { this._format = func; return this; }
    formatValue(value: any) { return this._format(value) }

    // The Parent *.tsx-component should set this.
    _update: any = () => { console.log('Update not implemented') };
    update(func: (args?: any) => void) { this._update = func; return this; }

    _onComplete: any = () => {};
    // For both Error and Complete, these are called by the binding Post or Get.
    _onError: any = () => {};
    // These are called by the .tsx, implemented in the /view/*.tsx
    _onClick: any = () => {};
    _onChange: any = undefined;
    _onChangeNext: any = undefined;
    _onAfterChange: any = () => {};
    _onChangeSelect: any = () => {};

    _onClear: any = () => {};
    onClear(func: any) { this._onClear = func; return this; }

    _onDelete: any = () => {};
    onDelete(func: any) { this._onDelete = func; return this; }

    onAfterChange(func: any, index?: number) { this._onAfterChange = func; this.index(index); return this; }
    onChangeSelect(func: any) { this._onChangeSelect = func; return this; }
    onComplete(func: any) { this._onComplete = func; return this; }
    onChange(func: any) { this._onChange = func; return this; }
    onChangeNext(func: any, index?: number) { this._onChangeNext = func; this.index(index); return this; }
    onClick(func: any) { this._onClick = func; return this; }
    onError(func: any) { this._onError = func; return this; }

    // Any data we got back from the Action or Get can be placed her if needed.
    _data: any = undefined;
    data(data: any) { this._data = data; return this; }

    _size: number = 24;
    size(size: number) { this._size = size; return this; }

    _sizeString: 'small' | 'middle' | 'large' | undefined = 'large';
    sizeString(sizeString: 'small' | 'middle' | 'large' | undefined) { this._sizeString = sizeString; return this; }

    _clearable: boolean = true;
    clearable(v: boolean) { this._clearable = v; return this; }

    _ignoreOnChange: any = false;
    ignoreOnChange(v: boolean) { this._ignoreOnChange = v; return this; }

    _ignoreSetState: any = false;
    ignoreSetState(v: boolean) { this._ignoreSetState = v; return this; }

    _design: any = false;
    design(v: any) { this._design = v; return this; }

    _width: any = '100%';
    width(width: number) { this._width = width; return this; }

    _component: any;
    _componentArgs: any;
    component(component: any, args: any) {
        this._component = component;
        this._componentArgs = args;
        return this;
    }

    defaultFromCache() {
        let store = window.localStorage.getItem(`${this._class.toLowerCase()}:${this._key}`);
        return this;
    }

    filterModels(el: any, filters: any = []) {
        if (!el) return filters;
        el._fields.forEach((r: any) => {
            filters.push(r);
            this.filterModels(r, filters);
        })
        return filters;
    }

    _default: any;
    _defaultObject: any;
    default(v: any) {
        this._default = v;
        this._defaultObject = v;
        return this;
    }

    // -----------------------------------------------------------------------------------------------------------------

    // Set the ItemValue.
    // Classes like Autocomplete will provide its own ItemValue by calling this from its .tsx-component.
    setObject(v: ItemValue) {
        this._value = v;
        if (this._formula) this._formula.value(this);
        this.defaultHasValue(this._value.hasValue())
        return this;
    }

    // Set the value on the ItemValue.
    // This is used by the Input, since its value is just text.
    // This is called from the Input.tsx.
    setValue(v: any) {
        this._value._value = v;
        if (this._formula) this._formula.value(this);
        return this;
    }

    clearValue() {
        this._value = new ItemValue();
        if (this._formula) this._formula.value(this);
    }

    setValues(v: any[]) {
        this._values = v.map((r: any) => {
            let item = new ItemValue()
            item.getFormsValue = () => r;
            item._value = r;
            return item;
        });
        if (this._formula) this._formula.values(this);
        return this;
    }

    getDescription() {
        return this._value.getDescription();
    }

    getValue() {
        return this._value.getValue();
    }

    getId() {
        return this._value.getId();
    }

    // Set the tsx-class and a default ItemValue.
    // The default ItemValue is used by the Input, since its value is just text.
    // Other classes, e.g. Autocomplete will provide its own ItemValue through the default() method.
    _value: ItemValue;
    _values: ItemValue[];
    _class: string = 'undefined';
    constructor(_class?: string) {
        if (_class) this._class = _class;
        this._value = new ItemValue();
        this._values = [];
    }
}