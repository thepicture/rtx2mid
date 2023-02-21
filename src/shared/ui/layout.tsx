import React from 'react';

import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';

import { MenuInfo } from 'rc-menu/lib/interface';

import { useNavigate } from 'react-router';
import { useLocation } from 'react-router';

import 'app/index.css';

const HEADER_ITEMS = [
    { label: 'Home', key: '/' },
    { label: 'RTX To MID', key: '/rtx2mid' },
    { label: 'RTX To RTTTL', key: '/rtx2rtttl' },
];

export interface CommonLayoutProps {
    children: React.ReactNode;
}

const SLASH_REGEXP = /\//;
const CONVERSION_DELIMITER_REGEXP = /2/;
export const CommonLayout: React.FC<CommonLayoutProps> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [convertFrom, convertTo] = location.pathname
        .replace(SLASH_REGEXP, '')
        .split(CONVERSION_DELIMITER_REGEXP)
        .map((word) => word.toUpperCase());

    const handleNavigate = (menuProps: MenuInfo) => {
        navigate(menuProps.key);
    };

    const headerItems: MenuProps['items'] = HEADER_ITEMS.map(
        ({ label, key }) => ({
            key,
            label,
            onClick: (menuProps: MenuInfo) => handleNavigate(menuProps),
        }),
    );

    return (
        <Layout>
            <Header className="header">
                <div className="logo" />
                <Menu
                    selectedKeys={[location.pathname]}
                    theme="dark"
                    mode="horizontal"
                    items={headerItems}
                />
            </Header>
            <Layout>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>CONVERT</Breadcrumb.Item>
                        <Breadcrumb.Item>{convertFrom}</Breadcrumb.Item>
                        <Breadcrumb.Item>{convertTo}</Breadcrumb.Item>
                    </Breadcrumb>
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                        }}>
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};
