import React, { useContext, useEffect } from 'react';
import { Layout, Dropdown, Menu, Row, Col, Modal } from 'antd';
import { UserOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { appStores } from '@stores';
import Edit from './edit';
import Store from './edit/store';
import './style.less';

const MainHeader = () => {
  const { globalStore } = appStores();
  const pageStore = useContext(Store);
  const collapsed = globalStore.collapsed;
  const [modal, contextHolder] = Modal.useModal();

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Link
          to="/login"
          onClick={() => {
            globalStore.logout().then(() => {
              sessionStorage.clear();
              globalStore.clear();
            });
          }}
        >
          <LogoutOutlined />
          <span style={{ marginLeft: 10 }}>退出登录</span>
        </Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout.Header className="main-header">
      <Row className="sub1-header">
        <Col span={22} className="subHeight">
          <div className="flex alignCenter">
            {/* <Link to="/">
              <div className="logo" />
            </Link> */}
            <div className="title">{globalStore.appTitle}</div>
          </div>
        </Col>

        <Col span={2} className="subHeight">
          <Dropdown overlay={menu} trigger={['click', 'hover']} placement="bottomCenter">
          <div className="user-info">
              {/* <span className="user-name">{globalStore.userInfo.loginName}</span> */}
              <UserOutlined />
              <span className="user-name">{JSON.parse(sessionStorage.getItem('user'))?.nickname}</span>
          </div>
          </Dropdown>
        </Col>
      </Row>
      {/* <Row className="sub2-header">
        <Col span={24} className="subHeight">
          <SiderMenu routes={globalStore.menu} />
        </Col>
      </Row> */}
      {/* <div className="bian"></div> */}
      <Modal
        width="50%"
        title="修改个人信息"
        bordered="true"
        footer={null}
        visible={pageStore.isEditVisible}
        onCancel={() => {
          pageStore.isEditVisible = false;
        }}
      >
        <Edit />
      </Modal>
      {contextHolder}
    </Layout.Header>
  );
};

export default observer(MainHeader);
