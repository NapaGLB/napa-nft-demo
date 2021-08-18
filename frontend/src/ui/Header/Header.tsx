import React from 'react';
import styled from 'styled-components';
import Box from 'ui/Box';
import RightHeader from './RightHeader';

const CommonHeader: React.FC = () => (
  <Container>
    <Box w='1050px' h='100%' m='auto'>
      <RightHeader />
    </Box>
  </Container>
);

const Container = styled.div`
  height: 64px;
  max-width: 100vw;
  background-color: ${(p) => p.theme.darkBlue};
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 100;
  color: white;
  .ant-row {
    height: 100%;
    width: 1200px;
    margin: 0 auto;
  }
`;

export default CommonHeader;
