import React, { useEffect, useContext, useState } from 'react'
import { Button, Form, Select, Input, Row, Col, Table, Spin, Space, message, DatePicker } from 'antd'
import { observer } from 'mobx-react';
import styles from './index.less'
import moment from 'moment'
import Store from './store';

const FormItem = Form.Item;

const SysLog = () => {
    const pageStore = useContext(Store);
    const [form] = Form.useForm();

    useEffect(() => {
        const values = form.getFieldsValue();
        pageStore.getSysLogList(values)
    }, [])

    const load = () => {
        const values = form.getFieldsValue();
        pageStore.getSysLogList(values)
    }

    const onChange = (current, size) => {
        pageStore.setState({current, size})
        load()
    }

    const onShowSizeChange = (current, size) => {
        pageStore.setState({size})
        load()
    }

    const showTotal = (total, range) => `${range[0]}-${range[1]} 共 ${total} 条`

    const column = [
        {
            title: '序号',
            dataIndex: 'index',
            width: '5%',
            render: (text, record, index) => (index + 1) + (current - 1) * size
        },
        {
            title: '账号',
            dataIndex: 'uid',
        },
        {
            title: '操作人',
            dataIndex: 'uname',
        },
        {
            title: '事件',
            dataIndex: 'operateFunc',
        },
        {
            title: '方法名',
            dataIndex: 'visitMethod',
        },
        {
            title: '级别',
            dataIndex: 'logType',
        }, {
            title: '地址',
            dataIndex: 'url',
        },
        {
            title: '操作时间',
            dataIndex: 'createTime',
            render: (text) => moment(text).format("YYYY-MM-DD HH:mm:ss")
        },
    ];

    const {tableData, current, size, total, loading} = pageStore.state
    return (
        <div className="page-form-demo page-content">
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Form layout='inline' form={form} onFinish={load}>
                <FormItem name="startTime">
                    <DatePicker placeholder='开始时间' style={{ width: '12vw' }} />
                </FormItem>
                <FormItem name="endTime">
                    <DatePicker placeholder='结束时间' style={{ width: '12vw' }} />
                </FormItem>
                <Button htmlType='submit' type='primary' loading={loading}>查询</Button>
            </Form>
            <Spin spinning={loading}>
                <Table
                    rowKey='id'
                    columns={column}
                    dataSource={tableData}
                    pagination={{
                        current: current,
                        pageSize: size,
                        showSizeChanger: true,
                        total: total,
                        onChange: onChange,
                        onShowSizeChange: onShowSizeChange,
                        pageSizeOptions: ['20', '30', '50'],
                        showTotal: showTotal,
                    }}
                />
            </Spin>
            </Space>
        </div>
    )
}

export default observer(SysLog)
