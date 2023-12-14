import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Input, Button, Space } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { observer } from 'mobx-react';
import { appStores } from '@/stores';
import './style.less';

const LoginPage = () => {
  const history = useHistory();
  const { globalStore } = appStores();
  const [s, setS] = useState(Math.random());
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = (values) => {
    console.log('登录信息', values);
    globalStore.setData({ logining: true });
    globalStore.login({...values, s}).then(
      (res) => {
        globalStore.setData({ logining: false });
        if (res.success) {
          const { token, ...user } = res.data
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('user', JSON.stringify(user));
          history.push('/');
        }else{
          setS(Math.random())
        }
      },
      () => {
        globalStore.setData({ logining: false });
      },
    );
  };

  useEffect(() => {
    // const otherToken = sessionStorage.getItem('otherToken');
    // console.log('login otherToken', otherToken);
    // if (otherToken) {
    //   console.log('登录');
    //   handleSubmit({ username: otherToken, password: '123456' });
    // }
  }, []);

  return (
    <div className="page-login">
      <Form onFinish={handleSubmit} autoComplete="off" className="login-form">
        <div className="login-title">{globalStore.appTitle}</div>
        <Form.Item name="username" rules={[{ required: true, message: '请输入用户名！' }]}>
          <Input prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: '请输入密码！' }]}>
          <Input.Password 
            prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} 
            placeholder="密码" 
            visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }} 
            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} 
          />
        </Form.Item>
        <Form.Item name="captcha" rules={[{ required: true, message: '请输入验证码！' }]}>
          <Space size={8}>
            <Input prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="验证码" />
            <img onClick={()=>setS(Math.random())} width={120} alt="图片验证码" src={`ms/captcha?s=${s}`} />
          </Space>
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked" initialValue>
        {/* <Checkbox>记住我</Checkbox>
          <a className="login-form-forgot" href="">
            忘记密码
          </a> */}
          <Button htmlType="submit" className="login-form-button btn-green-default" loading={globalStore.logining}>
          登录
          </Button> 
        </Form.Item>
      </Form>
    </div>
  );
};

export default observer(LoginPage);
