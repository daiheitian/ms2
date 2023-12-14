import React, { lazy } from 'react';

import BasicLayout from '@/layouts/BasicLayout';
// import BlankLayout from '@/layouts/BlankLayout';

const config = [
  {
    path: '/',
    component: BasicLayout, // 空白页布局
    childRoutes: [
      { path: '/', name: "首页", exact: true, component: lazy(() => import('@pages/Home')) },
      { path: '/user', name:"用户", exact: true, component: lazy(() => import('@pages/User')) },
      { path: '/department', name:"部门", exact: true, component: lazy(() => import('@pages/Department')) },
      { path: '/task', name:"任务", exact: true, component: lazy(() => import('@pages/Work')) },
      { path: '/changePassword', name:"修改密码", exact: true, component: lazy(() => import('@pages/User/changePassword')) },
      { path: '/workStatistics', name:"任务统计", exact: true, component: lazy(() => import('@pages/WorkStatistics')) },
      { path: '/workStaticCount', name:"状态统计", exact: true, component: lazy(() => import('@pages/WorkStaticCount')) },
      { path: '/syslog', name:"系统日志", exact: true, component: lazy(() => import('@pages/SysLog')) },
    ],
  },
];

export default config;
