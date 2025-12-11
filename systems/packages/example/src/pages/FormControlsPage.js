import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Typography, Button, message } from 'antd';
import { Section, Input, Select, Checkbox, CheckboxGroup, Radio, Switch, TextArea, DatePicker, RangePicker } from 'react-antd-admin-panel';
const { Title, Paragraph } = Typography;
/**
 * Form Controls Demo Page
 * Demonstrates all 7 form control builders
 */
function FormControlsPage() {
    const [formData, setFormData] = useState({
        text: '',
        password: '',
        number: '',
        email: '',
        country: '',
        tags: [],
        agree: false,
        features: [],
        gender: '',
        plan: 'basic',
        notifications: true,
        darkMode: false,
        bio: '',
        birthDate: null,
        dateRange: [null, null],
    });
    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    // 1. Input Builder Demo
    const inputSection = new Section()
        .card({ title: '1. Input Builder' })
        .gutter(16)
        .row(true)
        .add(new Section()
        .col(12)
        .add(new Input()
        .key('text')
        .label('Text Input')
        .placeholder('Enter some text...')
        .onChange((value) => updateField('text', value))))
        .add(new Section()
        .col(12)
        .add(new Input()
        .key('password')
        .label('Password Input')
        .type('password')
        .placeholder('Enter password')
        .onChange((value) => updateField('password', value))))
        .add(new Section()
        .col(12)
        .add(new Input()
        .key('number')
        .label('Number Input')
        .type('number')
        .placeholder('Enter a number')
        .onChange((value) => updateField('number', value))))
        .add(new Section()
        .col(12)
        .add(new Input()
        .key('email')
        .label('Email Input')
        .type('email')
        .placeholder('user@example.com')
        .required(true)
        .onChange((value) => updateField('email', value))));
    // 2. Select Builder Demo
    const selectSection = new Section()
        .card({ title: '2. Select Builder' })
        .gutter(16)
        .row(true)
        .add(new Section()
        .col(12)
        .add(new Select()
        .key('country')
        .label('Single Select')
        .placeholder('Select a country')
        .options([
        { label: 'United States', value: 'us' },
        { label: 'United Kingdom', value: 'uk' },
        { label: 'Germany', value: 'de' },
        { label: 'France', value: 'fr' },
        { label: 'Japan', value: 'jp' },
    ])
        .showSearch(true)
        .allowClear(true)
        .onChange((value) => updateField('country', Array.isArray(value) ? value[0] : value))))
        .add(new Section()
        .col(12)
        .add(new Select()
        .key('tags')
        .label('Multiple Select (Tags)')
        .placeholder('Select tags')
        .multiple()
        .options([
        { label: 'React', value: 'react' },
        { label: 'TypeScript', value: 'typescript' },
        { label: 'Ant Design', value: 'antd' },
        { label: 'Node.js', value: 'nodejs' },
        { label: 'GraphQL', value: 'graphql' },
    ])
        .onChange((value) => updateField('tags', Array.isArray(value) ? value : [value]))));
    // 3. Checkbox Builder Demo
    const checkboxSection = new Section()
        .card({ title: '3. Checkbox Builder' })
        .gutter(16)
        .row(true)
        .add(new Section()
        .col(12)
        .add(new Checkbox()
        .key('agree')
        .label('I agree to the terms and conditions')
        .onChange((value) => updateField('agree', value))))
        .add(new Section()
        .col(12)
        .add(new CheckboxGroup()
        .key('features')
        .label('Select Features')
        .options([
        { label: 'Email Notifications', value: 'email' },
        { label: 'SMS Alerts', value: 'sms' },
        { label: 'Push Notifications', value: 'push' },
    ])
        .onChange((value) => updateField('features', value))));
    // 4. Radio Builder Demo
    const radioSection = new Section()
        .card({ title: '4. Radio Builder' })
        .gutter(16)
        .row(true)
        .add(new Section()
        .col(12)
        .add(new Radio()
        .key('gender')
        .label('Gender')
        .options([
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
    ])
        .onChange((value) => updateField('gender', value))))
        .add(new Section()
        .col(12)
        .add(new Radio()
        .key('plan')
        .label('Subscription Plan')
        .optionType('button')
        .buttonStyle('solid')
        .options([
        { label: 'Basic', value: 'basic' },
        { label: 'Pro', value: 'pro' },
        { label: 'Enterprise', value: 'enterprise' },
    ])
        .defaultValue('basic')
        .onChange((value) => updateField('plan', value))));
    // 5. Switch Builder Demo
    const switchSection = new Section()
        .card({ title: '5. Switch Builder' })
        .gutter(16)
        .row(true)
        .add(new Section()
        .col(8)
        .add(new Switch()
        .key('notifications')
        .label('Enable Notifications')
        .checkedChildren('ON')
        .unCheckedChildren('OFF')
        .defaultValue(true)
        .onChange((value) => updateField('notifications', value))))
        .add(new Section()
        .col(8)
        .add(new Switch()
        .key('darkMode')
        .label('Dark Mode')
        .onChange((value) => updateField('darkMode', value))))
        .add(new Section()
        .col(8)
        .add(new Switch()
        .key('disabled')
        .label('Disabled Switch')
        .disabled(true)));
    // 6. TextArea Builder Demo
    const textAreaSection = new Section()
        .card({ title: '6. TextArea Builder' })
        .add(new TextArea()
        .key('bio')
        .label('Biography')
        .placeholder('Tell us about yourself...')
        .rows(4)
        .maxLength(500)
        .showCount(true)
        .onChange((value) => updateField('bio', value)));
    // 7. DatePicker Builder Demo
    const datePickerSection = new Section()
        .card({ title: '7. DatePicker Builder' })
        .gutter(16)
        .row(true)
        .add(new Section()
        .col(12)
        .add(new DatePicker()
        .key('birthDate')
        .label('Birth Date')
        .placeholder('Select date')
        .format('YYYY-MM-DD')
        .onChange((value) => updateField('birthDate', value))))
        .add(new Section()
        .col(12)
        .add(new RangePicker()
        .key('dateRange')
        .label('Date Range')
        .onChange((value) => {
        if (value)
            updateField('dateRange', value);
    })));
    // Form values display
    const valuesSection = new Section()
        .card({ title: 'Form Values (Live)' })
        .add(_jsx("pre", { style: {
            background: '#f5f5f5',
            padding: 16,
            borderRadius: 8,
            maxHeight: 400,
            overflow: 'auto',
            fontSize: 12
        }, children: JSON.stringify({
            ...formData,
            birthDate: formData.birthDate?.format('YYYY-MM-DD') || null,
            dateRange: formData.dateRange?.map(d => d?.format('YYYY-MM-DD') || null),
        }, null, 2) }));
    const handleSubmit = () => {
        message.success('Form submitted! Check console for values.');
        console.log('Form Data:', formData);
    };
    return (_jsxs("div", { style: { padding: 24 }, children: [_jsx(Title, { level: 2, children: "Form Controls Demo" }), _jsx(Paragraph, { type: "secondary", children: "Demonstrating all 7 form control builders: Input, Select, Checkbox, Radio, Switch, TextArea, and DatePicker" }), _jsxs("div", { style: { display: 'flex', gap: 24, marginTop: 24 }, children: [_jsxs("div", { style: { flex: 2 }, children: [inputSection.render(), _jsx("div", { style: { marginTop: 16 }, children: selectSection.render() }), _jsx("div", { style: { marginTop: 16 }, children: checkboxSection.render() }), _jsx("div", { style: { marginTop: 16 }, children: radioSection.render() }), _jsx("div", { style: { marginTop: 16 }, children: switchSection.render() }), _jsx("div", { style: { marginTop: 16 }, children: textAreaSection.render() }), _jsx("div", { style: { marginTop: 16 }, children: datePickerSection.render() }), _jsx("div", { style: { marginTop: 24 }, children: _jsx(Button, { type: "primary", size: "large", onClick: handleSubmit, children: "Submit Form" }) })] }), _jsx("div", { style: { flex: 1 }, children: _jsx("div", { style: { position: 'sticky', top: 24 }, children: valuesSection.render() }) })] })] }));
}
export default FormControlsPage;
