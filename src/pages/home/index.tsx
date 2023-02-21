import { Link } from 'react-router-dom';

import { Card, Col, Divider, Row } from 'antd';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

const HomePage = () => {
    return (
        <Card>
            <Title style={{ marginBottom: 64 }}>Ringtone Conversion</Title>
            <Divider />
            <Paragraph>Select the preferred conversion:</Paragraph>
            <Row justify="space-evenly">
                <Col span={12}>
                    <Link to={'/rtx2mid'}>Convert RTX To MID</Link>
                </Col>
                <Col span={12}>
                    <Link to={'/rtx2rtttl'}>Convert RTX To RTTTL</Link>
                </Col>
            </Row>
        </Card>
    );
};

export default HomePage;
