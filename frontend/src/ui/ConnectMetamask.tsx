import React from 'react';
import styled from 'styled-components';
import useWallet from 'hooks/useWallet';
import { Link } from 'react-router-dom';
import Button from './Button';
import { Text } from './Typography';

const ConnectMetamask: React.FC = () => {
  const { connect, active, account } = useWallet();
  const handleConnectWallet = async (): Promise<any> => {
    await connect();
  };

  return (
    <Container>
      <div>
        <StyledText $size='18px' strong>
          {active ? 'Connected to Ethereum' : 'Ethereum Available'}
        </StyledText>
        <StyledButton onClick={handleConnectWallet}>
          <Text $size='18px' $color='#0080FF' strong>
            {active && account
              ? (<Link to={`/account/${account}`}>{account?.slice(0, 10)}</Link>)
              : 'Allow access to MetaMask'}
          </Text>
        </StyledButton>
      </div>
    </Container>
  );
};

const StyledText = styled(Text)`
  display: block;
`;

const StyledButton = styled(Button)`
  border: none;
  padding: 0;
  margin-top: 5px;
  box-shadow: none;
  &:hover,
  &:active,
  &:focus,
  &:visited {
    background: none !important;
    border: none !important;
  }
  .ant-typography {
    &:hover,
    &:active,
    &:focus,
    &:visited {
      color: black;
    }
  }
`;

const Container = styled.div`
  width: 300px;
  height: 120px;
  border: 1px solid ${(p) => p.theme.border};
  background: ${(p) => p.theme.surface};
  position: fixed;
  z-index: 100;
  top: 20%;
  right: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  box-shadow: 15px 5px 30px 5px rgb(0 0 0 / 5%);
`;

export default ConnectMetamask;
