import React, {useEffect, useRef} from 'react';
import { Layout, Row, Col, notification, Modal } from 'antd';
import { observer } from 'mobx-react';
import { appStores } from '@/stores';
import './style.less';
import MainHeader from '../MainHeader';
import SiderMenu from '../SiderMenu';
import Bread from '../Bread';
import ChagePassword from './changePassword'

const BasicLayout = ({ route, children }) => {
  const { globalStore } = appStores();
  const changePasswordRef = useRef()
  const breadProps = {
    menu: route.childRoutes,
  };

  useEffect(() => {
    globalStore.checkWork();
  }, []);

  useEffect(() => {
    const {works} = globalStore
    if(works.length > 0) {
      const items = works.filter(work => work.unFinish > 0).map(work => <div>{work.department}<span style={{color:'red', fontSize:16}}>{work.unFinish}</span>项任务未完成</div>)
      notification['warning']({
        key: 'workUnFinish',
        message:"未完成任务提醒",
        description: <div>{items}</div>
      })
    }
  }, [globalStore.works])

  return (
    <Layout className="main-layout">
      <MainHeader />
      {/* 左侧菜单导航 */}
      <Layout style={{ height: '100%' }} className="bgColor">
        <Row style={{ height: '100%' }}>
          <Col span={3} style={{ height: '100%' }}>
            <SiderMenu routes={globalStore.menu} />
          </Col>
          <Col span={21} style={{ height: '100%' }}>
            <Layout.Content className="content">
              <div className="bread ">
                <Bread {...breadProps} />
              </div>
              {children}
            </Layout.Content>
          </Col>
        </Row>
        <Modal title="修改密码" visible={globalStore.easyPass} onOk={changePasswordRef.current?.save} onCancel={()=>globalStore.setData({easyPass:false})}>
          <ChagePassword ref={changePasswordRef} />
        </Modal>
      </Layout>
    </Layout>
  );
};

export default observer(BasicLayout);
