import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  Button,
  Typography,
  Row,
  Col,
  Card,
  Space,
  Statistic,
  Divider,
} from 'antd';
import {
  ThunderboltOutlined,
  SafetyOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ApiOutlined,
  TeamOutlined,
  RocketOutlined,
  ArrowRightOutlined,
  MedicineBoxOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <ThunderboltOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
      title: 'Real-Time Verification',
      description: 'Check patient insurance eligibility in under 2 seconds. No more phone calls or portal hopping.',
    },
    {
      icon: <SafetyOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
      title: 'HIPAA Compliant',
      description: 'Enterprise-grade security with end-to-end encryption. Your patient data is always protected.',
    },
    {
      icon: <DollarOutlined style={{ fontSize: 32, color: '#faad14' }} />,
      title: 'Reduce Claim Denials',
      description: 'Verify coverage before appointments. Catch inactive policies and eligibility issues upfront.',
    },
    {
      icon: <ApiOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
      title: 'Universal Coverage',
      description: 'Connected to 2,000+ payers including BCBS, Aetna, UnitedHealthcare, Cigna, and Medicare.',
    },
  ];

  const stats = [
    { value: '2s', label: 'Average Response Time' },
    { value: '2,000+', label: 'Insurance Payers' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '85%', label: 'Time Saved' },
  ];

  const painPoints = [
    'Spending 15+ minutes per patient on hold with insurance companies',
    'Logging into 10+ different payer portals daily',
    'Claim denials due to eligibility issues discovered too late',
    'Manual data entry errors causing billing delays',
    'No visibility into deductibles and out-of-pocket status',
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$299',
      period: '/month per location',
      features: [
        'Unlimited eligibility checks',
        'Up to 5 user accounts',
        'Email support',
        'Basic analytics',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Professional',
      price: '$799',
      period: '/month per location',
      features: [
        'Everything in Starter',
        'Unlimited users',
        'Priority support',
        'Advanced analytics',
        'API access',
        'Custom integrations',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact for pricing',
      features: [
        'Everything in Professional',
        'Dedicated account manager',
        'Custom SLA',
        'On-premise deployment',
        'EMR integration',
        'White-label options',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Header */}
      <Header
        style={{
          background: '#fff',
          padding: '0 50px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #f0f0f0',
          position: 'fixed',
          width: '100%',
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MedicineBoxOutlined style={{ fontSize: 28, color: '#1890ff' }} />
          <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
            CareLink
          </Title>
        </div>
        <Space>
          <Button type="text" href="#features">Features</Button>
          <Button type="text" href="#pricing">Pricing</Button>
          <Button type="text" href="#contact">Contact</Button>
          <Button onClick={() => navigate('/login')}>Sign In</Button>
          <Button type="primary" onClick={() => navigate('/login')}>
            Start Free Trial
          </Button>
        </Space>
      </Header>

      <Content>
        {/* Hero Section */}
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '160px 50px 100px',
            textAlign: 'center',
          }}
        >
          <Title
            style={{
              color: '#fff',
              fontSize: 48,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            Insurance Verification in Seconds,
            <br />
            Not Minutes
          </Title>
          <Paragraph
            style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: 20,
              maxWidth: 700,
              margin: '0 auto 32px',
            }}
          >
            CareLink eliminates the administrative burden of insurance verification.
            Check eligibility, copays, and deductibles instantly for any patient.
          </Paragraph>
          <Space size="large">
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/login')}
              style={{
                height: 50,
                paddingInline: 32,
                fontSize: 16,
                background: '#fff',
                color: '#667eea',
                border: 'none',
              }}
            >
              Start Free 14-Day Trial <ArrowRightOutlined />
            </Button>
            <Button
              size="large"
              ghost
              style={{ height: 50, paddingInline: 32, fontSize: 16 }}
            >
              Watch Demo
            </Button>
          </Space>

          {/* Stats */}
          <Row
            gutter={[32, 32]}
            justify="center"
            style={{ marginTop: 80, maxWidth: 900, marginInline: 'auto' }}
          >
            {stats.map((stat, index) => (
              <Col xs={12} sm={6} key={index}>
                <div style={{ color: '#fff' }}>
                  <div style={{ fontSize: 40, fontWeight: 700 }}>{stat.value}</div>
                  <div style={{ opacity: 0.8 }}>{stat.label}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Problem Section */}
        <div style={{ padding: '80px 50px', background: '#f9fafb' }}>
          <Row gutter={[48, 48]} align="middle" justify="center">
            <Col xs={24} lg={10}>
              <Text
                style={{
                  color: '#ef4444',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                The Problem
              </Text>
              <Title level={2} style={{ marginTop: 8 }}>
                Healthcare Admin is Broken
              </Title>
              <Paragraph style={{ fontSize: 16, color: '#666' }}>
                U.S. healthcare providers waste <strong>$20-30 billion annually</strong> on
                insurance verification and claims processing. Your front desk staff
                shouldn't spend their day on hold with insurance companies.
              </Paragraph>
            </Col>
            <Col xs={24} lg={10}>
              <Card style={{ background: '#fff' }}>
                <Title level={5} style={{ color: '#ef4444' }}>
                  Sound familiar?
                </Title>
                {painPoints.map((point, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      marginBottom: 16,
                    }}
                  >
                    <ClockCircleOutlined style={{ color: '#ef4444', marginTop: 4 }} />
                    <Text>{point}</Text>
                  </div>
                ))}
              </Card>
            </Col>
          </Row>
        </div>

        {/* Features Section */}
        <div id="features" style={{ padding: '80px 50px' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <Text
              style={{
                color: '#1890ff',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Features
            </Text>
            <Title level={2} style={{ marginTop: 8 }}>
              Everything You Need to Verify Eligibility
            </Title>
          </div>

          <Row gutter={[32, 32]} justify="center" style={{ maxWidth: 1200, margin: '0 auto' }}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card
                  hoverable
                  style={{ height: '100%', textAlign: 'center' }}
                  bodyStyle={{ padding: 32 }}
                >
                  <div style={{ marginBottom: 16 }}>{feature.icon}</div>
                  <Title level={4}>{feature.title}</Title>
                  <Text type="secondary">{feature.description}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* How It Works */}
        <div style={{ padding: '80px 50px', background: '#f9fafb' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <Text
              style={{
                color: '#1890ff',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              How It Works
            </Text>
            <Title level={2} style={{ marginTop: 8 }}>
              Three Steps to Instant Verification
            </Title>
          </div>

          <Row gutter={[48, 48]} justify="center" style={{ maxWidth: 1000, margin: '0 auto' }}>
            {[
              {
                step: '1',
                title: 'Enter Patient Info',
                description: 'Name, date of birth, insurance company, and member ID.',
              },
              {
                step: '2',
                title: 'Get Instant Results',
                description: 'Coverage status, copays, deductibles, and out-of-pocket max in seconds.',
              },
              {
                step: '3',
                title: 'Inform Your Patient',
                description: 'Share accurate cost estimates before their appointment.',
              },
            ].map((item, index) => (
              <Col xs={24} md={8} key={index}>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: '#1890ff',
                      color: '#fff',
                      fontSize: 24,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}
                  >
                    {item.step}
                  </div>
                  <Title level={4}>{item.title}</Title>
                  <Text type="secondary">{item.description}</Text>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Social Proof */}
        <div style={{ padding: '80px 50px', textAlign: 'center' }}>
          <Title level={2}>Trusted by Healthcare Providers</Title>
          <Row gutter={[48, 24]} justify="center" style={{ marginTop: 40, opacity: 0.6 }}>
            {['Downtown Family Clinic', 'Metro Urgent Care', 'Valley Medical Group', 'Sunrise Health Center'].map(
              (name, index) => (
                <Col key={index}>
                  <Text style={{ fontSize: 18, fontWeight: 500 }}>{name}</Text>
                </Col>
              )
            )}
          </Row>

          <Card
            style={{
              maxWidth: 700,
              margin: '60px auto 0',
              background: '#f9fafb',
              border: 'none',
            }}
          >
            <Paragraph style={{ fontSize: 18, fontStyle: 'italic', marginBottom: 16 }}>
              "CareLink has transformed our front office operations. We used to spend
              20 minutes per patient verifying insurance. Now it takes seconds.
              Our staff can focus on patient care instead of being on hold."
            </Paragraph>
            <Text strong>— Sarah Johnson, Office Manager</Text>
            <br />
            <Text type="secondary">Downtown Family Clinic</Text>
          </Card>
        </div>

        {/* Pricing Section */}
        <div id="pricing" style={{ padding: '80px 50px', background: '#f9fafb' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <Text
              style={{
                color: '#1890ff',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Pricing
            </Text>
            <Title level={2} style={{ marginTop: 8 }}>
              Simple, Transparent Pricing
            </Title>
            <Paragraph style={{ color: '#666' }}>
              No per-transaction fees. No hidden costs. Just flat monthly pricing.
            </Paragraph>
          </div>

          <Row gutter={[24, 24]} justify="center" style={{ maxWidth: 1100, margin: '0 auto' }}>
            {pricingPlans.map((plan, index) => (
              <Col xs={24} md={8} key={index}>
                <Card
                  hoverable
                  style={{
                    height: '100%',
                    border: plan.popular ? '2px solid #1890ff' : undefined,
                  }}
                  bodyStyle={{ padding: 32 }}
                >
                  {plan.popular && (
                    <div
                      style={{
                        background: '#1890ff',
                        color: '#fff',
                        padding: '4px 12px',
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 600,
                        display: 'inline-block',
                        marginBottom: 16,
                      }}
                    >
                      MOST POPULAR
                    </div>
                  )}
                  <Title level={4}>{plan.name}</Title>
                  <div style={{ marginBottom: 24 }}>
                    <span style={{ fontSize: 36, fontWeight: 700 }}>{plan.price}</span>
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      {' '}{plan.period}
                    </Text>
                  </div>
                  <Divider />
                  <div style={{ marginBottom: 24 }}>
                    {plan.features.map((feature, idx) => (
                      <div
                        key={idx}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}
                      >
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                        <Text>{feature}</Text>
                      </div>
                    ))}
                  </div>
                  <Button
                    type={plan.popular ? 'primary' : 'default'}
                    block
                    size="large"
                    onClick={() => navigate('/login')}
                  >
                    {plan.cta}
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* CTA Section */}
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '80px 50px',
            textAlign: 'center',
          }}
        >
          <Title level={2} style={{ color: '#fff', marginBottom: 16 }}>
            Ready to Transform Your Practice?
          </Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, marginBottom: 32 }}>
            Join hundreds of healthcare providers who have eliminated the insurance verification headache.
          </Paragraph>
          <Button
            size="large"
            onClick={() => navigate('/login')}
            style={{
              height: 50,
              paddingInline: 40,
              fontSize: 16,
              background: '#fff',
              color: '#667eea',
              border: 'none',
            }}
          >
            Start Your Free 14-Day Trial <ArrowRightOutlined />
          </Button>
          <div style={{ marginTop: 16 }}>
            <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
              No credit card required
            </Text>
          </div>
        </div>

        {/* Contact Section */}
        <div id="contact" style={{ padding: '80px 50px' }}>
          <Row gutter={[48, 48]} justify="center">
            <Col xs={24} md={12} lg={8}>
              <Title level={3}>Get in Touch</Title>
              <Paragraph type="secondary">
                Have questions? We'd love to hear from you.
              </Paragraph>
              <Space direction="vertical" size="large" style={{ marginTop: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <MailOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                  <Text>hello@carelink.health</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <PhoneOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                  <Text>(555) 123-4567</Text>
                </div>
              </Space>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Title level={3}>For Investors</Title>
              <Paragraph type="secondary">
                CareLink is backed by leading healthcare investors. We're building
                the infrastructure layer for healthcare administration.
              </Paragraph>
              <Button type="primary" icon={<RocketOutlined />}>
                Investor Deck
              </Button>
            </Col>
          </Row>
        </div>
      </Content>

      {/* Footer */}
      <Footer style={{ background: '#001529', padding: '48px 50px' }}>
        <Row gutter={[48, 32]}>
          <Col xs={24} md={8}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <MedicineBoxOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              <Title level={4} style={{ margin: 0, color: '#fff' }}>
                CareLink
              </Title>
            </div>
            <Text style={{ color: 'rgba(255,255,255,0.65)' }}>
              Simplifying healthcare administration, one verification at a time.
            </Text>
          </Col>
          <Col xs={12} md={4}>
            <Title level={5} style={{ color: '#fff' }}>Product</Title>
            <Space direction="vertical">
              <a style={{ color: 'rgba(255,255,255,0.65)' }}>Features</a>
              <a style={{ color: 'rgba(255,255,255,0.65)' }}>Pricing</a>
              <a style={{ color: 'rgba(255,255,255,0.65)' }}>Integrations</a>
              <a style={{ color: 'rgba(255,255,255,0.65)' }}>API</a>
            </Space>
          </Col>
          <Col xs={12} md={4}>
            <Title level={5} style={{ color: '#fff' }}>Company</Title>
            <Space direction="vertical">
              <a style={{ color: 'rgba(255,255,255,0.65)' }}>About</a>
              <a style={{ color: 'rgba(255,255,255,0.65)' }}>Blog</a>
              <a style={{ color: 'rgba(255,255,255,0.65)' }}>Careers</a>
              <a style={{ color: 'rgba(255,255,255,0.65)' }}>Contact</a>
            </Space>
          </Col>
          <Col xs={12} md={4}>
            <Title level={5} style={{ color: '#fff' }}>Legal</Title>
            <Space direction="vertical">
              <a style={{ color: 'rgba(255,255,255,0.65)' }}>Privacy Policy</a>
              <a style={{ color: 'rgba(255,255,255,0.65)' }}>Terms of Service</a>
              <a style={{ color: 'rgba(255,255,255,0.65)' }}>HIPAA Compliance</a>
              <a style={{ color: 'rgba(255,255,255,0.65)' }}>BAA</a>
            </Space>
          </Col>
          <Col xs={12} md={4}>
            <Title level={5} style={{ color: '#fff' }}>Support</Title>
            <Space direction="vertical">
              <a style={{ color: 'rgba(255,255,255,0.65)' }}>Help Center</a>
              <a style={{ color: 'rgba(255,255,255,0.65)' }}>Documentation</a>
              <a style={{ color: 'rgba(255,255,255,0.65)' }}>Status</a>
            </Space>
          </Col>
        </Row>
        <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <div style={{ textAlign: 'center' }}>
          <Text style={{ color: 'rgba(255,255,255,0.45)' }}>
            © 2024 CareLink Health, Inc. All rights reserved.
          </Text>
        </div>
      </Footer>
    </Layout>
  );
};

export default Landing;
