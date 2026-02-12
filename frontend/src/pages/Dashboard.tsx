import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Typography,
  Button,
  Tag,
  Space,
  Spin,
  Empty,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { eligibilityApi } from '../api/eligibility';
import { EligibilityHistoryItem } from '../types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const [recentChecks, setRecentChecks] = useState<EligibilityHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    errors: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await eligibilityApi.getHistory({ limit: 10 });
      setRecentChecks(response.data);

      // Calculate stats from recent checks (in real app, would use dedicated endpoint)
      const activeCount = response.data.filter(
        (c) => c.response_data?.status === 'active'
      ).length;
      const inactiveCount = response.data.filter(
        (c) => c.response_data?.status === 'inactive'
      ).length;
      const errorCount = response.data.filter(
        (c) => c.response_data?.status === 'error' || c.response_data?.status === 'not_found'
      ).length;

      setStats({
        total: response.pagination.total,
        active: activeCount,
        inactive: inactiveCount,
        errors: errorCount,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Active
          </Tag>
        );
      case 'inactive':
        return (
          <Tag icon={<CloseCircleOutlined />} color="warning">
            Inactive
          </Tag>
        );
      case 'error':
      case 'not_found':
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            {status === 'not_found' ? 'Not Found' : 'Error'}
          </Tag>
        );
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    {
      title: 'Patient',
      key: 'patient',
      render: (_: any, record: EligibilityHistoryItem) => (
        <Text strong>
          {record.patient_first_name} {record.patient_last_name}
        </Text>
      ),
    },
    {
      title: 'Insurance',
      dataIndex: 'insurance_company',
      key: 'insurance_company',
      ellipsis: true,
    },
    {
      title: 'Member ID',
      dataIndex: 'member_id',
      key: 'member_id',
      width: 140,
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (_: any, record: EligibilityHistoryItem) =>
        getStatusTag(record.response_data?.status || 'error'),
    },
    {
      title: 'Time',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 140,
      render: (date: string) => dayjs(date).format('MMM D, h:mm A'),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

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
          Dashboard
        </Title>
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={() => navigate('/app/check')}
        >
          New Eligibility Check
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Checks"
              value={stats.total}
              prefix={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active (Recent)"
              value={stats.active}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Inactive (Recent)"
              value={stats.inactive}
              prefix={<CloseCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Errors (Recent)"
              value={stats.errors}
              prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Recent Eligibility Checks"
        style={{ marginTop: 24 }}
        extra={
          <Button type="link" onClick={() => navigate('/app/history')}>
            View All <ArrowRightOutlined />
          </Button>
        }
      >
        {recentChecks.length > 0 ? (
          <Table
            columns={columns}
            dataSource={recentChecks}
            rowKey="id"
            pagination={false}
            size="middle"
          />
        ) : (
          <Empty
            description="No eligibility checks yet"
            style={{ padding: 40 }}
          >
            <Button type="primary" onClick={() => navigate('/app/check')}>
              Perform First Check
            </Button>
          </Empty>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
