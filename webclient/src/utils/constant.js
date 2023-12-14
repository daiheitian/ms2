import React from 'react'
import { Tag } from 'antd'
// form表单布局
export default {
  formItemLayout: {
    labelCol: {
      sm: { span: 8 },
    },
    wrapperCol: {
      sm: { span: 12 },
    },
  },
  roleToString: (roleId) => roleId == 1 ? "管理员" : roleId == 2 ? "学校管理员" : roleId == 3 ? "学院管理员" : roleId == 4 ? "审计员" : "未知",
  roleToTag: (text) => text == 1 ? <Tag color="blue">管理员</Tag> : text == 2 ? <Tag color="green">学校管理员</Tag> : text == 3 ? <Tag color="red">学院管理员</Tag> : text == 4 ? <Tag color="orange">审计</Tag> : <Tag color="gray">无</Tag>,
  sexToString: (sex) => sex == 1 ? "男" : sex == 0 ? "女" : "-",
  statusToString: (text) => text == 1 ? <Tag color="blue">进行中</Tag> : (text == 2 ? <Tag color="green">已完成</Tag> : text == 3 ? <Tag color="red">未完成</Tag> : <Tag color="gray">无</Tag>),
  deptTypeToString: (text) => text == 1 ? "学院" : text == 2 ? "管理部门" : "-",
}