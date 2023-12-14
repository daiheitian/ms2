import React, { useEffect, useMemo, useContext } from 'react';
import { Form, Space, Button, Input, Table, Select, Modal, Popconfirm } from 'antd';
import { observer } from 'mobx-react';
import { constant } from '@utils'
import Store from './store';
import ModelContent from './modelContent';

import './style.less';

const { Option } = Select;
const work = () => {
  const pageStore = useContext(Store);
  const [form] = Form.useForm();

  const columns = useMemo(
    () => [
      {
        title: '工号',
        dataIndex: 'jobNum',
        align: 'center',
      },
      {
        title: '姓名',
        dataIndex: 'username',
        align: 'center',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        align: 'center',
        render: (text) => constant.sexToString(text)
      },
      {
        title: '角色',
        dataIndex: 'roleId',
        align: 'center',
        render: (text) => constant.roleToTag(text),
      },
      {
        title: '部门',
        dataIndex: 'departmentName',
        align: 'center',
      },
      {
        title: '操作',
        align: 'center',
        dataIndex: 'action',
        render: (text, record) => (
          <Space>
            <Button
              type="primary"
              onClick={() => {
                pageStore.openModel(record);
              }}
            >
              编辑
            </Button>
            <Popconfirm title="是否确认删除？" onConfirm={()=>pageStore.delete(record.id)} okText="确认" cancelText="取消">
              <Button
                type="primary"
                danger
              >
                删除
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [pageStore],
  );

  const onSearch = (values) => {
    console.log('Finish:', values);
    for(const key in values) {
      if(!values[key]) {
        delete values[key]
      }
    }
    pageStore.getData(values)
  };

  const componentWillUnmount = () => {
    console.log('组件销毁！！！');
    pageStore.destroyCom();
  };

  useEffect(() => {
    console.log("页面初始化");
    pageStore.getData();
    pageStore.getDepts();
    return componentWillUnmount;
  }, []);

  return (
    <div className="page-form-demo page-content">
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <Form form={form} name="horizontal_login" layout="inline" onFinish={onSearch}>
        <Form.Item
          name="jobNum"
        >
          <Input placeholder="工号" allowClear />
        </Form.Item>
        <Form.Item
          name="username"
        >
          <Input placeholder="姓名" allowClear />
        </Form.Item>
        <Form.Item
          name="roleId"
        >
          <Select placeholder="角色" allowClear>
            <Option value={1}>管理员</Option>
            <Option value={2}>学校管理员</Option>
            <Option value={3}>学院管理员</Option>
          </Select>
        </Form.Item>
        <Form.Item shouldUpdate>
          <Space>
          <Button
            type="primary"
            htmlType="submit"
          >
            查询
          </Button>
          <Button type="primary" onClick={()=>pageStore.openModel()}>新增</Button>
          </Space>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={pageStore.tableData} pagination={{...pageStore.pagination}} />
      </Space>
      <Modal title={pageStore.editItem? "编辑":"新增"} onCancel={pageStore.closeModel} visible={pageStore.isModalVisible} footer={null} destroyOnClose>
        <ModelContent />
      </Modal>
    </div>
  );
};

export default observer(work);
