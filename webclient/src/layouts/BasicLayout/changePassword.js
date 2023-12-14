import React, { useEffect, useContext, useImperativeHandle } from 'react';
import { Input, Row, Select, Button, Form, Radio } from 'antd';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import {checkRule} from '@utils';
import { appStores } from '@/stores';
import Store from '../../pages/User/store';
import './style.less';

const ChangePassword = React.forwardRef((props, ref) => {
  const { globalStore } = appStores();
  const pageStore = useContext(Store);
  const [form] = Form.useForm();

  const formItemLayout = {
    labelCol: {
      sm: { span: 4 },
    },
    wrapperCol: {
      sm: { span: 12 },
    },
  };

  

  useEffect(async () => {
  }, []);

  const onFinish = async () => {
    form
      .validateFields()
      .then((values) => {
        pageStore.changePassword(values);
        globalStore.setData({easyPass:false})
      })
      .catch((errorInfo) => {
        console.log('errorInfo', errorInfo);
      });
  };

  useImperativeHandle(ref, () => ({
    save: onFinish
  }))

  return (
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
    </Form>
  );
});

export default observer(ChangePassword);
