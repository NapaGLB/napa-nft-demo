import React from 'react';
import styled from 'styled-components';
import logo from 'assets/images/Logo.svg';
import { Link } from 'react-router-dom';

const RightHeader: React.FC = () => (
  <RightContainer>
    <div>
      <Link to='/'>
        <img src={logo} alt='logo' width='100px' height='32px' />
      </Link>
    </div>
  </RightContainer>
);

export default RightHeader;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: flex-start;
`;
