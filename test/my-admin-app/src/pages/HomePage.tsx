import { Typography, Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, FileOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function HomePage() {
  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Welcome to My Admin App</Title>
      <Paragraph type="secondary">
        Your admin panel is ready. Start building your application!
      </Paragraph>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Users"
              value={128}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Documents"
              value={42}
              prefix={<FileOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Completed"
              value={95}
              suffix="%"
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 24 }}>
        <Title level={4}>Getting Started</Title>
        <Paragraph>
          This project was created with <code>create-raap-app</code>. 
          Edit <code>src/App.tsx</code> to add more pages and configure your admin panel.
        </Paragraph>
        <Paragraph>
          Check out the <a href="/users">Users page</a> for an example of data fetching.
        </Paragraph>
      </Card>
    </div>
  );
}
