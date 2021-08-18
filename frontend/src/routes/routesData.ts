/* eslint-disable no-unused-vars */
import Account from 'pages/Account';
import Attributes from 'pages/Attributes';
import Bids from 'pages/Bids';
import DetailsPage from 'pages/DetailsPage';
import ForSale from 'pages/ForSale';
import HomePage from 'pages/Home';
import TopOwners from 'pages/TopOwners';
import TopSale from 'pages/TopSale';
import { FunctionComponent } from 'react';

type RouteType = {
  path: string;
  component: FunctionComponent;
  exact?: boolean;
};

/**
 * * Reused when you want to redirect to any page.
 */
export enum routesEnum {
  login = '/login',
  home = '/home',
  topOwners = '/topOwners',
  detail = '/detail/:id',
  attributes= '/attributes',
  notFoundPage = '/*',
  default = '/',
  forSale='/forSale',
  bids='/bids',
  topSale='/topSale',
  account='/account/:id',
}

const privateRoutes: RouteType[] = [];
const publicRoutes: RouteType[] = [
  {
    path: routesEnum.home,
    component: HomePage,
    exact: true
  },
  {
    path: routesEnum.default,
    component: HomePage,
    exact: true
  },
  {
    path: routesEnum.topOwners,
    component: TopOwners,
    exact: true
  },
  {
    path: routesEnum.detail,
    component: DetailsPage,
    exact: false
  },
  {
    path: routesEnum.forSale,
    component: ForSale,
    exact: false
  },
  {
    path: routesEnum.topSale,
    component: TopSale,
    exact: false
  },
  {
    path: routesEnum.bids,
    component: Bids,
    exact: false
  },
  {
    path: routesEnum.account,
    component: Account,
    exact: false,
  },
  {
    path: routesEnum.attributes,
    component: Attributes,
    exact: true
  }
];
export { privateRoutes, publicRoutes };
