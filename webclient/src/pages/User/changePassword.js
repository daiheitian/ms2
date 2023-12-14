import React, { useEffect, useContext } from 'react';
import { Input, Row, Select, Button, Form, Radio } from 'antd';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import {checkRule} from '@utils';
import Store from './store';
import './style.less';

const ChangePassword = () => {
  const pageStore = useContext(Store);
  const [form] = Form.useForm();
  const {depts} = pageStore

  const formItemLayout = {
    labelCol: {
      sm: { span: 4 },
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
        pageStore.changePassword(values);
      })
      .catch((errorInfo) => {
        console.log('errorInfo', errorInfo);
      });
  };
  useEffect(async () => {
    form.setFieldsValue(toJS(pageStore.editItem));
  }, [pageStore.editItem]);

  return (
    <div className="page-form-demo page-content">
    <Form {...formItemLayout} autoComplete="off" form={form} onFinish={onFinish}>
      <Form.Item label="原密码" name="oldPassword" rules={[{ required: true, message: '请输入原密码!' }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item label="新密码" name="newPassword" rules={[{ required: true, message: '请输入新密码!' }, {pattern:new RegExp(checkRule.PASSWORD_RULE), message:"请输入8~20位密码，必须包含至少1个小写字母、大写字母、数字和特殊字符"}]}>
        <Input.Password />
      </Form.Item>
      <Form.Item 
        label="确认密码"
        name="confirm"
        dependencies={['newPassword']}
        rules={[{ required: true, message: '请再次确认新密码!' }, ({getFieldValue}) => ({
        validator(_, value) {
            if (!value || getFieldValue('newPassword') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('两次输入密码不一致!'));
          },
        })]}
      >
        <Input.Password />
      </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button htmlType="submit" type="primary">
              确定
            </Button>
        </Form.Item>
    </Form>
    </div>
  );
};

export default observer(ChangePassword);
