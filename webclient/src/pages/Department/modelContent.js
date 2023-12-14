import React, { useEffect, useContext } from 'react';
import { Input, Button, Form, Radio } from 'antd';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import Store from './store';
import './style.less';

const ModelContent = () => {
  const pageStore = useContext(Store);
  const [form] = Form.useForm();

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
      <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入部门名称!' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="类型" name="deptType" rules={[{ required: true, message: '请选择部门类型!' }]}>
        <Radio.Group>
          <Radio value={1}>学院</Radio>
          <Radio value={2}>管理部门</Radio>
        </Radio.Group>
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
