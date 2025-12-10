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
    .add(
      <Paragraph style={{ color: '#666', marginBottom: 0 }}>
        A modern TypeScript-first admin panel builder with Ant Design 6. 
        This example demonstrates the builder pattern for creating admin interfaces.
      </Paragraph>
    );

  // Feature cards using Section for grid layout
  const featureCards = new Section()
    .row(true)
    .gutter([16, 16])
    .add(
      new Section()
        .col(8)
        .add(
          <Link to="/users" style={{ textDecoration: 'none' }}>
            {new Section()
              .card({ hoverable: true })
              .add(
                <>
                  <UserOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '16px', display: 'block' }} />
                  <Title level={4}>User List</Title>
                  <Paragraph>
                    Uses <Text code>Loader</Text> for data fetching and <Text code>Condition</Text> for role-based rendering.
                  </Paragraph>
                </>
              )
              .render()}
          </Link>
        )
    )
    .add(
      new Section()
        .col(8)
        .add(
          <Link to="/users/add" style={{ textDecoration: 'none' }}>
            {new Section()
              .card({ hoverable: true })
              .add(
                <>
                  <PlusOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '16px', display: 'block' }} />
                  <Title level={4}>Add User</Title>
                  <Paragraph>
                    Demonstrates <Text code>Input</Text>, <Text code>Select</Text>, <Text code>DatePicker</Text>, <Text code>Switch</Text>, and <Text code>TextArea</Text> builders.
                  </Paragraph>
                </>
              )
              .render()}
          </Link>
        )
    )
    .add(
      new Section()
        .col(8)
        .add(
          new Section()
            .card({})
            .add(
              <>
                <ApiOutlined style={{ fontSize: '32px', color: '#722ed1', marginBottom: '16px', display: 'block' }} />
                <Title level={4}>API Integration</Title>
                <Paragraph>
                  Uses <Text code>Get</Text> and <Text code>Post</Text> HTTP builders with MockAPI endpoint.
                </Paragraph>
              </>
            )
            .render()
        )
    );

  // Features list using Section builder
  const featuresSection = new Section()
    .card({ 
      title: 'Features Demonstrated',
      style: { marginTop: 24 }
    })
    .row(true)
    .gutter([24, 16])
    .add(
      new Section()
        .col(8)
        .add(
          <>
            <BuildOutlined style={{ fontSize: 24, color: '#1890ff', marginBottom: 8, display: 'block' }} />
            <Title level={5}>Section Builder</Title>
            <ul style={{ paddingLeft: 20 }}>
              <li>Grid layout (row/col)</li>
              <li>Card/Modal/Drawer wrappers</li>
              <li>Responsive breakpoints</li>
              <li>Nested sections</li>
            </ul>
          </>
        )
    )
    .add(
      new Section()
        .col(8)
        .add(
          <>
            <FormOutlined style={{ fontSize: 24, color: '#52c41a', marginBottom: 8, display: 'block' }} />
            <Title level={5}>Form Controls</Title>
            <ul style={{ paddingLeft: 20 }}>
              <li>Input (text, email, password)</li>
              <li>Select (single, multiple, tags)</li>
              <li>DatePicker / RangePicker</li>
              <li>Switch, Checkbox, Radio</li>
              <li>TextArea with count</li>
            </ul>
          </>
        )
    )
    .add(
      new Section()
        .col(8)
        .add(
          <>
            <BranchesOutlined style={{ fontSize: 24, color: '#722ed1', marginBottom: 8, display: 'block' }} />
            <Title level={5}>Advanced Features</Title>
            <ul style={{ paddingLeft: 20 }}>
              <li>Condition (conditional rendering)</li>
              <li>Loader (data orchestration)</li>
              <li>HTTP builders (Get, Post)</li>
              <li>Lifecycle hooks</li>
            </ul>
          </>
        )
    );

  // Conditional advanced info - demonstrates Condition builder
  const advancedInfo = new Condition()
    .data(showAdvanced)
    .when(
      (show: boolean) => show,
      new Section()
        .card({ 
          title: 'Builder Pattern Benefits',
          style: { marginTop: 24 }
        })
        .add(
          <>
            <Paragraph>
              The builder pattern provides a fluent, chainable API for constructing UI components:
            </Paragraph>
            <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, overflow: 'auto' }}>
{`// Instead of complex JSX nesting:
const form = new Section()
  .card({ title: 'User Form' })
  .gutter(16)
  .row(true)
  .add(new Input().key('name').label('Name').required(true))
  .add(new Select().key('role').options([...]))
  .add(new Switch().key('active').label('Status'));

// Render anywhere
return form.render();`}
            </pre>
          </>
        )
        .render()
    )
    .otherwise(null);

  return (
    <div>
      {heroSection.render()}
      {featureCards.render()}
      {featuresSection.render()}
      
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Button 
          type="link" 
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Hide' : 'Show'} Builder Pattern Example
        </Button>
      </div>
      
      {advancedInfo.render()}
    </div>
  );
}

export default HomePage;
