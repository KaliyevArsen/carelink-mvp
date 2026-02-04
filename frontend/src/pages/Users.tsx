import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Card,
  Table,
  Button,
  Typography,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Result,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  LockOutlined,
  UserOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface UserData {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'staff' | 'viewer';
  is_active: boolean;
  created_at: string;
  last_login: string | null;
}

const Users: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [form] = Form.useForm();

  // Only admins can access this page
  if (currentUser?.role !== 'admin') {
    return (
      <Result
        status="403"
        icon={<LockOutlined />}
        title="Access Denied"
        subTitle="Only administrators can manage users."
        extra={
          <Button type="primary" href="/">
            Go to Dashboard
          </Button>
        }
      />
    );
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await apiClient.get<UserData[]>('/users');
      setUsers(response.data);
    } catch (error) {
      message.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditUser = (user: UserData) => {
    setEditingUser(user);
    form.setFieldsValue({
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      is_active: user.is_active,
    });
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingUser) {
        // Update existing user
        await apiClient.patch(`/users/${editingUser.id}`, {
          email: values.email,
          full_name: values.full_name,
          role: values.role,
          is_active: values.is_active,
        });
        message.success('User updated successfully');
      } else {
        // Create new user
        await apiClient.post('/users', {
          email: values.email,
          password: values.password,
          full_name: values.full_name,
          role: values.role,
        });
        message.success('User created successfully');
      }
      setModalVisible(false);
      loadUsers();
    } catch (error: any) {
      message.error(error.response?.data?.detail || 'Operation failed');
    }
  };

  const getRoleTag = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'red',
      staff: 'blue',
      viewer: 'default',
    };
    return <Tag color={colors[role]}>{role.toUpperCase()}</Tag>;
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (name: string, record: UserData) => (
        <div>
          <Text strong>{name}</Text>
          {record.id === currentUser?.id && (
            <Tag color="green" style={{ marginLeft: 8 }}>
              You
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => getRoleTag(role),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'error'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Last Login',
      dataIndex: 'last_login',
      key: 'last_login',
      render: (date: string | null) =>
        date ? dayjs(date).format('MMM D, YYYY h:mm A') : 'Never',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: UserData) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEditUser(record)}
          disabled={record.id === currentUser?.id}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Manage Users
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateUser}>
          Add User
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </Card>

      <Modal
        title={editingUser ? 'Edit User' : 'Create New User'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="full_name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter full name' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="John Doe" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="user@example.com" />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please enter password' },
                { min: 12, message: 'Password must be at least 12 characters' },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Minimum 12 characters" />
            </Form.Item>
          )}

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role' }]}
            initialValue="staff"
          >
            <Select>
              <Select.Option value="admin">
                Admin - Full access, can manage users
              </Select.Option>
              <Select.Option value="staff">
                Staff - Can perform eligibility checks
              </Select.Option>
              <Select.Option value="viewer">
                Viewer - Can only view history
              </Select.Option>
            </Select>
          </Form.Item>

          {editingUser && (
            <Form.Item
              name="is_active"
              label="Status"
              initialValue={true}
            >
              <Select>
                <Select.Option value={true}>Active</Select.Option>
                <Select.Option value={false}>Inactive</Select.Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingUser ? 'Update User' : 'Create User'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
