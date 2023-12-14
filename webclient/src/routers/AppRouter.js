import React, { Suspense } from 'react';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import { Provider } from 'mobx-react';
import LoadingPage from '@components/LoadingPage';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import browserHistory from './history';
import config from './config';
import PrivateRouter from './privateRouter';
import Login from '@/pages/Login';

const routingStore = new RouterStore();
const history = syncHistoryWithStore(browserHistory, routingStore);
const stores = {
  // Key can be whatever you want
  routing: routingStore,
  // ...other stores
};

const renderRoutes = (routes) => {
  console.log('routes===>', routes)
  if (!Array.isArray(routes)) {
    return null;
  }
  return (
    <Switch>
      <Route path="/login" exact component={Login} />
      <Route path="/SSOROTAL" component={Login} />
      {routes.map((route, index) => {
        if (route.redirect) {
          return (
            <Redirect
              key={route.path || index}
              exact={route.exact}
              strict={route.strict}
              from={route.path}
              to={route.redirect}
            />
          );
        }

        return (
          <PrivateRouter
            key={route.path || index}
            path={route.path}
            exact={route.exact}
            strict={route.strict}
            render={() => {
              const renderChildRoutes = renderRoutes(route.childRoutes);
              if (route.component) {
                return (
                  <Suspense fallback={<LoadingPage />}>
                    <route.component route={route}>{renderChildRoutes}</route.component>
                  </Suspense>
                );
              }
              return renderChildRoutes;
            }}
          />
        );
      })}
    </Switch>
  );
};

const AppRouter = () => (
  <Provider {...stores}>
    <BrowserRouter history={history}>{renderRoutes(config)}</BrowserRouter>
  </Provider>
);

export default AppRouter;
