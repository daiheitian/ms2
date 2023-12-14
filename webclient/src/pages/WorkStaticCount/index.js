import React, { useEffect, useMemo, useContext, useState } from 'react';
import { Form, Space, Button, Input, Table, Select, Tag, Modal, Popconfirm, DatePicker, message } from 'antd';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import qs from 'qs'
import Store from './store';
import { api, request } from '@services';
import axios from 'axios';
import fileDownload from 'js-file-download'

// import { transformTime } from '../../utils';
import './style.less';

const { Option } = Select;
const Page = () => {
  const pageStore = useContext(Store);
  const [form] = Form.useForm();

  const onSearch = (values) => {
    console.log('Finish:', values);
    Object.keys(values).forEach(key => {
      if (values[key] === null || values[key] === '') {
        delete values[key]
      }
    })

    if(values.year) {
      values.year = values.year.year()
    }

    pageStore.changePage(1);
    pageStore.setData({ params:values })
    pageStore.getData()
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

  const columns = useMemo(
    () => [
      {
        title: '序号',
        align: 'center',
        sorter: true,
        render: (text, record, index) => <span>{(pageStore.pagination.currentPage-1)*pageStore.pagination.pageSize + index+1}</span>
      },
      {
        title: '部门',
        dataIndex: 'department',
        align: 'center',
      },
      {
        title: '未完成',
        dataIndex: 'unFinish',
        align: 'center',
        sorter: true
      },
      {
        title: '进行中',
        dataIndex: 'progress',
        align: 'center',
        sorter: true
      },
      {
        title: '已完成',
        dataIndex: 'finished',
        align: 'center',
        sorter: true
      },
    ],
    [pageStore],
  );

  const onSummary = (pageData) => {
    let total1 = 0; let total2 = 0; let total3 = 0;
    pageData.forEach(({ unFinish, progress, finished }) => {
      total1+=unFinish;
      total2+=progress;
      total3+=finished;
    });

    return (
      <>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} align='center'>总计</Table.Summary.Cell>
          <Table.Summary.Cell index={1} />
          <Table.Summary.Cell index={2} align='center'>
            {total1}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={3} align='center'>
            {total2}
          </Table.Summary.Cell>
          <Table.Summary.Cell index={4} align='center'>{total3}</Table.Summary.Cell>
        </Table.Summary.Row>
      </>
    );
  }

  const onTableChange = (record, filter, sort) => {
    if (sort.order) {
      pageStore.setData({
        sort: sort.field,
        sortType: sort.order
      })
    } else {
      pageStore.setData({
        sort: null,
        sortType: null,
      })
    }
    pageStore.getData()
  }

  return (
    <div className="page-form-demo page-content">
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Form form={form} name="horizontal_login" layout="inline" onFinish={onSearch}>
          <Space gutter={[16,16]} wrap>
            <Form.Item name="department">
              <Select style={{width:180}} placeholder="选择科室" optionFilterProp="children" showSearch allowClear>{pageStore.depts.map(d => <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>)}</Select>
            </Form.Item>
            <Form.Item
              name="year"
            >
              <DatePicker picker="year" />
            </Form.Item>
            <Form.Item
              name="mouth"
            >
              <Input placeholder="月份" type="number" allowClear min={1} max={12} />
            </Form.Item>
            <Form.Item shouldUpdate>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                >
                  查询
                </Button>
              </Space>
            </Form.Item>
          </Space>
        </Form>
        <Table 
          columns={columns} 
          dataSource={pageStore.tableData} 
          pagination={{
            size: 'small',
            pageSize: pageStore.pagination.pageSize,
            current: pageStore.pagination.currentPage,
            total: pageStore.pagination.total,
            showSizeChanger: true,
            onChange: (page, size) => {
              pageStore.changePage(page, size)
              pageStore.getData();
            },
            onShowSizeChange: (page, size) => {
              pageStore.changePage(1, size)
              pageStore.getData();
            },
            showTotal: (total) => `共 ${total} 条记录`}} 
          summary={onSummary}
          onChange={onTableChange} 
        />
      </Space>
    </div>
  );
};

export default observer(Page);
