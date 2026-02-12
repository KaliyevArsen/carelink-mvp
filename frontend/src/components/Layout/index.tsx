import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Layout as AntLayout,
  Menu,
  Avatar,
  Dropdown,
  Typography,
  Space,
  Tag,
} from 'antd';
import {
  DashboardOutlined,
  SearchOutlined,
  HistoryOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = AntLayout;
const { Text } = Typography;

const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Role-based menu items
  const getMenuItems = (): MenuProps['items'] => {
    const items: MenuProps['items'] = [
      {
        key: '/app',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
      },
    ];

    // Only Admin and Staff can perform eligibility checks
    if (user?.role === 'admin' || user?.role === 'staff') {
      items.push({
        key: '/app/check',
        icon: <SearchOutlined />,
        label: 'Check Eligibility',
      });
    }

    // All roles can view history
    items.push({
      key: '/app/history',
      icon: <HistoryOutlined />,
      label: 'History',
    });

    // Only Admin can manage users
    if (user?.role === 'admin') {
      items.push({
        key: '/app/users',
        icon: <TeamOutlined />,
        label: 'Manage Users',
      });
    }

    return items;
  };

  const menuItems = getMenuItems();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'red';
      case 'staff': return 'blue';
      case 'viewer': return 'default';
      default: return 'default';
    }
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        style={{
          boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
          zIndex: 10,
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Text
            strong
            style={{
              fontSize: collapsed ? 16 : 20,
              color: '#1890ff',
              transition: 'font-size 0.2s',
            }}
          >
            {collapsed ? 'CL' : 'CareLink'}
          </Text>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0, marginTop: 8 }}
        />
      </Sider>
      <AntLayout>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            zIndex: 9,
          }}
        >
          <div
            onClick={() => setCollapsed(!collapsed)}
            style={{
              cursor: 'pointer',
              fontSize: 18,
              padding: '0 12px',
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
          <Space size="middle">
            <Text type="secondary" style={{ fontSize: 13 }}>
              {user?.organization.name}
            </Text>
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  style={{ backgroundColor: '#1890ff' }}
                  icon={<UserOutlined />}
                />
                <div>
                  <Text>{user?.full_name}</Text>
                  <Tag color={getRoleColor(user?.role || '')} style={{ marginLeft: 8 }}>
                    {user?.role?.toUpperCase()}
                  </Tag>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: 24,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
