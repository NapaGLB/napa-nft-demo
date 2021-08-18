import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { routesEnum } from './routesData';

type Props = {
  component: React.FC;
  path: string;
  exact: boolean;
};

const PrivateRoute: React.FC<Props> = (props: Props) => {
  /**
   * TODO: Create useAuth hook to check if use is authenticated or not.
   */
  const isAuth = true;
  const { path, exact, component } = props;
  return isAuth ? (
    <Route path={path} exact={exact} component={component} />
  ) : (
    <Redirect to={routesEnum.login} />
  );
};

export default PrivateRoute;
