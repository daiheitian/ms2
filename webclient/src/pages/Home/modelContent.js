import React, { useEffect, useContext } from 'react';
import { Input, Row, Col, Button, Form, Select } from 'antd';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import checkRule from '../../utilseckRule';
import Store from '.ore';
import '.yle.less';

const { Option } = Select;
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

  const renderOption = () => {
    console.log('list', toJS(pageStore.expertList));
    return toJS(pageStore.expertList).map((v) => (
      <Option value={v.id} key={v.id}>
        {v.teamName}
      </Option>
    ));
  };
  const changeOption = (value) => {
    console.log('value', value);
    pageStore.changeSelOption(value);
  };

  useEffect(async () => {
    pageStore.getAllExpertTeam();
  }, []);

  const onFinish = async () => {
    console.log(pageStore.isAdd);
    form
      .validateFields()
      .then((values) => {
        if (pageStore.isAdd) {
          pageStore.add(values);
        } else {
          if (pageStore.editItem?.id) {
            values.id = pageStore.editItem.id;
          }
          pageStore.updateProject(values);
        }
      })
      .catch((errorInfo) => {
        console.log('errorInfo', errorInfo);
      });
  };
  useEffect(async () => {
    // useEffect第二个参数，[]:只执行一次，变量：变量变化时执行
    console.log('pageStore.editItem', pageStore.editItem);
    form.setFieldsValue(toJS(pageStore.editItem));
  }, [pageStore.editItem]);

  return (
    <Form {...formItemLayout} autoComplete="off" form={form} onFinish={onFinish}>
      <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入项目名称!' }, {
        validator: async (_, names) => {
          if(!checkRule.checkInvalidWord(names)){
            return Promise.reject(new Error('无效的字符'));
          }
        }
      }]}>
        <Input disabled={toJS(pageStore.isMore)}  />
      </Form.Item>
      <Form.Item label="内容" name="schema">
        <Input.TextArea disabled={toJS(pageStore.isMore)}  />
      </Form.Item>
      {toJS(pageStore.isMore) ? null : (
        <Row>
          <Col span={12} offset={8} className="flex alignCenter justifyCenter">
            <Button style={{ marginRight: '20px' }} onClick={handleCancel}>
              取消
            </Button>
            <Button htmlType="submit" type="primary">
              确定
            </Button>
          </Col>
        </Row>
      )}
    </Form>
  );
};

export default observer(ModelContent);
