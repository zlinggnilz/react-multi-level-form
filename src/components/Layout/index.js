import React, { PureComponent } from 'react';
import { Layout, Menu } from 'antd';
import { withRouter, Link } from 'react-router-dom';

const { Content, Footer, Sider } = Layout;

class CustomLayout extends PureComponent {
  render() {
    const {
      children,
      menu,
      history: { location }
    } = this.props;
    return (
      <Layout>
        <Sider width={200} style={{ padding: '24px 0', overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}>
          <Menu mode="inline" theme="dark" defaultSelectedKeys={[location.pathname]} style={{ height: '100%' }}>
            {menu.map(
              item =>
                !item.hideInMenu && (
                  <Menu.Item key={item.path}>
                    <Link to={item.path}>{item.name}</Link>
                  </Menu.Item>
                )
            )}
          </Menu>
        </Sider>
        <Layout style={{ marginLeft: 200, minHeight: '100vh' }}>
          <Content style={{ margin: '24px 24px 0', minHeight: 300 }}>{children}</Content>
          <Footer className="text-center" style={{ fontSize: 16 }}>
            ＼＼\٩( &apos;ω&apos; )و //／／
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(CustomLayout);
