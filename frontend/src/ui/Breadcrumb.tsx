import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import Box from 'ui/Box';
import styled from 'styled-components';
import { Text } from 'ui/Typography';

interface IBreadCrumbProp {
  crumbs: Array<string>;
}
const BreadCrumbComponent: React.FC<IBreadCrumbProp> = (props: IBreadCrumbProp) => {
  const { crumbs } = props;
  return (
    <Box w='1050px' m='100px auto 0'>
      <StyledBreadCrumb>
        <Breadcrumb.Item>
          <Link to='/'>CryptoSpaces</Link>
        </Breadcrumb.Item>
        {crumbs &&
          crumbs.length > 0 &&
          crumbs.map((item) => (
            <Breadcrumb.Item key={item}>
              <Text $size='18px'>{item}</Text>
            </Breadcrumb.Item>
          ))}
      </StyledBreadCrumb>
    </Box>
  );
};

const StyledBreadCrumb = styled(Breadcrumb)`
  background-color: #f5f5f5;
  height: 50px;
  font-size: 18px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  .ant-breadcrumb-link a {
    color: ${(p) => p.theme.primary};
  }
  & > span:last-child .ant-typography {
    color: #777;
  }
  .ant-breadcrumb-separator {
    margin: 0 13px;
  }
`;

export default BreadCrumbComponent;
