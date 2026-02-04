import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Table,
  Typography,
  Tag,
  Input,
  DatePicker,
  Space,
  Button,
  Modal,
  Descriptions,
  Row,
  Col,
  Spin,
} from 'antd';
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { eligibilityApi } from '../api/eligibility';
import { EligibilityHistoryItem, PaginationInfo } from '../types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const History: React.FC = () => {
  const [data, setData] = useState<EligibilityHistoryItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null
  );
  const [selectedCheck, setSelectedCheck] = useState<EligibilityHistoryItem | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);

  const loadHistory = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: pagination.limit,
      };

      if (dateRange) {
        params.start_date = dateRange[0].format('YYYY-MM-DD');
        params.end_date = dateRange[1].format('YYYY-MM-DD');
      }

      const response = await eligibilityApi.getHistory(params);
      setData(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange, pagination.limit]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleTableChange = (newPagination: any) => {
    loadHistory(newPagination.current);
  };

  const handleDateRangeChange = (dates: any) => {
    setDateRange(dates);
  };

  const handleSearch = () => {
    loadHistory(1);
  };

  const handleViewDetails = (record: EligibilityHistoryItem) => {
    setSelectedCheck(record);
    setModalVisible(true);
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
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Error
          </Tag>
        );
      case 'not_found':
        return (
          <Tag icon={<CloseCircleOutlined />} color="default">
            Not Found
          </Tag>
        );
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 160,
      render: (date: string) => dayjs(date).format('MMM D, YYYY h:mm A'),
    },
    {
      title: 'Patient',
      key: 'patient',
      render: (_: any, record: EligibilityHistoryItem) => (
        <div>
          <Text strong>
            {record.patient_first_name} {record.patient_last_name}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            DOB: {dayjs(record.patient_dob).format('MM/DD/YYYY')}
          </Text>
        </div>
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
      width: 150,
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (_: any, record: EligibilityHistoryItem) =>
        getStatusTag(record.response_data?.status || record.status),
    },
    {
      title: 'Response Time',
      dataIndex: 'response_time_ms',
      key: 'response_time_ms',
      width: 120,
      render: (ms: number) => (ms ? `${ms}ms` : '-'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_: any, record: EligibilityHistoryItem) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
        >
          View
        </Button>
      ),
    },
  ];

  // Filter data by search text (client-side for simplicity)
  const filteredData = searchText
    ? data.filter(
        (item) =>
          item.patient_first_name
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          item.patient_last_name
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          item.member_id.toLowerCase().includes(searchText.toLowerCase()) ||
          item.insurance_company.toLowerCase().includes(searchText.toLowerCase())
      )
    : data;

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        Eligibility Check History
      </Title>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8}>
              <Input
                placeholder="Search by patient, member ID, or insurance"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={10}>
              <Space>
                <RangePicker
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  style={{ width: '100%' }}
                />
                <Button type="primary" onClick={handleSearch}>
                  Filter
                </Button>
              </Space>
            </Col>
            <Col xs={24} sm={6} style={{ textAlign: 'right' }}>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => loadHistory(pagination.page)}
              >
                Refresh
              </Button>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.total,
            showSizeChanger: false,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} checks`,
          }}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        title="Eligibility Check Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedCheck && (
          <div>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Patient Name">
                {selectedCheck.patient_first_name} {selectedCheck.patient_last_name}
              </Descriptions.Item>
              <Descriptions.Item label="Date of Birth">
                {dayjs(selectedCheck.patient_dob).format('MM/DD/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Insurance">
                {selectedCheck.insurance_company}
              </Descriptions.Item>
              <Descriptions.Item label="Member ID">
                {selectedCheck.member_id}
              </Descriptions.Item>
              <Descriptions.Item label="Group Number">
                {selectedCheck.group_number || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {getStatusTag(selectedCheck.response_data?.status || selectedCheck.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Check Time">
                {dayjs(selectedCheck.created_at).format('MMM D, YYYY h:mm:ss A')}
              </Descriptions.Item>
              <Descriptions.Item label="Response Time">
                {selectedCheck.response_time_ms ? `${selectedCheck.response_time_ms}ms` : '-'}
              </Descriptions.Item>
            </Descriptions>

            {selectedCheck.response_data?.coverage && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>Coverage Details</Title>
                <Descriptions bordered size="small" column={2}>
                  <Descriptions.Item label="Plan Name">
                    {selectedCheck.response_data.coverage.plan_name || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Plan Type">
                    {selectedCheck.response_data.coverage.plan_type || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Effective Date">
                    {selectedCheck.response_data.coverage.effective_date || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Termination Date">
                    {selectedCheck.response_data.coverage.termination_date || 'Active'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Primary Care Copay">
                    {selectedCheck.response_data.coverage.copay_primary_care || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Specialist Copay">
                    {selectedCheck.response_data.coverage.copay_specialist || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Deductible">
                    {selectedCheck.response_data.coverage.deductible_individual || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Deductible Met">
                    {selectedCheck.response_data.coverage.deductible_met || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Out-of-Pocket Max">
                    {selectedCheck.response_data.coverage.out_of_pocket_max || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="OOP Met">
                    {selectedCheck.response_data.coverage.out_of_pocket_met || '-'}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            )}

            {selectedCheck.error_message && (
              <div style={{ marginTop: 16 }}>
                <Text type="danger">Error: {selectedCheck.error_message}</Text>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default History;
