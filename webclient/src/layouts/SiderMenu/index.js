/*
 * @Description:
 * @Author: yzc
 * @Date: 2020-12-09 18:36:39
 * @LastEditors: yao
 * @LastEditTime: 2021-08-18 16:01:33
 * @FilePath: /react-web-pro/src/layouts/SiderMenu/index.js
 */
import React, { useEffect, useState, useMemo } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Menu } from 'antd';
import { appStores } from '@stores';
import './style.less';

const renderMenuItem = (target) =>
  target
    .filter((item) => item.url && item.name && !item.hide)
    .map((subMenu) => {
      if (subMenu.childRoutes && !!subMenu.childRoutes.find((child) => child.url && child.name)) {
        return (
          <Menu.SubMenu
            popupOffset={[0, -8]}
            key={subMenu.url}
            title={
              <div>
                {!!subMenu.icon && subMenu.icon}
                <span className="text-sub">{subMenu.name}</span>
              </div>
            }
          >
            {renderMenuItem(subMenu.childRoutes)}
          </Menu.SubMenu>
        );
      }
      console.log(subMenu.name);
      return (
        <Menu.Item key={subMenu.url}>
          <Link to={subMenu.url} className="text-sub">
            <span>
              {!!subMenu.icon && subMenu.icon}
              <span>{subMenu.name}</span>
            </span>
          </Link>
        </Menu.Item>
      );
    });

const SiderMenu = ({ routes }) => {
  const { pathname } = useLocation();
  const { globalStore } = appStores();
  const [openKeys, setOpenKeys] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const user = sessionStorage.getItem('user');
    console.log('user', user);
    if (user) {
      // globalStore.initMenu(JSON.parse(user)).then((res) => {
      //   history.push(res.data[0].url);
      // });
      const menus = globalStore.initMenu(JSON.parse(user))
      if(menus){
        history.push(menus[0].url);
      }
    }
    const list = pathname.split('/').splice(1);
    setOpenKeys(list.map((item, index) => `/${list.slice(0, index + 1).join('/')}`));
  }, []);

  const getSelectedKeys = useMemo(() => {
    const list = pathname.split('/').splice(1);
    return list.map((item, index) => `/${list.slice(0, index + 1).join('/')}`);
  }, [pathname]);

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };
  return (
    <>
      <Menu
        mode="vertical"
        className="menu-style alignCenter"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        selectedKeys={getSelectedKeys}
        // onClick={() => {
        //   if (isMobile()) {
        //     globalStore.toggleCollapsed();
        //   }
        // }}
      >
        {renderMenuItem(routes)}
      </Menu>
    </>

    // <Layout.Sider
    //   width={isMobile() ? document.body.clientWidth : 200}
    //   breakpoint="lg"
    //   collapsedWidth="0"
    //   trigger={null}
    //   collapsible
    //   collapsed={globalStore.collapsed}
    //   onBreakpoint={(broken) => {
    //     globalStore.setCollapsed(broken);
    //   }}
    //   onCollapse={(collapsed, type) => {
    //     console.log(collapsed, type);
    //   }}
    //   className={isMobile() ? 'main-left-slider' : 'main-left-slider main-left-slider-shadow'}
    // >

    // </Layout.Sider>
  );
};

export default observer(SiderMenu);
