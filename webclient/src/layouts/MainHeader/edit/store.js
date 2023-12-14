import { createContext } from 'react';
import { observable, action } from 'mobx';
import { message } from 'antd';
import {request, api} from '@services';

class SpecialListStore {
  @observable isEditVisible = false;

  @action.bound
  updateExperts(data) {
    return request({
      url: api.basic.updateExperts,
      method: 'post',
      data,
    }).then((res) => {
      if (res.flag) {
        this.isEditVisible = false;
        message.success('修改成功');
      } else {
        message.error('修改失败');
      }
    });
  }
}

export default createContext(new SpecialListStore());
