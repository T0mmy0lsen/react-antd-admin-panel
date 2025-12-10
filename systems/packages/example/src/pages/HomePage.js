import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Typography, Button } from 'antd';
import { UserOutlined, PlusOutlined, ApiOutlined, BuildOutlined, FormOutlined, BranchesOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Section, Condition } from 'react-antd-admin-panel';
import { useState } from 'react';
const { Title, Paragraph, Text } = Typography;
function HomePage() {
    const [showAdvanced, setShowAdvanced] = useState(false);
    // Hero section using Section builder with card
    const heroSection = new Section()
        .card({
        title: 'Welcome to React Antd Admin Panel v2',
        style: { marginBottom: 24 }
    })
        .add(_jsx(Paragraph, { style: { color: '#666', marginBottom: 0 }, children: "A modern TypeScript-first admin panel builder with Ant Design 6. This example demonstrates the builder pattern for creating admin interfaces." }));
    // Feature cards using Section for grid layout
    const featureCards = new Section()
        .row(true)
        .gutter([16, 16])
        .add(new Section()
        .col(8)
        .add(_jsx(Link, { to: "/users", style: { textDecoration: 'none' }, children: new Section()
            .card({ hoverable: true })
            .add(_jsxs(_Fragment, { children: [_jsx(UserOutlined, { style: { fontSize: '32px', color: '#1890ff', marginBottom: '16px', display: 'block' } }), _jsx(Title, { level: 4, children: "User List" }), _jsxs(Paragraph, { children: ["Uses ", _jsx(Text, { code: true, children: "Loader" }), " for data fetching and ", _jsx(Text, { code: true, children: "Condition" }), " for role-based rendering."] })] }))
            .render() })))
        .add(new Section()
        .col(8)
        .add(_jsx(Link, { to: "/users/add", style: { textDecoration: 'none' }, children: new Section()
            .card({ hoverable: true })
            .add(_jsxs(_Fragment, { children: [_jsx(PlusOutlined, { style: { fontSize: '32px', color: '#52c41a', marginBottom: '16px', display: 'block' } }), _jsx(Title, { level: 4, children: "Add User" }), _jsxs(Paragraph, { children: ["Demonstrates ", _jsx(Text, { code: true, children: "Input" }), ", ", _jsx(Text, { code: true, children: "Select" }), ", ", _jsx(Text, { code: true, children: "DatePicker" }), ", ", _jsx(Text, { code: true, children: "Switch" }), ", and ", _jsx(Text, { code: true, children: "TextArea" }), " builders."] })] }))
            .render() })))
        .add(new Section()
        .col(8)
        .add(new Section()
        .card({})
        .add(_jsxs(_Fragment, { children: [_jsx(ApiOutlined, { style: { fontSize: '32px', color: '#722ed1', marginBottom: '16px', display: 'block' } }), _jsx(Title, { level: 4, children: "API Integration" }), _jsxs(Paragraph, { children: ["Uses ", _jsx(Text, { code: true, children: "Get" }), " and ", _jsx(Text, { code: true, children: "Post" }), " HTTP builders with MockAPI endpoint."] })] }))
        .render()));
    // Features list using Section builder
    const featuresSection = new Section()
        .card({
        title: 'Features Demonstrated',
        style: { marginTop: 24 }
    })
        .row(true)
        .gutter([24, 16])
        .add(new Section()
        .col(8)
        .add(_jsxs(_Fragment, { children: [_jsx(BuildOutlined, { style: { fontSize: 24, color: '#1890ff', marginBottom: 8, display: 'block' } }), _jsx(Title, { level: 5, children: "Section Builder" }), _jsxs("ul", { style: { paddingLeft: 20 }, children: [_jsx("li", { children: "Grid layout (row/col)" }), _jsx("li", { children: "Card/Modal/Drawer wrappers" }), _jsx("li", { children: "Responsive breakpoints" }), _jsx("li", { children: "Nested sections" })] })] })))
        .add(new Section()
        .col(8)
        .add(_jsxs(_Fragment, { children: [_jsx(FormOutlined, { style: { fontSize: 24, color: '#52c41a', marginBottom: 8, display: 'block' } }), _jsx(Title, { level: 5, children: "Form Controls" }), _jsxs("ul", { style: { paddingLeft: 20 }, children: [_jsx("li", { children: "Input (text, email, password)" }), _jsx("li", { children: "Select (single, multiple, tags)" }), _jsx("li", { children: "DatePicker / RangePicker" }), _jsx("li", { children: "Switch, Checkbox, Radio" }), _jsx("li", { children: "TextArea with count" })] })] })))
        .add(new Section()
        .col(8)
        .add(_jsxs(_Fragment, { children: [_jsx(BranchesOutlined, { style: { fontSize: 24, color: '#722ed1', marginBottom: 8, display: 'block' } }), _jsx(Title, { level: 5, children: "Advanced Features" }), _jsxs("ul", { style: { paddingLeft: 20 }, children: [_jsx("li", { children: "Condition (conditional rendering)" }), _jsx("li", { children: "Loader (data orchestration)" }), _jsx("li", { children: "HTTP builders (Get, Post)" }), _jsx("li", { children: "Lifecycle hooks" })] })] })));
    // Conditional advanced info - demonstrates Condition builder
    const advancedInfo = new Condition()
        .data(showAdvanced)
        .when((show) => show, new Section()
        .card({
        title: 'Builder Pattern Benefits',
        style: { marginTop: 24 }
    })
        .add(_jsxs(_Fragment, { children: [_jsx(Paragraph, { children: "The builder pattern provides a fluent, chainable API for constructing UI components:" }), _jsx("pre", { style: { background: '#f5f5f5', padding: 16, borderRadius: 8, overflow: 'auto' }, children: `// Instead of complex JSX nesting:
const form = new Section()
  .card({ title: 'User Form' })
  .gutter(16)
  .row(true)
  .add(new Input().key('name').label('Name').required(true))
  .add(new Select().key('role').options([...]))
  .add(new Switch().key('active').label('Status'));

// Render anywhere
return form.render();` })] }))
        .render())
        .otherwise(null);
    return (_jsxs("div", { children: [heroSection.render(), featureCards.render(), featuresSection.render(), _jsx("div", { style: { marginTop: 24, textAlign: 'center' }, children: _jsxs(Button, { type: "link", onClick: () => setShowAdvanced(!showAdvanced), children: [showAdvanced ? 'Hide' : 'Show', " Builder Pattern Example"] }) }), advancedInfo.render()] }));
}
export default HomePage;
