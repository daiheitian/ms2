import React from 'react';
import { getUrlParams } from '@utils';
import { observer } from 'mobx-react';
import { Redirect, Route } from 'react-router-dom';

const privateRouter = (props) => {
  const { component, ...rest } = props;

  // const {token} = getUrlParams();
  // console.log('otherToken', token);
  // if(token) {
  //   sessionStorage.setItem('otherToken', token);
  // }
  const isLogin = !!sessionStorage.getItem('token'); // 是否登录
  return isLogin ? <Route {...rest} render={props.render} /> : <Redirect to="/login" />;
};

export default observer(privateRouter);
