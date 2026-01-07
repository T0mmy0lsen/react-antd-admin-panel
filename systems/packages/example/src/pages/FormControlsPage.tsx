import { useState } from 'react';
import { Typography, Button, message } from 'antd';
import { 
  Section, 
  Input, 
  Select, 
  Checkbox,
  CheckboxGroup,
  Radio, 
  Switch, 
  TextArea, 
  DatePicker,
  RangePicker
} from 'react-antd-admin-panel';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;

interface FormData {
  // Input examples
  text: string;
  password: string;
  number: string;
  email: string;
  
  // Select
  country: string;
  tags: string[];
  
  // Checkbox
  agree: boolean;
  features: string[];
  
  // Radio
  gender: string;
  plan: string;
  
  // Switch
  notifications: boolean;
  darkMode: boolean;
  
  // TextArea
  bio: string;
  
  // DatePicker
  birthDate: dayjs.Dayjs | null;
  dateRange: [dayjs.Dayjs | null, dayjs.Dayjs | null];
}

/**
 * Form Controls Demo Page
 * Demonstrates all 7 form control builders
 */
function FormControlsPage() {
  const [formData, setFormData] = useState<FormData>({
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

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 1. Input Builder Demo
  const inputSection = new Section()
    .card({ title: '1. Input Builder' })
    .gutter(16)
    .row(true)
    .add(
      new Section()
        .col(12)
        .add(
          new Input()
            .key('text')
            .label('Text Input')
            .placeholder('Enter some text...')
            .onChange((value: string) => updateField('text', value))
        )
    )
    .add(
      new Section()
        .col(12)
        .add(
          new Input()
            .key('password')
            .label('Password Input')
            .type('password')
            .placeholder('Enter password')
            .onChange((value: string) => updateField('password', value))
        )
    )
    .add(
      new Section()
        .col(12)
        .add(
          new Input()
            .key('number')
            .label('Number Input')
            .type('number')
            .placeholder('Enter a number')
            .onChange((value: string) => updateField('number', value))
        )
    )
    .add(
      new Section()
        .col(12)
        .add(
          new Input()
            .key('email')
            .label('Email Input')
            .type('email')
            .placeholder('user@example.com')
            .required(true)
            .onChange((value: string) => updateField('email', value))
        )
    );

  // 2. Select Builder Demo
  const selectSection = new Section()
    .card({ title: '2. Select Builder' })
    .gutter(16)
    .row(true)
    .add(
      new Section()
        .col(12)
        .add(
          new Select<string>()
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
            .onChange((value) => updateField('country', Array.isArray(value) ? value[0] : value))
        )
    )
    .add(
      new Section()
        .col(12)
        .add(
          new Select<string>()
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
            .onChange((value) => updateField('tags', Array.isArray(value) ? value : [value]))
        )
    );

  // 3. Checkbox Builder Demo
  const checkboxSection = new Section()
    .card({ title: '3. Checkbox Builder' })
    .gutter(16)
    .row(true)
    .add(
      new Section()
        .col(12)
        .add(
          new Checkbox()
            .key('agree')
            .label('I agree to the terms and conditions')
            .onChange((value: boolean) => updateField('agree', value))
        )
    )
    .add(
      new Section()
        .col(12)
        .add(
          new CheckboxGroup()
            .key('features')
            .label('Select Features')
            .options([
              { label: 'Email Notifications', value: 'email' },
              { label: 'SMS Alerts', value: 'sms' },
              { label: 'Push Notifications', value: 'push' },
            ])
            .onChange((value: (string | number)[]) => updateField('features', value as string[]))
        )
    );

  // 4. Radio Builder Demo
  const radioSection = new Section()
    .card({ title: '4. Radio Builder' })
    .gutter(16)
    .row(true)
    .add(
      new Section()
        .col(12)
        .add(
          new Radio()
            .key('gender')
            .label('Gender')
            .options([
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
              { label: 'Other', value: 'other' },
            ])
            .onChange((value: string) => updateField('gender', value))
        )
    )
    .add(
      new Section()
        .col(12)
        .add(
          new Radio()
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
            .onChange((value: string) => updateField('plan', value))
        )
    );

  // 5. Switch Builder Demo
  const switchSection = new Section()
    .card({ title: '5. Switch Builder' })
    .gutter(16)
    .row(true)
    .add(
      new Section()
        .col(8)
        .add(
          new Switch()
            .key('notifications')
            .label('Enable Notifications')
            .checkedChildren('ON')
            .unCheckedChildren('OFF')
            .defaultValue(true)
            .onChange((value: boolean) => updateField('notifications', value))
        )
    )
    .add(
      new Section()
        .col(8)
        .add(
          new Switch()
            .key('darkMode')
            .label('Dark Mode')
            .onChange((value: boolean) => updateField('darkMode', value))
        )
    )
    .add(
      new Section()
        .col(8)
        .add(
          new Switch()
            .key('disabled')
            .label('Disabled Switch')
            .disabled(true)
        )
    );

  // 6. TextArea Builder Demo
  const textAreaSection = new Section()
    .card({ title: '6. TextArea Builder' })
    .add(
      new TextArea()
        .key('bio')
        .label('Biography')
        .placeholder('Tell us about yourself...')
        .rows(4)
        .maxLength(500)
        .showCount(true)
        .onChange((value: string) => updateField('bio', value))
    );

  // 7. DatePicker Builder Demo
  const datePickerSection = new Section()
    .card({ title: '7. DatePicker Builder' })
    .gutter(16)
    .row(true)
    .add(
      new Section()
        .col(12)
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
        .col(12)
        .add(
          new RangePicker()
            .key('dateRange')
            .label('Date Range')
            .onChange((value: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
              if (value) updateField('dateRange', value);
            })
        )
    );

  // Form values display
  const valuesSection = new Section()
    .card({ title: 'Form Values (Live)' })
    .add(
      <pre style={{ 
        background: '#f5f5f5', 
        padding: 16, 
        borderRadius: 8,
        maxHeight: 400,
        overflow: 'auto',
        fontSize: 12
      }}>
        {JSON.stringify({
          ...formData,
          birthDate: formData.birthDate?.format('YYYY-MM-DD') || null,
          dateRange: formData.dateRange?.map(d => d?.format('YYYY-MM-DD') || null),
        }, null, 2)}
      </pre>
    );

  const handleSubmit = () => {
    message.success('Form submitted! Check console for values.');
    console.log('Form Data:', formData);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Form Controls Demo</Title>

      <Paragraph type="secondary">
        Demonstrating all 7 form control builders: Input, Select, Checkbox, Radio, Switch, TextArea, and DatePicker
      </Paragraph>

      <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
        <div style={{ flex: 2 }}>
          {inputSection.render()}
          <div style={{ marginTop: 16 }}>{selectSection.render()}</div>
          <div style={{ marginTop: 16 }}>{checkboxSection.render()}</div>
          <div style={{ marginTop: 16 }}>{radioSection.render()}</div>
          <div style={{ marginTop: 16 }}>{switchSection.render()}</div>
          <div style={{ marginTop: 16 }}>{textAreaSection.render()}</div>
          <div style={{ marginTop: 16 }}>{datePickerSection.render()}</div>
          
          <div style={{ marginTop: 24 }}>
            <Button type="primary" size="large" onClick={handleSubmit}>
              Submit Form
            </Button>
          </div>
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ position: 'sticky', top: 24 }}>
            {valuesSection.render()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormControlsPage;
