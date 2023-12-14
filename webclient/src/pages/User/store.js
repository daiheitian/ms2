import { createContext } from 'react';
import { observable, action } from 'mobx';
import { message } from 'antd';
import { request, api } from '@services';
import {encrypt} from '@utils'

class ProjectStore {
  @observable tableData = [];

  @observable depts = [];

  @observable loading = false;

  @observable isModalVisible = false;

  @observable isAdd = true;

  @observable editItem = {};

  @observable keyword = '';

  @observable pagination = {
    size: 'small',
    pageSize: 10,
    currentPage: 1,
    total: 0,
    showSizeChanger: true,
    onChange: (page, size) => {
      this.pagination.currentPage = page;
      this.pagination.pageSize = size;
      this.getData();
    },
    onShowSizeChange: (page, size) => {
      this.pagination.currentPage = 1;
      this.pagination.pageSize = size;
      this.getData();
    },
    showTotal: (total) => `共 ${total} 条记录`,
  };

  // 获取数据列表
  @action.bound async getData(params = {}) {
    this.loading = true;
    return request({
      url: api.user.page,
      method: 'get',
      data: {
        page: this.pagination.currentPage,
        size: this.pagination.pageSize,
        ...params
      },
    }).then((res) => {
      this.loading = false;
      const { success, data, total } = res;
      if (success) {
        this.tableData = data;
        this.pagination.total = total;
      } else {
        message.error(`服务器请求错误:${res.message}`)
      }
    });
  }

  @action.bound openModel(record) {
    this.isModalVisible = true;
    this.editItem = record;
    this.isAdd = !record;
  }

  @action.bound closeModel() {
    this.isModalVisible = false;
    this.editItem = null;
  }

  @action.bound save(values) {
    if(values.password) {
      values.password = encrypt.encrypt(values.password)
    }
    return request({
      url: api.user.save,
      method: 'post',
      data: values,
    }).then((res) => {
      if (res.success) {
        message.success('保存成功');
        this.closeModel();
        this.getData();
      }
    });
  }

  @action.bound async changePassword(values) {
    const {oldPassword, newPassword} = values
    values.oldPassword = encrypt.encrypt(oldPassword)
    values.newPassword = encrypt.encrypt(newPassword)
    const res = await request({
      url: api.user.changePassword,
      method: 'post',
      data: values,
    });
    if (res.success) {
      message.success('密码修改成功');
    }
  }

  @action.bound delete(id) {
    return request({
      url: api.user.delete,
      method: 'post',
      data: id,
    }).then((res) => {
      if (res.success) {
        message.success('删除成功');
        this.getData();
      }
    });
  }

  @action.bound destroyCom() {
    this.pagination.size = 'small';
    this.pagination.pageSize = 10;
    this.pagination.currentPage = 1;
    this.pagination.total = 0;
  }

  @action.bound getDepts(value) {
    return request({
      url: api.department.list,
      method: 'get',
      data: {keyword: value}
    }).then(res => {
      if(res.success) {
        this.depts = res.data
      }
    })
  }
}

export default createContext(new ProjectStore());
