import { createContext } from 'react';
import { observable, action } from 'mobx';
import { message } from 'antd';
import { request, api } from '@services';

class ProjectStore {
  @observable tableData = [];

  @observable workStatus = [];

  @observable loading = false;

  @observable isModalVisible = false;

  @observable isAdd = true;

  @observable tid = '';

  @observable editItem = {};

  @observable keyword = '';

  @observable searchType = 'month';

  @observable searchDate;

  @observable pagination = {
    size: 'small',
    pageSize: 10,
    currentPage: 1,
    total: 0,
    showSizeChanger: true,
    onChange: (page, size) => {
      this.pagination.currentPage = page;
      this.pagination.pageSize = size;
      this.getTagList();
    },
    onShowSizeChange: (page, size) => {
      this.pagination.currentPage = 1;
      this.pagination.pageSize = size;
      this.getTagList();
    },
    showTotal: (total) => `共 ${total} 条记录`,
  };

  @action.bound changeType = (val) => {
    this.searchType = val;
  }

  @action.bound changeDate = (val) => {
    this.searchDate = val;
  }

  @action.bound openModel = (flag, record) => {
    console.log('record', record);
    this.isAdd = flag;
    this.isModalVisible = true;
    if (!flag) {
      this.editItem = record;
    } else {
      this.editItem = {};
    }
  }

  @action.bound closeModel = () => {
    this.isModalVisible = false;
  }

  @action.bound destroyCom = () => {
    this.tid = '';

    this.pagination.size = 'small';
    this.pagination.pageSize = 10;
    this.pagination.currentPage = 1;
    this.pagination.total = 0;
  }

  @action.bound
  async countByDept(year, month) {
    return request({
      url: api.work.countByDept,
      method: 'get',
      data: {year,month},
    }).then(res => {
      if (res.success) {
        this.workStatus = res.data
      }
    })
  }

  @action
  getChatOption = () => {
    const unFinish = []; const finished = []; const unKnow = []; const progress = []
    const xData = this.workStatus.map(w => `${w.department}(${w.count})`)
    this.workStatus.forEach(work => {
      progress.push(work.progress);
      unFinish.push(work.unFinish);
      finished.push(work.finished);
      unKnow.push(work.count - work.unFinish - work.finished - work.progress)
    })
    const series = Object.entries({ "未完成": unFinish, "进行中": progress, "已完成": finished, "无": unKnow }).map(([key, value]) => ({
      name: key,
      type: 'bar',
      stack: 'work',
      emphasis: {
        focus: 'series'
      },
      data: value
    }))

    return {
      color: [
        '#EE6666',
        '#5470C6',
        '#91CC74',
        '#999999',
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {},
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      yAxis: [
        {
          type: 'category',
          data: xData,
          axisLabel: {
            interval: 0,
          },
        }
      ],
      xAxis: [
        {
          type: 'value'
        }
      ],
      series
    };
  }
}

export default createContext(new ProjectStore());
