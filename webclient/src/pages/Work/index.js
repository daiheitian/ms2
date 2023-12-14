import React, { useEffect, useMemo, useContext, useState } from 'react';
import { Form, Space, Button, Input, Table, Select, Tag, Modal, Popconfirm, Upload, message } from 'antd';
import Icon from '@ant-design/icons';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import qs from 'qs'
import Store from './store';
import { api, request } from '@services';
import axios from 'axios';
import fileDownload from 'js-file-download'

// import { transformTime } from '../../utils';
import ModelContent from './modelContent';
import StateModel from './stateModel';
import LabelEditor from '@components/LabelEditor';
import './style.less';

const NewSvg = () => (<svg t="1699021881028" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4067" width="1.8em" height="1.8em"><path d="M489.7 453.6c-11.9 0-22.1 4.2-30.8 12.5-8.6 8.4-14.1 19.3-16.3 32.7h87.8c-0.1-14.4-3.7-25.6-10.8-33.5-7-7.8-17-11.7-29.9-11.7z m212.5-154.9H321.8C197.6 298.7 97 394.2 97 512v213.3h605.2C826.4 725.3 927 629.8 927 512S826.4 298.7 702.2 298.7zM373.6 594H344v-90.7c0-32.8-12.6-49.2-37.8-49.2-13.1 0-23.8 4.6-32.2 13.8-8.4 9.2-12.6 20.9-12.6 35v91h-29.8V434.6h29.7V461h0.7c12.7-20.1 31.1-30.2 55.2-30.2 18.4 0 32.5 5.6 42.1 16.8 9.6 11.2 14.5 27.5 14.5 49V594z m186.6-72.5H442.6c0.5 17 5.4 30.2 14.7 39.4 9.3 9.3 22.3 13.9 39.1 13.9 18.8 0 37.1-6.1 51.8-17.2v25.3c-14.8 9.9-34.4 14.8-58.8 14.8-24.3 0-43.3-7.3-56.9-21.9-13.6-14.6-20.4-34.9-20.4-60.8 0-24.4 7.5-44.6 22.4-60.4 14.9-15.8 33.5-23.8 55.7-23.8 22 0 39.2 6.7 51.5 20.1 12.4 13.4 18.5 32.2 18.5 56.3v14.3zM765.1 594h-31l-33.4-111.9c-1.4-4.8-2.4-9.9-2.7-15.3h-0.6c-0.3 4-1.5 9-3.5 15L657.7 594h-30.1l-50.5-159.5h31l33.6 118.2c1.2 4.8 2 9.7 2.3 14.6h1.2c0.4-5.1 1.3-10.1 2.9-15l36.2-117.8h27.5L747 552.9c1.2 4.8 2.1 9.7 2.4 14.7h1.4c0.3-5 1.3-9.9 2.7-14.7l32.8-118.4h28.9L765.1 594z" p-id="4068" fill="#1296db"></path></svg>)

const { Option } = Select;
const work = () => {
  const pageStore = useContext(Store);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([])
  const [exportLoading, setExportLoading] = useState(false)



  const onSearch = (values) => {
    console.log('Finish:', values);
    for (const key in values) {
      if (values[key] === null || values[key] === '') {
        delete values[key]
      }
    }

    pageStore.changePage(1, pageStore.pagination.pageSize)
    pageStore.setData({ params:values })
    pageStore.getData()
  };

  const onAdd = () => {
    pageStore.openModel()
  }

  const onCancel = () => {
    pageStore.setData({
      isModalVisible: false,
      editItem: null
    })
  }

  const onCancelState = () => {
    pageStore.setData({
      stateModalVisible: false,
      editItem: null
    })
  }

  const onDelete = (id) => {
    pageStore.delete(id)
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

  const onImport = (info) => {
    setFileList(info.fileList)
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`);
      setFileList([])
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  const onExport = async () => {
    setExportLoading(true)
    const values = form.getFieldsValue()
    for (const key in values) {
      if (!values[key]) {
        delete values[key]
      }
    }

    const params = qs.stringify(values)
    console.log(params)
    const res = await axios({
      url: `${api.work.export}?${params}`,
      method: 'get',
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
      }
    })
    if (res) {
      fileDownload(res.data, '任务.xls');
    }
    setExportLoading(false)
  }

  const copy = (record) => {
    const newRecord = { ...record, wid: null, status: 0, finishStatus: null }
    pageStore.openModel(newRecord)
  }

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

  const renderButtons = (record) => {
    const buttons = [<Button
      onClick={() => pageStore.openModel(record, true)}>查看</Button>]
    const user = JSON.parse(sessionStorage.getItem("user"))
    if (record.status === 1 && user.roleId !== "1") {
      if (user.roleId !== "2" && record.finishStatus != 2) {
        buttons.push(<Button type='primary' onClick={() => copy(record)}>变更</Button>)
      }
      if(record.finishStatus != 2){
        buttons.push(<Button type='primary' onClick={() => pageStore.setData({editItem:record, stateModalVisible:true})}>修改状态</Button>)
      }
    } else {
      buttons.push(
        <Button
          type="primary"
          onClick={() => {
            pageStore.openModel(record);
          }}
        >
          编辑
        </Button>)
      buttons.push(
        <Popconfirm title="是否确认删除？" onConfirm={() => { onDelete(record.wid) }} okText="确认" cancelText="取消">
          <Button
            type="primary"
            danger
          >
            删除
          </Button>
        </Popconfirm>)
    }

    return <Space>{buttons}</Space>
  }

  const columns = useMemo(
    () => [
      {
        title: '编号',
        dataIndex: 'wid',
        align: 'center',
        sorter: true,
        render: (text, record) => <span style={{color:record.status == 1 ?'#14CA15': ''}}>{text}</span>
      },
      {
        title: '科室',
        dataIndex: 'wdepartment',
        align: 'center',
        sorter: true,
        render:(text) => {
          const dept = pageStore.depts.filter(d => d.id == text)
          if(dept.length > 0) {
            return dept[0].name
          } else {
            return text
          }
        }
      },
      {
        title: '项目名',
        dataIndex: 'workname',
        align: 'center',
        sorter: true
      },
      {
        title: '子项目',
        dataIndex: 'subwork',
        align: 'center',
        sorter: true
      },
      {
        title: '项目月份',
        dataIndex: 'workmouth',
        align: 'center',
        sorter: true
      },
      {
        title: '项目年份',
        dataIndex: 'workyear',
        align: 'center',
        sorter: true
      },
      {
        title: '项目类别',
        dataIndex: 'worktype',
        align: 'center',
        render: (text) => text == 1 ? <Tag color="blue">常规工作</Tag> : (text == 2 ? <Tag color="green">重点工作</Tag> : <Tag color="red">创新工作</Tag>),
        sorter: true

      },
      {
        title: '事务',
        dataIndex: 'workcontent',
        render: (text, record) => <div>{text}{record.isNew&&<Icon component={NewSvg} />}</div>,
      },
      {
        title: '状态',
        dataIndex: 'finishStatus',
        align: 'center',
        sorter: true,
        render: (text) => text == 1 ? <Tag color="blue">进行中</Tag> : (text == 2 ? <Tag color="green">已完成</Tag> : text == 3 ? <Tag color="red">未完成</Tag> : <Tag color="gray">无</Tag>),
      },
      {
        title: '操作',
        align: 'center',
        dataIndex: 'action',
        render: (text, record) => renderButtons(record),
      },
    ],
    [pageStore],
  );

  const user = JSON.parse(sessionStorage.getItem("user"))
  return (
    <div className="page-form-demo page-content">
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Form form={form} name="horizontal_login" layout="inline" onFinish={onSearch}>
          <Space gutter={[16,16]} wrap>
            <Form.Item
              name="keyword"
            >
              <Input placeholder="搜索关键词" allowClear />
            </Form.Item>
            <Form.Item
              name="workyear"
            >
              <Input placeholder="搜索年份" type="number" allowClear />
            </Form.Item>
            <Form.Item
              name="workmouth"
            >
              <Input placeholder="搜索月份" type="number" allowClear />
            </Form.Item>
            <Form.Item
              name="worktype"
            >
              <Select placeholder="工作类型" allowClear>
                <Option value={1}>常规工作</Option>
                <Option value={2}>重点工作</Option>
                <Option value={3}>创新工作</Option>
              </Select>
            </Form.Item>
            {user.roleId !== "3" && <Form.Item
              name="wdepartment"
            >
              <Select style={{width:180}} placeholder="选择科室" optionFilterProp="children" showSearch allowClear>{pageStore.depts.map(d => <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>)}</Select>
            </Form.Item>}
            
            <Form.Item name="finishStatus">
              <Select allowClear placeholder="完成状态">
                <Option value={1}>进行中</Option>
                <Option value={2}>已完成</Option>
                <Option value={3}>未完成</Option>
              </Select>
            </Form.Item>
            <Form.Item name="status">
              <Select allowClear placeholder="提交状态">
                <Option value={0}>未提交</Option>
                <Option value={1}>已提交</Option>
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
                <Button
                  type="primary"
                  onClick={onAdd}
                >
                  新增
                </Button>
                <Upload
                  name="file"
                  accept='xls, xlsx'
                  action={api.work.import}
                  headers={{
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`
                  }}
                  fileList={fileList}
                  onChange={onImport}
                >
                  <Button type="primary">导入</Button>
                </Upload>
                <Button type="primary" loading={exportLoading} onClick={onExport}>导出</Button>
                <Button type="primary" href={`/template.xlsx?m=${Math.random()}`} target='download'>模板下载</Button>
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
          onChange={onTableChange} 
        />
      </Space>
      <Modal title={pageStore.editItem ? "编辑" : "新增"} onCancel={onCancel} visible={pageStore.isModalVisible} footer={null} destroyOnClose width={600}>
        <ModelContent />
      </Modal>
      <Modal title="修改状态" onCancel={onCancelState} visible={pageStore.stateModalVisible} footer={null} destroyOnClose width={600}>
        <StateModel />
      </Modal>
    </div>
  );
};

export default observer(work);
