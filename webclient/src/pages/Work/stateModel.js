import React, { useEffect, useContext } from 'react';
import { Input, Row, Col, Button, Form, Radio,Select} from 'antd';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import Store from './store';
import { constant} from '@utils';
import './style.less';

const StateModel = () => {
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
    pageStore.setData({stateModalVisible: false});
  };

  useEffect(async () => {
  }, []);

  const onFinish = async () => {
    form
      .validateFields()
      .then((values) => {
        debugger;
        pageStore.save(values);
      })
      .catch((errorInfo) => {
        console.log('errorInfo', errorInfo);
      });
  };
  useEffect(async () => {
    form.setFieldsValue(toJS(pageStore.editItem));
  }, [pageStore.editItem]);

  const {editItem = {}, readOnly} = pageStore
  const user = JSON.parse(sessionStorage.getItem("user"))

  return (
    <Form {...formItemLayout} autoComplete="off" form={form} onFinish={onFinish}>
      <Form.Item hidden name="status"><Input /></Form.Item>
      <Form.Item hidden label="项目编号" name="wid">
        <Input type='number' />
      </Form.Item>
      <Form.Item label="状态" name="finishStatus" rules={[{ required: true, message: '请选择任务状态!' }]}>
      <Radio.Group>
          <Radio value={2}>已完成</Radio>
          <Radio value={1}>进行中</Radio>
          <Radio value={3}>未完成</Radio>
      </Radio.Group>
      </Form.Item>
      <Form.Item label="备注" name="note">
        <Input.TextArea />
      </Form.Item>
      {toJS(pageStore.isMore) || readOnly ? null : (
        <Row>
          <Col span={12} offset={8} className="flex alignCenter justifyCenter">
            <Button style={{ marginRight: '20px' }} onClick={handleCancel}>
              取消
            </Button>
            {(editItem?.status === 1 || user.roleId === "1")&&(
            <Button htmlType="submit" type="primary" onClick={() => {form.setFieldsValue({status:1})}}>
              提交
            </Button>)}
          </Col>
        </Row>
      )}
    </Form>
  );
};

export default observer(StateModel);
