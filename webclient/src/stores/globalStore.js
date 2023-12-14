import { observable, action } from 'mobx';
import { request, api } from '@services';
import { encrypt } from '@utils'

export default class GlobalStore {

  @observable appTitle = '任务管理系统';

  @observable logining = false;

  @observable collapsed = false; // 菜单收起展开

  @observable easyPass = false;

  @observable userInfo = {
    // 当前用户信息
    // loginName: '',
  };

  @observable menu = [];

  @observable works = [];

  @action.bound toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }

  @action.bound setCollapsed(status) {
    this.collapsed = status;
  }

  @action.bound setData(data = {}) {
    Object.entries(data).forEach((item) => {
      this[item[0]] = item[1];
    });
  }

  @action.bound async login({ username, password, s, captcha }) {
    const self = this;
    return request({
      url: api.system.login,
      method: 'post',
      data: {
        username,
        password: encrypt.encrypt(password),
        s,
        captcha
      },
    }).then((res) => {
      self.logining = true;
      if(res.success) {
        this.easyPass = !!Number(res.data.easy)
      }
      // 请求menu
      // this.initMenu();
      return res;
    });
  }

  @action.bound initMenu(user) {
    // return request({
    //   url: api.system.getLevel1Menu,
    //   method: 'get',
    //   data: {},
    // }).then((res) => {
    //   if (res.success && res.data) {
    //     this.menu = res.data;
    //   }
    //   return res;
    // });
    // Object.keys(user.roles).forEach((r) => {
    //   debugger;
    // if (r == '2dc2fcc1-66d1-4b6a-8e77-3a6628cee3c4') {

    //   return;
    // } else {
    //   this.menu = doctorRoutes;
    // }
    // });
    if (user.roleId == 1) {
      this.menu = [{ url: "/", name: "首页" },
      { url: "/user", name: "用户" },
      { url: "/department", name: "部门" },
      { url: "/task", name: "任务" },
      { url: "/changePassword", name: "修改密码" },
      { url: "/workStatistics", name: "任务统计" }, 
      { url: "/workStaticCount", name: "状态统计" },
      { url: "/syslog", name: "系统日志" },
      ]
    } else if (user.roleId == 2) {
      this.menu = [{ url: "/", name: "首页" }, { url: "/task", name: "任务" }, { url: "/workStatistics", name: "统计" }, { url: "/workStaticCount", name: "状态统计" }, { url: "/changePassword", name: "修改密码" }]
    } else if (user.roleId == 3) {
      this.menu = [{ url: "/", name: "首页" }, { url: "/task", name: "任务" }, { url: "/changePassword", name: "修改密码" }]
    } else if (user.roleId == 4) {
      this.menu = [{ url: "/syslog", name: "系统日志" }, { url: "/changePassword", name: "修改密码" }]
    }

    return this.menu
  }

  @action.bound
  async getUserInfo() {
    if (Object.keys(this.userInfo).length > 0) {
      return this.userInfo
    }
    await request({
      url: api.user.info,
      method: 'get',
    }).then((res) => {
      if (res.success) {
        this.userInfo = res.data;
      }
    });

    return this.userInfo
  }

  @action.bound
  clear() {
    this.userInfo = {}
    this.menu = []
  }

  @action.bound
  async checkWork() {
    return request({
      url: api.work.check,
      method: 'get',
    }).then(res => {
      if (res.success) {
        this.works = res.data
      }
    })
  }

  @action.bound
  async logout() {
    return request({
      url: api.user.logout,
      method: 'post'
    })
  }
}
