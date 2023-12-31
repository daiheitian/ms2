/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */

/*
 *  接口请求封装
 * @Author: yzc
 * @Date: 2019-08-14 12:00:02
 */
import axios from 'axios'; // 引入axios
import Qs from 'qs'; // 引入qs模块，用来序列化post类型的数据
import { message } from 'antd'; // 提示框

let inError = false;
// 创建axios实例
const instance = axios.create({
  // baseURL: process.env.BASE_URL,
  timeout: 15000, // 请求超时时间
  // `transformRequest` 允许在向服务器发送前，修改请求数据
  transformRequest: [
    function (data) {
      // 对 data 进行任意转换处理
      return data;
    },
  ],
  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  transformResponse: [
    function (data) {
      // console.log(data);
      // 对 data 进行任意转换处理
      return JSON.parse(data);
    },
  ],
  headers: {
    'Cache-Control': 'no-cache',
  },
});

// 实例添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做处理...
    config.headers = Object.assign(
      config.method === 'post'
        ? {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=UTF-8',
          }
        : {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
      config.headers,
    );

    config.headers.authorization = sessionStorage.getItem(`token`)
      ? `Bearer ${sessionStorage.getItem(`token`)}`
      : '';

    const contentType = config.headers['Content-Type'];
    // 根据Content-Type转换data格式
    if (config.method === 'post') {
      if (contentType) {
        if (contentType.includes('multipart')) {
          // 类型 'multipart/form-data;'
          // config.data = data;
        } else if (contentType.includes('json')) {
          // 类型 'application/json;'
          // 服务器收到的raw body(原始数据) "{name:"nowThen",age:"18"}"（普通字符串）
          config.data = JSON.stringify(config.data);
        } else {
          // 类型 'application/x-www-form-urlencoded;'
          // 服务器收到的raw body(原始数据) name=nowThen&age=18
          config.data = Qs.stringify(config.data);
        }
      }
    } else if (config.method === 'get') {
      config.params = config.data;
    }
    return Promise.resolve(config);
  },
  (error) =>
    // 对请求错误做处理...
    Promise.reject(error),
);

// 实例添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做处理，以下根据实际数据结构改动！！...
    const { errorCode, message:errorMsg } = response.data || {};
    if (response.status == 401 || errorCode == 401) {
      // 请求超时，跳转登录页
      if (!inError) {
        message.warning(errorMsg || '授权失败或已过期，请尝试重新授权');
        inError = true;
        setTimeout(() => {
          message.destroy();
          // window.location.href = '/login';
          inError = false;
        }, 2000);
      }

      return Promise.resolve(response.data);
    } else if (response) {
      return Promise.resolve(response.data);
    }
  },
  (error) => {
    // 对响应错误做处理...
    // console.log(error);
    if (error.response) {
      return Promise.reject(error.response);
    } else if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      return Promise.reject({ msg: '请求超时' });
    } else {
      return Promise.reject({});
    }
  },
);

const request = async (opt) => {
  const options = {
    method: 'get',
    ifHandleError: true, // 是否统一处理接口失败(提示)
    ...opt,
  };
  // 匹配接口前缀 开发环境则通过proxy配置转发请求； 生产环境根据实际配置
  // options.baseURL = autoMatch(options.prefix);
  try {
    const res = await instance(options);
    console.log("res:", res);
    if (!res.success && options.ifHandleError && res.errorCode != 401) {
      // 自定义参数，是否允许全局提示错误信息
      message.error(res.message || '服务器错误');
    }
    return res;
  } catch (err) {
    console.error('ERROR:请求处理失败！', err);
    if (options.ifHandleError) {
      // 自定义参数，是否允许全局提示错误信息
      message.error(err.message || err.msg || '请求处理失败！');
    }
    return err;
  }
};

export default request;
