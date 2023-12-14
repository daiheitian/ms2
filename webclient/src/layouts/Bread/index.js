import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, Icon } from 'antd';
import { Link } from 'react-router-dom';
import pathToRegexp from 'path-to-regexp';
import { find } from 'lodash';
import { EnvironmentOutlined, HomeOutlined } from '@ant-design/icons';
import './Bread.less';

const Bread = ({ menu }) => {
  // 匹配当前路由
  let pathArray = [];
  let current;

  const getMatchMenu = (menus) => {
    menu = menus.resources ? menus.resources : menus;
    pathArray.push(menu);
    if (menu.path && pathToRegexp(`${menu.path}`).exec(location.pathname)) {
      return menu;
    }
    if (menus && menus.childRoutes) {
      const findMenu = find(menus.childRoutes, (v) => !!getMatchMenu(v));
      if (findMenu) {
        return findMenu;
      } else {
        pathArray.pop();
      }
    } else {
      pathArray.pop();
    }
  };
  current = find(menu, (v) => {
    pathArray = [];
    return !!getMatchMenu(v);
  });
  if (!current) {
    pathArray.push({
      id: 404,
      name: 'Not Found',
    });
  }

  // // 递归查找父级
  const breads = pathArray.map((item, key) => {
    const content = (
      <span>
        {item.icon ? <Icon type={item.icon} style={{ marginRight: 4 }} /> : ''}
        {item.name}
      </span>
    );
    return (
      <Breadcrumb.Item key={key} separator="/">
        {pathArray.length - 1 !== key ? <Link to={item.path}>{content}</Link> : content}
      </Breadcrumb.Item>
    );
  });

  return (
    <div className="bread flex alignCenter">
      <Breadcrumb className="bread-title">
        <EnvironmentOutlined /> &nbsp;
        {breads}
      </Breadcrumb>
    </div>
  );
};

Bread.propTypes = {
  menu: PropTypes.array,
};

export default Bread;
