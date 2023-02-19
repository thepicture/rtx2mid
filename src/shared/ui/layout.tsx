import React from 'react';

import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';

import 'app/index.css';

const headerItems: MenuProps['items'] = ['RTX To MID'].map((key) => ({
    key,
    label: `${key}`,
}));

export interface CommonLayoutProps {
    children: React.ReactNode;
}

export const CommonLayout: React.FC<CommonLayoutProps> = ({ children }) => {
    return (
        <Layout>
            <Header className="header">
                <div className="logo" />
                <Menu theme="dark" mode="horizontal" items={headerItems} />
            </Header>
            <Layout>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Converter</Breadcrumb.Item>
                        <Breadcrumb.Item>Melody</Breadcrumb.Item>
                        <Breadcrumb.Item>rtx2mid</Breadcrumb.Item>
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
