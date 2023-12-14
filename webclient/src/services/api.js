const APIV1 = '/ms';

export default {
  system: {
    isLogin: `${APIV1}/user/isLogin`,
    login: `${APIV1}/login`,
    queryUserContext: `${APIV1}/getResourceMenu`,
    // getLevel1Menu: `${APIV1}/api/menu/getLevel1Menu`,
    getLevel1Menu: `${APIV1}/api/menu/getMenu`,
    getLogs: `${APIV1}/api/system_log/page`
  },
  user: {
    page: `${APIV1}/api/user/page`,
    info: `${APIV1}/api/user/info`,
    save: `${APIV1}/api/user/save`,
    delete: `${APIV1}/api/user/delete`,
    changePassword: `${APIV1}/api/user/change_password`,
    logout: `${APIV1}/api/user/logout`
  },
  work: {
    page: `${APIV1}/api/work/page`,
    save: `${APIV1}/api/work/save`,
    delete: `${APIV1}/api/work/delete`,
    import: `${APIV1}/api/work/import`,
    export: `${APIV1}/api/work/export`,
    check: `${APIV1}/api/work/check`,
    countByDept: `${APIV1}/api/work/count_dept`,
    statistics: `${APIV1}/api/work/statistics`,
    staticCount: `${APIV1}/api/work/static_count`
  },
  department: {
    list: `${APIV1}/api/department/list`,
    page: `${APIV1}/api/department/page`,
    save: `${APIV1}/api/department/save`,
    delete: `${APIV1}/api/department/delete`,
  },
};
