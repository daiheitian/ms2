import React, { useEffect, useMemo, useContext } from 'react';
import { Form, Space, Button, Input, Table, Modal, Popconfirm } from 'antd';
import { observer } from 'mobx-react';
import { constant } from '@utils'
import Store from './store';
import ModelContent from './modelContent';

import './style.less';

const Department = () => {
  const pageStore = useContext(Store);
  const [form] = Form.useForm();

  const columns = useMemo(
    () => [
      {
        title: '编号',
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: '部门名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '部门类型',
        dataIndex: 'deptType',
        align: 'center',
        render: (text) => constant.deptTypeToString(text)
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
    return componentWillUnmount;
  }, []);

  return (
    <div className="page-form-demo page-content">
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <Form form={form} name="horizontal_login" layout="inline" onFinish={onSearch}>
        <Form.Item
          name="keyword"
        >
          <Input placeholder="名称" allowClear />
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

export default observer(Department);
