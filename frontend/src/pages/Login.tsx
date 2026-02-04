import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  Space,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Title, Text, Paragraph } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success('Login successful!');
      navigate('/');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || 'Login failed. Please try again.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 24,
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          borderRadius: 12,
        }}
        bordered={false}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <MedicineBoxOutlined
            style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }}
          />
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            CareLink
          </Title>
          <Text type="secondary">Insurance Eligibility Verification</Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Email address"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{ height: 44 }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div
          style={{
            background: '#f6f8fa',
            padding: 16,
            borderRadius: 8,
            marginTop: 16,
          }}
        >
          <Text type="secondary" style={{ fontSize: 12 }}>
            Demo Credentials:
          </Text>
          <Space direction="vertical" size={4} style={{ width: '100%', marginTop: 8 }}>
            <Text code style={{ fontSize: 12 }}>
              admin@carelink.demo / CareLink2024!
            </Text>
            <Text code style={{ fontSize: 12 }}>
              staff@carelink.demo / CareLink2024!
            </Text>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default Login;
