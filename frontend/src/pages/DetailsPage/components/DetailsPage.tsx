import React from 'react';
import MainContainer from 'ui/MainContainer';
import Spaces from 'utils/spaces';
import { Redirect } from 'react-router-dom';
import { LIMIT_SPACE_SUPPLY_TOTAL } from 'environment';
import BreadCrumb from 'ui/Breadcrumb';
import request from 'utils/request';
import Avatar from './Avatar';
import Information from './Information';
import TransactionsHistory from './TransactionsHistory';

const TOKEN_ID_REGEX = /^\d+$/;

const DetailsPage: React.FC = (props: any) => {
  const id = (props as any)?.match?.params?.id;
  request.getData(`/transactions/space/${id}`, {});
  const space = Spaces.find((item) => item.id === Number(id));

  return !TOKEN_ID_REGEX.test(id) || Number(id) > (LIMIT_SPACE_SUPPLY_TOTAL - 1) ? (
    <Redirect to='/detail/0' />
  ) : (
    <MainContainer>
      <BreadCrumb crumbs={[id]} />
      <Avatar data={space} />
      <Information data={space} />
      <TransactionsHistory data={space} />
    </MainContainer>
  );
};

export default DetailsPage;
