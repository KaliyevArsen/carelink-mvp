import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Typography,
  Row,
  Col,
  Divider,
  Result,
  Descriptions,
  Tag,
  Spin,
  Alert,
  Space,
} from 'antd';
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  UserOutlined,
  IdcardOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { eligibilityApi } from '../api/eligibility';
import {
  EligibilityCheckRequest,
  EligibilityCheckResponse,
} from '../types';
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const EligibilityCheck: React.FC = () => {
  const { user } = useAuth();

  // Viewers cannot perform eligibility checks
  if (user?.role === 'viewer') {
    return (
      <Result
        status="403"
        icon={<LockOutlined />}
        title="Access Restricted"
        subTitle="Viewers can only view eligibility check history. Contact your administrator to upgrade your access."
        extra={
          <Button type="primary" href="/history">
            View History
          </Button>
        }
      />
    );
  }
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EligibilityCheckResponse | null>(null);
  const [insurers, setInsurers] = useState<string[]>([]);
  const [loadingInsurers, setLoadingInsurers] = useState(true);

  useEffect(() => {
    loadInsurers();
  }, []);

  const loadInsurers = async () => {
    try {
      const data = await eligibilityApi.getSupportedInsurers();
      setInsurers(data);
    } catch (error) {
      console.error('Failed to load insurers:', error);
      // Fallback list
      setInsurers([
        'Blue Cross Blue Shield',
        'Aetna',
        'UnitedHealthcare',
        'Cigna',
        'Humana',
        'Kaiser Permanente',
        'Anthem',
        'Medicare',
        'Medicaid',
      ]);
    } finally {
      setLoadingInsurers(false);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    setResult(null);

    const request: EligibilityCheckRequest = {
      patient_first_name: values.patient_first_name,
      patient_last_name: values.patient_last_name,
      patient_dob: values.patient_dob.format('YYYY-MM-DD'),
      insurance_company: values.insurance_company,
      member_id: values.member_id,
      group_number: values.group_number || undefined,
    };

    try {
      const response = await eligibilityApi.checkEligibility(request);
      setResult(response);
    } catch (error: any) {
      console.error('Eligibility check failed:', error);
      setResult({
        id: '',
        status: 'error',
        error_message:
          error.response?.data?.detail || 'Failed to check eligibility',
        created_at: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setResult(null);
  };

  const renderResult = () => {
    if (!result) return null;

    if (result.status === 'error' || result.status === 'not_found') {
      return (
        <Result
          status="error"
          icon={<CloseCircleOutlined />}
          title={result.status === 'not_found' ? 'Member Not Found' : 'Verification Failed'}
          subTitle={result.error_message || 'Unable to verify eligibility'}
          extra={[
            <Button key="retry" type="primary" onClick={() => form.submit()}>
              Retry
            </Button>,
            <Button key="reset" onClick={handleReset}>
              New Check
            </Button>,
          ]}
        />
      );
    }

    if (result.status === 'inactive') {
      return (
        <div>
          <Alert
            type="warning"
            icon={<ExclamationCircleOutlined />}
            message="Policy Inactive"
            description={`This policy was terminated on ${result.coverage?.termination_date || 'unknown date'}`}
            showIcon
            style={{ marginBottom: 24 }}
          />
          {renderCoverageDetails()}
        </div>
      );
    }

    return (
      <div>
        <Alert
          type="success"
          icon={<CheckCircleOutlined />}
          message="Coverage Active"
          description={`Plan: ${result.coverage?.plan_name || 'N/A'} (${result.coverage?.plan_type || 'N/A'})`}
          showIcon
          style={{ marginBottom: 24 }}
        />
        {renderCoverageDetails()}
      </div>
    );
  };

  const renderCoverageDetails = () => {
    if (!result?.coverage) return null;

    const { coverage, subscriber } = result;

    return (
      <div>
        <Card title="Subscriber Information" size="small" style={{ marginBottom: 16 }}>
          <Descriptions column={{ xs: 1, sm: 2 }} size="small">
            <Descriptions.Item label="Name">{subscriber?.name || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Relationship">
              {subscriber?.relationship || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Member ID">{subscriber?.member_id || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Effective Date">
              {coverage.effective_date || 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="Copay Information" size="small" style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <Statistic label="Primary Care" value={coverage.copay_primary_care || 'N/A'} />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic label="Specialist" value={coverage.copay_specialist || 'N/A'} />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic label="Urgent Care" value={coverage.copay_urgent_care || 'N/A'} />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic label="Emergency" value={coverage.copay_emergency || 'N/A'} />
            </Col>
          </Row>
        </Card>

        <Card title="Deductible & Out-of-Pocket" size="small">
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <Statistic
                label="Individual Deductible"
                value={coverage.deductible_individual || 'N/A'}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                label="Deductible Met"
                value={coverage.deductible_met || 'N/A'}
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                label="Out-of-Pocket Max"
                value={coverage.out_of_pocket_max || 'N/A'}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                label="OOP Met"
                value={coverage.out_of_pocket_met || 'N/A'}
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
          </Row>
          <Divider style={{ margin: '16px 0' }} />
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <Statistic label="Coinsurance" value={coverage.coinsurance || 'N/A'} />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                label="Family Deductible"
                value={coverage.deductible_family || 'N/A'}
              />
            </Col>
          </Row>
        </Card>

        {result.response_time_ms && (
          <Text type="secondary" style={{ display: 'block', marginTop: 16, textAlign: 'right' }}>
            Response time: {result.response_time_ms}ms
          </Text>
        )}

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            New Check
          </Button>
        </div>
      </div>
    );
  };

  // Simple statistic component for the coverage cards
  const Statistic: React.FC<{
    label: string;
    value: string;
    valueStyle?: React.CSSProperties;
  }> = ({ label, value, valueStyle }) => (
    <div>
      <Text type="secondary" style={{ fontSize: 12 }}>
        {label}
      </Text>
      <div style={{ fontSize: 18, fontWeight: 500, ...valueStyle }}>{value}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        Insurance Eligibility Check
      </Title>

      <Row gutter={24}>
        <Col xs={24} lg={result ? 10 : 24}>
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="patient_first_name"
                    label="Patient First Name"
                    rules={[{ required: true, message: 'Required' }]}
                  >
                    <Input
                      prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                      placeholder="John"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="patient_last_name"
                    label="Patient Last Name"
                    rules={[{ required: true, message: 'Required' }]}
                  >
                    <Input placeholder="Smith" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="patient_dob"
                label="Date of Birth"
                rules={[{ required: true, message: 'Required' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="Select date of birth"
                  disabledDate={(current) => current && current > dayjs()}
                  format="MM/DD/YYYY"
                />
              </Form.Item>

              <Form.Item
                name="insurance_company"
                label="Insurance Company"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Select
                  placeholder="Select insurance company"
                  loading={loadingInsurers}
                  showSearch
                  optionFilterProp="children"
                >
                  {insurers.map((insurer) => (
                    <Option key={insurer} value={insurer}>
                      {insurer}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="member_id"
                    label="Member ID"
                    rules={[{ required: true, message: 'Required' }]}
                  >
                    <Input
                      prefix={<IdcardOutlined style={{ color: '#bfbfbf' }} />}
                      placeholder="ABC123456789"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="group_number" label="Group Number (Optional)">
                    <Input placeholder="GRP12345" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                    loading={loading}
                    size="large"
                  >
                    Check Eligibility
                  </Button>
                  <Button onClick={handleReset} size="large">
                    Reset
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {(result || loading) && (
          <Col xs={24} lg={14}>
            <Card
              title="Verification Result"
              extra={
                result && (
                  <Tag
                    color={
                      result.status === 'active'
                        ? 'success'
                        : result.status === 'inactive'
                        ? 'warning'
                        : 'error'
                    }
                  >
                    {result.status.toUpperCase()}
                  </Tag>
                )
              }
            >
              {loading ? (
                <div style={{ textAlign: 'center', padding: 60 }}>
                  <Spin size="large" />
                  <div style={{ marginTop: 16 }}>
                    <Text type="secondary">Verifying eligibility...</Text>
                  </div>
                </div>
              ) : (
                renderResult()
              )}
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default EligibilityCheck;
