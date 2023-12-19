import React, { useEffect, useContext } from 'react';
import { Input, Row, Col, Button, Form, Radio,Select} from 'antd';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import Store from './store';
import { constant} from '@utils';
import './style.less';

const {Option} = Select;

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
      <Form.Item label="项目名" name="workname" rules={[{ required: true, message: '请输入项目名称!' }]}>
        {readOnly? <span>{editItem?.workname}</span> :<Input />}
      </Form.Item>
      <Form.Item label="子项目名" name="subwork">
        {readOnly? <span>{editItem?.subwork}</span> :<Input />}
      </Form.Item>
      <Form.Item label="项目类型" name="worktype">
        {readOnly? <span>{editItem?.worktype}</span> :
        <Radio.Group>
          <Radio value={1}>常规工作</Radio>
          <Radio value={2}>重点工作</Radio>
          <Radio value={3}>创新工作</Radio>
          <Radio value={4}>新增工作</Radio>
        </Radio.Group>}
      </Form.Item>
      <Form.Item label="项目事务" name="workcontent">
        {readOnly? <span>{editItem?.workcontent}</span> :<Input />}
      </Form.Item>
      <Form.Item label="科室" name="wdepartment">
        {readOnly? <span>{editItem?.wdepartment}</span> :<Select placeholder="选择科室" optionFilterProp="children" showSearch allowClear>{pageStore.depts.map(d => <Option value={d.id}>{d.name}</Option>)}</Select>}
      </Form.Item>
      <Form.Item label="月份" name="workmouth">
        {readOnly? <span>{editItem?.workmouth}</span> :<Input type='number' suffix="月" />}
      </Form.Item>
      <Form.Item label="年份" name="workyear">
        {readOnly? <span>{editItem?.workyear}</span> :<Input type='number' suffix="年" />}
      </Form.Item>
      <Form.Item label="状态" name="finishStatus" rules={[{ required: true, message: '请选择任务状态!' }]}>
      {readOnly? <span>{constant.statusToString(editItem?.finishStatus)}</span> :
      <Radio.Group>
          <Radio value={2}>已完成</Radio>
          <Radio value={1}>进行中</Radio>
          <Radio value={3}>未完成</Radio>
      </Radio.Group>}
      </Form.Item>
      <Form.Item label="备注" name="note">
      {readOnly? <span>{editItem?.note}</span> :
        <Input.TextArea />}
      </Form.Item>
      {toJS(pageStore.isMore) || readOnly ? null : (
        <Row>
          <Col span={12} offset={8} className="flex alignCenter justifyCenter">
            <Button style={{ marginRight: '20px' }} onClick={handleCancel}>
              取消
            </Button>
            {(editItem?.status !== 1 || user.roleId === "1")&&([<Button style={{ marginRight: '20px' }} htmlType="submit" type="primary" onClick={() => {form.setFieldsValue({status:0})}}>保存</Button>,
            <Button htmlType="submit" type="primary" onClick={() => {form.setFieldsValue({status:1})}}>
              保存并提交
            </Button>])}
          </Col>
        </Row>
      )}
    </Form>
  );
};

export default observer(ModelContent);
