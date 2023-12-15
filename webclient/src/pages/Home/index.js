import React, { useEffect, useContext, useState } from 'react';
import { Descriptions, Form, Space, DatePicker, Radio } from 'antd';
import { observer } from 'mobx-react';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import { appStores } from '@/stores';
import Store from './store';
import { constant } from '@utils';

import './style.less';

const { Item } = Descriptions;

const Home = () => {
  const { globalStore } = appStores();
  const pageStore = useContext(Store);
  const [workChat, setWorkChat] = useState(null);
  const [chatHeight, setChatHeight] = useState(400);
  const [form] = Form.useForm();

  useEffect(() => {
    globalStore.getUserInfo();
    // 设置默认年份为2023，日期选择器默认选项为年
    const defaultYear = 2023;
    form.setFieldsValue({ date: dayjs(new Date(defaultYear, 0)) }); // 设置日期选择器的默认值为2023年1月1日
    pageStore.changeType('year'); // 设置搜索类型为年
    pageStore.countByDept(defaultYear); // 获取2023年的数据

    return () => {
      console.log('组件销毁！！！');
      pageStore.destroyCom();
    };
  }, [form, pageStore]);

  useEffect(() => {
    const height = pageStore.workStatus.length * 24;
    setChatHeight(height);
    const option = pageStore.getChatOption();

    if (!workChat) {
      const _chat = echarts.init(document.getElementById('workChat'));
      setWorkChat(_chat);
      _chat.setOption(option);
    } else {
      workChat.setOption(option);
      workChat.getDom().style.height = `${height}px`;
      workChat.resize();
    }
  }, [pageStore.workStatus, workChat]);

  const changeDate = (date, dateString) => {
    const year = date ? date.year() : defaultYear;
    pageStore.changeDate(date);
    pageStore.countByDept(year);
  };

  const changeType = (e) => {
    const type = e.target.value;
    pageStore.changeType(type);
    const year = form.getFieldValue('date').year();
    pageStore.countByDept(year);
  };

  const { userInfo } = globalStore;

  return (
    <div className="page-form-demo page-content">
      <Descriptions title="个人中心" column={2} bordered>
        <Item label="姓名">{userInfo.username}</Item>
        <Item label="所属战队">{userInfo.departmentName}</Item>
        <Item label="性别">{constant.sexToString(userInfo.sex)}</Item>
        <Item label="角色">{constant.roleToTag(userInfo.roleId)}</Item>
      </Descriptions>
      <Form layout="inline" form={form} style={{ marginTop: 16 }}>
        <Space gutter={16}>
          <Form.Item name="date">
            <DatePicker onChange={changeDate} picker="year" />
          </Form.Item>
          <Form.Item name="type">
            <Radio.Group onChange={changeType} value={pageStore.searchType}>
              <Radio value="year">年</Radio>
              <Radio value="month">月</Radio>
            </Radio.Group>
          </Form.Item>
        </Space>
      </Form>
      <div id="workChat" style={{ height: chatHeight, marginTop: 20 }} />
    </div>
  );
};

export default observer(Home);
