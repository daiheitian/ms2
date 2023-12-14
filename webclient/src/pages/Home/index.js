import React, { useEffect, useMemo, useContext, useState } from 'react';
import { Descriptions, Tag, Form, Space, Input, DatePicker, Radio, message } from 'antd';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import dayjs from 'dayjs';
import * as echarts from 'echarts'
import { appStores } from '@/stores';
import Store from './store';
import { constant } from '@utils';

import './style.less';

const { Item } = Descriptions;
const home = () => {
  const { globalStore } = appStores();
  const pageStore = useContext(Store);
  const [workChat, setWorkChat] = useState()
  const [chatHeight, setChatHeight] = useState(400)
  const [form] = Form.useForm();

  const componentWillUnmount = () => {
    console.log('组件销毁！！！');
    pageStore.destroyCom();
  };

  useEffect(() => {
    globalStore.getUserInfo();
    const now  = dayjs()
    pageStore.countByDept(now.year(), now.month()+1);

    return componentWillUnmount;
  }, []);

  useEffect(() => {
    const height = pageStore.workStatus.length * 24
    setChatHeight(height)
    const option = pageStore.getChatOption()
    if(!workChat) {
      const _chat = echarts.init(document.getElementById('workChat'));
      setWorkChat(_chat)
      _chat.setOption(option)
    } else{
      workChat.setOption(option)
      workChat.getDom().style.height = height+'px';
      workChat.resize()
    }

  }, [pageStore.workStatus])

  const changeDate = (date, dateString) => {
    const year = date.year();
    const month = pageStore.searchType === "year" ? null : date.month()+1;
    pageStore.changeDate(date)
    pageStore.countByDept(year, month)
  }

  const changeType = (e) => {
    pageStore.changeType(e.target.value)
    changeDate(pageStore.searchDate)
  }

  const {userInfo} = globalStore

  return (
    <div className="page-form-demo page-content">
      <Descriptions title="个人中心" column={2} bordered>
        <Item label="姓名">{userInfo.username}</Item>
        <Item label="部门">{userInfo.departmentName}</Item>
        <Item label="性别">{constant.sexToString(userInfo.sex)}</Item>
        <Item label="角色">{constant.roleToTag(userInfo.roleId)}</Item>
      </Descriptions>
        <Form layout='inline' from={form} style={{marginTop:16}}>
        <Space gutter={16}>
          <Form.Item name="date">
          <DatePicker onChange={changeDate} picker={pageStore.searchType} />
          </Form.Item>
          <Form.Item name="type">
            <Radio.Group onChange={changeType} defaultValue={pageStore.searchType}>
              <Radio value='year'>年</Radio>
              <Radio value='month'>月</Radio>
            </Radio.Group>
          </Form.Item>
        </Space>
        </Form>
      <div id="workChat" style={{height:chatHeight, marginTop:20}} />
    </div>
  );
};

export default observer(home);
