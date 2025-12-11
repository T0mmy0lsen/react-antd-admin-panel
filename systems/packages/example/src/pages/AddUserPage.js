import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Space, message } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { Section, Input, Select, Switch, TextArea, DatePicker, Post, Condition } from 'react-antd-admin-panel';
const { Title, Text } = Typography;
const API_URL = 'https://68b566a4e5dc090291aee28b.mockapi.io/api/v1/users';
function AddUserPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        avatar: '',
        role: 'user',
        active: true,
        bio: '',
        birthDate: null,
    });
    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const handleSubmit = async () => {
        if (!formData.name) {
            message.error('Please enter a name');
            return;
        }
        if (!formData.email) {
            message.error('Please enter an email');
            return;
        }
        setLoading(true);
        try {
            await new Post()
                .target(API_URL)
                .body({
                name: formData.name,
                email: formData.email,
                avatar: formData.avatar || 'https://avatars.githubusercontent.com/u/1?v=4',
                role: formData.role,
                active: formData.active,
                bio: formData.bio,
                birthDate: formData.birthDate?.toISOString(),
                createdAt: new Date().toISOString(),
            })
                .execute();
            message.success('User created successfully!');
            navigate('/users');
        }
        catch (error) {
            message.error('Failed to create user');
        }
        finally {
            setLoading(false);
        }
    };
    // Basic Info Section - demonstrates Input with icons
    const basicInfoSection = new Section()
        .card({ title: 'Basic Information' })
        .gutter(16)
        .row(true)
        .add(new Section()
        .col(12)
        .add(new Input()
        .key('name')
        .label('Full Name')
        .placeholder('Enter full name')
        .required(true)
        .prefix(_jsx(UserOutlined, {}))
        .onChange((value) => updateField('name', value))))
        .add(new Section()
        .col(12)
        .add(new Input()
        .key('email')
        .label('Email Address')
        .placeholder('user@example.com')
        .required(true)
        .type('email')
        .prefix(_jsx(MailOutlined, {}))
        .onChange((value) => updateField('email', value))));
    // Profile Section - demonstrates Select, DatePicker, Switch
    const profileSection = new Section()
        .card({ title: 'Profile Settings' })
        .gutter(16)
        .row(true)
        .add(new Section()
        .col(8)
        .add(new Select()
        .key('role')
        .label('Role')
        .placeholder('Select a role')
        .required(true)
        .options([
        { label: 'Administrator', value: 'admin' },
        { label: 'Regular User', value: 'user' },
        { label: 'Guest', value: 'guest' },
    ])
        .onChange((value) => updateField('role', Array.isArray(value) ? value[0] : value))))
        .add(new Section()
        .col(8)
        .add(new DatePicker()
        .key('birthDate')
        .label('Birth Date')
        .placeholder('Select date')
        .format('YYYY-MM-DD')
        .onChange((value) => updateField('birthDate', value))))
        .add(new Section()
        .col(8)
        .add(new Switch()
        .key('active')
        .label('Account Status')
        .checkedChildren('Active')
        .unCheckedChildren('Inactive')
        .value(true)
        .onChange((value) => updateField('active', value))));
    // Additional Info Section - demonstrates TextArea and Input with addon
    const additionalSection = new Section()
        .card({ title: 'Additional Information' })
        .gutter(16)
        .row(true)
        /*
        .add(
          new Section()
            .col(24)
            .add(
              new Input()
                .key('avatar')
                .label('Avatar URL')
                // .placeholder('https://example.com/avatar.jpg')
                .prefix(<LinkOutlined />)
                .allowClear(true)
                .onChange((value: string) => updateField('avatar', value))
            )
        )
        */
        .add(new Section()
        .col(24)
        .add(new TextArea()
        .key('bio')
        .label('Biography')
        .placeholder('Tell us about this user...')
        .maxLength(500)
        .showCount(true)
        .rows(4)
        .onChange((value) => updateField('bio', value))));
    // Conditional preview section - demonstrates Condition builder
    const previewSection = new Condition()
        .data(formData)
        .when((data) => data.name.length > 0 || data.email.length > 0, new Section()
        .card({ title: 'Preview' })
        .add(_jsxs(Space, { direction: "vertical", style: { width: '100%' }, children: [_jsxs(Text, { children: [_jsx("strong", { children: "Name:" }), " ", formData.name || '(not set)'] }), _jsxs(Text, { children: [_jsx("strong", { children: "Email:" }), " ", formData.email || '(not set)'] }), _jsxs(Text, { children: [_jsx("strong", { children: "Role:" }), " ", formData.role] }), _jsxs(Text, { children: [_jsx("strong", { children: "Status:" }), " ", formData.active ? 'Active' : 'Inactive'] })] }))
        .render())
        .otherwise(null);
    // Header section using Section builder
    const headerSection = new Section()
        .row(true)
        .justify('space-between')
        .align('middle')
        .style({ marginBottom: '16px', width: '100%' })
        .add(_jsx(Title, { level: 3, style: { margin: 0 }, children: "Add New User" }))
        .addRowEnd(_jsxs(Space, { children: [_jsx(Button, { icon: _jsx(ArrowLeftOutlined, {}), onClick: () => navigate('/users'), children: "Back to List" }), _jsx(Button, { type: "primary", icon: _jsx(SaveOutlined, {}), onClick: handleSubmit, loading: loading, children: "Save User" })] }));
    return (_jsxs("div", { children: [headerSection.render(), _jsxs(Space, { direction: "vertical", size: "middle", style: { width: '100%' }, children: [basicInfoSection.render(), profileSection.render(), additionalSection.render(), previewSection.render()] })] }));
}
export default AddUserPage;
