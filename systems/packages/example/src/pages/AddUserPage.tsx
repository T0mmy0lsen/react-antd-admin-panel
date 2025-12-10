import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Space, message } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { 
  Section, 
  Input, 
  Select, 
  Switch, 
  TextArea, 
  DatePicker,
  Post,
  Condition
} from 'react-antd-admin-panel';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const API_URL = 'https://68b566a4e5dc090291aee28b.mockapi.io/api/v1/users';

interface UserFormData {
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'user' | 'guest';
  active: boolean;
  bio: string;
  birthDate: dayjs.Dayjs | null;
}

function AddUserPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    avatar: '',
    role: 'user',
    active: true,
    bio: '',
    birthDate: null,
  });

  const updateField = <K extends keyof UserFormData>(field: K, value: UserFormData[K]) => {
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
    } catch (error) {
      message.error('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  // Basic Info Section - demonstrates Input with icons
  const basicInfoSection = new Section()
    .card({ title: 'Basic Information' })
    .gutter(16)
    .row(true)
    .add(
      new Section()
        .col(12)
        .add(
          new Input()
            .key('name')
            .label('Full Name')
            .placeholder('Enter full name')
            .required(true)
            .prefix(<UserOutlined />)
            .onChange((value: string) => updateField('name', value))
        )
    )
    .add(
      new Section()
        .col(12)
        .add(
          new Input()
            .key('email')
            .label('Email Address')
            .placeholder('user@example.com')
            .required(true)
            .type('email')
            .prefix(<MailOutlined />)
            .onChange((value: string) => updateField('email', value))
        )
    );

  // Profile Section - demonstrates Select, DatePicker, Switch
  const profileSection = new Section()
    .card({ title: 'Profile Settings' })
    .gutter(16)
    .row(true)
    .add(
      new Section()
        .col(8)
        .add(
          new Select<'admin' | 'user' | 'guest'>()
            .key('role')
            .label('Role')
            .placeholder('Select a role')
            .required(true)
            .options([
              { label: 'Administrator', value: 'admin' },
              { label: 'Regular User', value: 'user' },
              { label: 'Guest', value: 'guest' },
            ])
            .onChange((value: 'admin' | 'user' | 'guest') => updateField('role', value))
        )
    )
    .add(
      new Section()
        .col(8)
        .add(
          new DatePicker()
            .key('birthDate')
            .label('Birth Date')
            .placeholder('Select date')
            .format('YYYY-MM-DD')
            .onChange((value: dayjs.Dayjs | null) => updateField('birthDate', value))
        )
    )
    .add(
      new Section()
        .col(8)
        .add(
          new Switch()
            .key('active')
            .label('Account Status')
            .checkedChildren('Active')
            .unCheckedChildren('Inactive')
            .value(true)
            .onChange((value: boolean) => updateField('active', value))
        )
    );

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
    .add(
      new Section()
        .col(24)
        .add(
          new TextArea()
            .key('bio')
            .label('Biography')
            .placeholder('Tell us about this user...')
            .maxLength(500)
            .showCount(true)
            .rows(4)
            .onChange((value: string) => updateField('bio', value))
        )
    );

  // Conditional preview section - demonstrates Condition builder
  const previewSection = new Condition()
    .data(formData)
    .when(
      (data: UserFormData) => data.name.length > 0 || data.email.length > 0,
      new Section()
        .card({ title: 'Preview' })
        .add(
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text><strong>Name:</strong> {formData.name || '(not set)'}</Text>
            <Text><strong>Email:</strong> {formData.email || '(not set)'}</Text>
            <Text><strong>Role:</strong> {formData.role}</Text>
            <Text><strong>Status:</strong> {formData.active ? 'Active' : 'Inactive'}</Text>
          </Space>
        )
        .render()
    )
    .otherwise(null);

  // Header section using Section builder
  const headerSection = new Section()
    .row(true)
    .justify('space-between')
    .align('middle')
    .style({ marginBottom: '16px', width: '100%' })
    .add(<Title level={3} style={{ margin: 0 }}>Add New User</Title>)
    .addRowEnd(
      <Space>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/users')}>
          Back to List
        </Button>
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSubmit} loading={loading}>
          Save User
        </Button>
      </Space>
    );

  return (
    <div>
      {headerSection.render()}
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {basicInfoSection.render()}
        {profileSection.render()}
        {additionalSection.render()}
        {previewSection.render()}
      </Space>
    </div>
  );
}

export default AddUserPage;
