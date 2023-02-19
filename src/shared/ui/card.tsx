import { Card, Space } from 'antd';

export interface CommonCardProps {
    children: React.ReactNode;
}

export const CommonCard: React.FC<CommonCardProps> = ({ children }) => (
    <Card title="Conversion Menu">
        <Space
            direction="horizontal"
            style={{ width: '100%', justifyContent: 'center' }}>
            {children}
        </Space>
    </Card>
);
