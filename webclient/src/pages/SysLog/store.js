/*
 * 患者列表-门(急)诊Store
 * @Author: Yuan.zuoxin 
 * @Date: 2019-07-10 11:39:04 
 * @Last Modified by: Yuan.zuoxin
 * @Last Modified time: 2019-08-13 17:27:56
 */
import { createContext } from 'react';
import { observable, action } from "mobx";
import { request, api } from '@services';
import moment from 'moment';
import { message } from 'antd';

class SysLogStore {
    @observable state = {
        loading: false,
        tableData: [],
        total: 0,//总数据量
        current: 1,//当前页数
        size: 20,//当前分页尺寸
    }

    @action.bound
    setState = (state) => {
        Object.keys(state).forEach(key => {
            this.state[key] = state[key]
        })
    }

    @action.bound
    async getSysLogList(values) {
        this.setState({ loading: true })
        request({
            url: api.system.getLogs,
            method: 'get',
            data: {
                page: this.state.current,
                size: this.state.size,
                uname: values.uname,
                operateFunc: values.operatefunc,
                visitMethod: values.visitmethod,
                startTime: values.startTime ? moment(values.startTime).startOf('d').valueOf() : null,
                endTime: values.endTime ? moment(values.endTime).endOf('d').valueOf() : null,
            }
        }).then(res => {
        this.setState({ loading: false })
            const { success, data, total } = res
            if (success) {
                this.setState({tableData:data, total})
            } else {
                message.error(`服务器请求错误:${res.message}`)
            }
        })
    }


}
export default createContext(new SysLogStore());