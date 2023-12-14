package com.sinosoft.ms.application.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.ToString;

import java.io.Serializable;
import java.util.Date;

@Data
@ToString
@TableName("system_log")
@JsonIgnoreProperties(ignoreUnknown = true)
public class OperateLogInfoEntity implements Serializable {

	/**
	 * 每条数据的记录时间
	 */
	@TableId
	public String id;

	/**
	 * 登录人的账号
	 */
	public String uid;

	/**
	 * 登录人的姓名
	 */
	public String uname;

	/**
	 * 访问者的机器ip
	 */
	public String accessIp;

	/**
	 * 操作的功能，如登录，插入
	 */
	public String operateFunc;

	/**
	 * 调用入口的方法名
	 */
	public String visitMethod;

	/**
	 * 调用方法耗时
	 */
	public String methodCostTime;

	/**
	 * 日志等级，如ERROR,DEBUG,INFO
	 */
	public String logType;

	/**
	 * 访问的路径
	 */
	public String url;

	/**
	 * 请求方法，如post,get
	 */
	public String method;

	/**
	 * 访问错误的方法
	 */
	public String visitMethodErrInfo;

	/**
	 * 状态值，该条记录是否被标记为有效
	 */
	public String status;

	/**
	 * 用户登录时间
	 */
	public Date loginTime;

	/**
	 * 数据创建时间
	 */
	public Date createTime;

	/**
	 * 数据更新时间
	 */
	public Date updateTime;

	@TableField(exist = false)
	public Date startTime;

	@TableField(exist = false)
	public Date endTime;
}
