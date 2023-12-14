import React, { useEffect, useContext } from 'react';
import { Input, Row, Col, Button, Form, InputNumber, Select } from 'antd';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import Store from './store';
import { appStores } from '@/stores';
import './index.less';

const { Option } = Select;

const Edit = () => {
  const pageStore = useContext(Store);
  const [form] = Form.useForm();
  const { globalStore } = appStores();

  const formItemLayout = {
    labelCol: {
      sm: { span: 8 },
    },
    wrapperCol: {
      sm: { span: 12 },
    },
  };
  const onFinish = async () => {
    form
      .validateFields()
      .then((values) => {
        console.log('values', values);
        pageStore.updateExperts(values);
      })
      .catch((errorInfo) => {
        console.log('errorInfo', errorInfo);
      });
  };
  useEffect(async () => {
    console.log('userInfo', toJS(globalStore.userInfo));
    form.setFieldsValue(toJS(globalStore.userInfo));
  }, [globalStore.userInfo]);

  return (
    <Form {...formItemLayout} autoComplete="off" form={form} onFinish={onFinish}>
      <Form.Item label="职称" name="titleName">
        <Input  />
      </Form.Item>
      <Form.Item label="所属科室" name="major">
        <Input  />
      </Form.Item>
      <Form.Item label="性别" name="gender">
        <Select>
          <Option value={1} key={1}>
            男
          </Option>
          <Option value={2} key={2}>
            女
          </Option>
          <Option value={0} key={0}>
            未知
          </Option>
        </Select>
      </Form.Item>
      <Form.Item label="年龄" name="age">
        <InputNumber style={{ width: '100%' }}  min={0} max={999} />
      </Form.Item>
      <Row>
        <Col span={12} offset={8} className="flex alignCenter justifyCenter">
          <Button
            style={{ marginRight: '20px' }}
            onClick={() => {
              pageStore.isEditVisible = false;
            }}
          >
            取消
          </Button>
          <Button htmlType="submit" type="primary">
            确定
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default observer(Edit);
