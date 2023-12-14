import { createContext } from 'react';
import { observable, action } from 'mobx';
import { message } from 'antd';
import { request, api } from '@services';

class ProjectStore {
  @observable tableData = [];

  @observable loading = false;

  @observable keyword = '';

  @observable params = {};

  @observable sort = null;

  @observable sortType = null;

  @observable depts = []

  @observable pagination = {
    pageSize: 10,
    currentPage: 1,
    total: 0
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
      url: api.work.staticCount,
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
