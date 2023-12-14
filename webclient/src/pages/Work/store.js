import { createContext } from 'react';
import { observable, action } from 'mobx';
import { message } from 'antd';
import { request, api } from '@services';

class ProjectStore {
  @observable tableData = [];

  @observable loading = false;

  @observable isModalVisible = false;

  @observable stateModalVisible = false;

  @observable editItem = {};

  @observable keyword = '';

  @observable params = {};

  @observable sort = null;

  @observable sortType = null;

  @observable depts = []

  @observable readOnly = false;

  @observable pagination = {
    pageSize: 10,
    currentPage: 1,
    total: 0,
  };

  @action.bound changePage(page, size) {
    this.pagination.currentPage = page;
    if(size) {
      this.pagination.pageSize = size
    }
  }

  @action.bound setData(items) {
    Object.keys(items).forEach((key) => {
      console.log(key, this[key], items[key])
      this[key] = items[key]
    })
  }

  // 获取数据列表
  @action.bound async getData() {
    this.loading = true;
    return request({
      url: api.work.page,
      method: 'get',
      data: {
        page: this.pagination.currentPage,
        size: this.pagination.pageSize,
        ...this.params,
        sort: this.sort,
        sorttype: this.sortType ? (this.sortType === 'descend' ? 'desc' : 'asc') : null
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

  @action.bound save(values) {
    console.log('values', values);
    return request({
      url: api.work.save,
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

  @action.bound delete(id) {
    return request({
      url: api.work.delete,
      method: 'post',
      data: id,
    }).then((res) => {
      if (res.success) {
        message.success('删除成功');
        this.getData();
      }
    });
  }

  @action.bound openModel(record, readOnly = false) {
    this.isModalVisible = true;
    this.editItem = record;
    this.readOnly = readOnly
  }

  @action.bound closeModel() {
    this.isModalVisible = false;
    this.stateModalVisible = false;
    this.editItem = null;
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
