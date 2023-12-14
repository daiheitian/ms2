import React, { useEffect, useContext } from 'react';
import { Input, Select, Button, Form, Radio } from 'antd';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import {checkRule} from '@utils';
import Store from './store';
import './style.less';

const ModelContent = () => {
  const pageStore = useContext(Store);
  const [form] = Form.useForm();
  const {depts} = pageStore

  const formItemLayout = {
    labelCol: {
      sm: { span: 8 },
    },
    wrapperCol: {
      sm: { span: 12 },
    },
  };
  const handleCancel = () => {
    pageStore.closeModel();
  };

  useEffect(async () => {
  }, []);

  const onFinish = async () => {
    form
      .validateFields()
      .then((values) => {
        pageStore.save(values);
      })
      .catch((errorInfo) => {
        console.log('errorInfo', errorInfo);
      });
  };
  useEffect(async () => {
    form.setFieldsValue(toJS(pageStore.editItem));
  }, [pageStore.editItem]);

  return (
    <Form {...formItemLayout} autoComplete="off" form={form} onFinish={onFinish}>
      <Form.Item hidden name="id"><Input /></Form.Item>
      <Form.Item label="工号" name="jobNum" rules={[{ required: true, message: '请输入工号!' }]}>
        <Input disabled={!pageStore.isAdd} />
      </Form.Item>
      <Form.Item label="姓名" name="username" rules={[{ required: true, message: '请输入姓名!' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="角色" name="roleId" rules={[{ required: true, message: '请选择角色!' }]}>
        <Radio.Group>
          <Radio value={1}>管理员</Radio>
          <Radio value={2}>学校管理员</Radio>
          <Radio value={3}>学院管理员</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="密码" name="password" rules={[{pattern:new RegExp(checkRule.PASSWORD_RULE), message:"请输入8~20位密码，必须包含至少1个小写字母、大写字母、数字和特殊字符"}]}>
        <Input.Password />
      </Form.Item>
      <Form.Item label="年龄" name="age" rules={[{pattern:new RegExp(checkRule.AGE_RULE),message:"年龄不能为负数"}]}>
        <Input type="number" />
      </Form.Item>
      <Form.Item label="性别" name="sex">
        <Radio.Group>
          <Radio value={1}>男</Radio>
          <Radio value={0}>女</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="部门" name="department">
        <Select>{depts.map(d => <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>)}</Select>
      </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button style={{ marginRight: '20px' }} onClick={handleCancel}>
              取消
            </Button>
            <Button htmlType="submit" type="primary">
              确定
            </Button>
        </Form.Item>
    </Form>
  );
};

export default observer(ModelContent);
