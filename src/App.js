import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import menuData from './router/menu';
import Layout from '@/components/Layout';

const App = () => {
  const menu = menuData.map(({ component, ...rest }) => rest);
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route
            path="/"
            render={() => (
              <Layout menu={menu}>
                <Switch>
                  {menuData.map(item => (
                    <Route key={item.path} path={item.path} exact component={item.component} />
                  ))}
                </Switch>
              </Layout>
            )}
          />
          <Route render={() => <Redirect to="/404" />} />
        </Switch>
      </div>
    </Router>
  );
};

export default (process.env.NODE_ENV === 'development' ? hot(App) : App);
