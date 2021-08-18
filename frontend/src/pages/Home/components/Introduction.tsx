import React from 'react';
import { Row, Space } from 'antd';
import styled from 'styled-components';
import { Text } from 'ui/Typography';
import Button from 'ui/Button';
import Box from 'ui/Box';
import banner1 from 'assets/images/banner1.svg';
import Banner from './Banner';

const Introduction: React.FC = () => (
  <>
    <Box w='1050px' m='180px auto 0'>
      <Row justify='center' gutter={[0, 24]}>
        <StyledSpace>
          <StyledButton $bgType='highlight'>Blockchain</StyledButton>
        </StyledSpace>
        <StyledSpace>
          <Text $size='48px' strong>
            CryptoSpace
          </Text>
        </StyledSpace>
        <FirstParagraph>
          The CryptoSpace demo is a project including 12 unique NFTs with proof of ownership
          designed on the Ethereum blockchain using the ERC-721 standard. The collection is inspired
          from general different subjects on Space (for instance, Astrobiology, Astronaut, Rocket,
          Stars, Galaxies, and many other forms of matter and energy).
        </FirstParagraph>
        <SecondParagraph>
          CryptoSpace is an NFT platform which includes of a collective of NFTs and a website This
          website is a stored place where all these NFTs are minted and transferred into the
          possession of the users. In addition to this website will have a parachainbridge built
          between our existing token on Binance Smart Chain (BSC) to a new parachain on Ethereum
          (ETH).
        </SecondParagraph>
      </Row>
    </Box>
    <Box w='100%'>
      <BannerContainer>
        <Banner />
      </BannerContainer>
    </Box>
    <Box w='1050px' m='auto'>
      <Row justify='center' gutter={[0, 24]}>
        <ThirdParagraph>
          <Text $size='16px'>
            The demo of CryptoSpace are 12 unique generated characters. There are no alike NFTs on
            the Ethereum Blockchain. Via the marketplaces, you can buy, bid on,
            and offer Spacy subjects for sale.
          </Text>
        </ThirdParagraph>
        <FourthParagraph>
          <Text $size='16px'>
            The CryptoSpace was developed and supported by the core NFT team of NAPA GLOBAL. Our
            teammates are experienced full-stack developers who will support you building the back
            end and front end on a minimal site. See our marketplace instructions below to proceed
            your first buy with our Space subjects. You should also join the Telegram, which
            includes a bot that announces all upcoming offers and pre-sales in real time project.
          </Text>
        </FourthParagraph>
      </Row>
    </Box>
    <Box w='100%' m='auto'>
      <StyledSpace>
        <img src={banner1} alt='banner1' width='100%' />
      </StyledSpace>
    </Box>
  </>
);

const StyledButton = styled(Button)`
  color: ${(p) => p.theme.surface};
  border-radius: 17px;
  width: 180px;
  height: 35px;
  font-size: 18px;
  font-weight: bold;
`;

const BannerContainer = styled.div`
  width: 100%;
  height: 500px;
  background-color: #dfdbe8;
  padding: 50px;
  text-align: center;
  margin-top: 60px;
  margin-bottom: 60px;
`;

const StyledSpace = styled(Space)`
  width: 100%;
  > * {
    width: 100%;
    height: 100%;
    vertical-align: middle;
  }
`;

const FirstParagraph = styled(StyledSpace)`
  width: 690px;
  display: block;
  margin: 5px auto 0 0;
  font-size: 16px;
`;

const SecondParagraph = styled(StyledSpace)`
  width: 690px;
  display: block;
  margin: 5px  auto 0 0;
  font-size: 16px;
`;

const ThirdParagraph = styled(StyledSpace)`
  margin-top: 10px;
`;

const FourthParagraph = styled(StyledSpace)`
  margin-bottom: 80px;
`;

export default Introduction;
