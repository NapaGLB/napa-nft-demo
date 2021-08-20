import React from 'react';
import { Col, Row, Space } from 'antd';
import styled from 'styled-components';
import { Text } from 'ui/Typography';
import Box from 'ui/Box';
import Spaces from 'utils/spaces';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import formatNumber from 'utils/format';
import { ETH_USD_PRICE } from 'environment';

interface IHomeComponentProps {
  overall: any;
}
const LargestSales: React.FC<IHomeComponentProps> = (props: IHomeComponentProps) => {
  const { overall } = props;

  const mappedSpaces = overall?.largestSales?.map((item: any) => {
    const spacesData: any = Spaces.find((space: any) => space.id === Number(item.spaceId));
    return { ...item, img: spacesData.img };
  });
  return (
    <Box w='1050px' m='auto'>
      <Row justify='center' gutter={[0, 24]}>
        <StyledSpace>
          <Title>
            Largest Sales
            {mappedSpaces && mappedSpaces.length > 0 && (
              <LinkText>
                <Link to='/topSale'>See all top sales</Link>
              </LinkText>
            )}
          </Title>
        </StyledSpace>
      </Row>
      {mappedSpaces && mappedSpaces.length > 0 ? (
        <ItemsContainer justify='start' gutter={[0, 24]}>
          {mappedSpaces.map((space: any, index: any) => (
            <Col span={4} key={Math.random()}>
              <ImageContainer>
                <ImageNumber $size='30px' $color='white' strong>
                  {index > 8 ? index + 1 : `0${index + 1}`}
                </ImageNumber>
                <ImageWrapper>
                  <Link to={`/detail/${space.spaceId}`}>
                    <img src={space.img} alt={`img${space.id}`} />
                  </Link>
                </ImageWrapper>
              </ImageContainer>
              <StyledText $size='24px' strong $color='#0C264D'>
                #{space.spaceId}
              </StyledText>
              <StyledText $size='20px' $color='#4B4B4B'>
                {space.amount}Ξ ($
                {formatNumber((space.amount * ETH_USD_PRICE).toString(), 2)})
              </StyledText>
              <StyledText $size='20px' $color='#8D8D8D'>
                {dayjs(space.createdAt).format('MMM DD, YYYY')}
              </StyledText>
            </Col>
          ))}
        </ItemsContainer>
      ) : (
        <Text $size='18px'>There is no sales currently.</Text>
      )}{' '}
    </Box>
  );
};

const Title = styled(Text)`
  font-size: 36px;
  font-weight: bold;
`;

const LinkText = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  color: ${(p) => p.theme.primary};
  margin-left: 15px;
`;

const ImageContainer = styled.div`
  width: 90%;
  height: 180px;
  background-color: #638596;
  position: relative;
  margin-bottom: 20px;
`;

const ImageNumber = styled(Text)`
  position: absolute;
  left: 8px;
  top: 2px;
`;

const ImageWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  margin-left: 0;
  margin-right: 0;
  width: 100%;
  text-align: center;
  bottom: 3px;
  img {
    width: 140px;
    height: 130px;
  }
`;

const StyledSpace = styled(Space)`
  width: 100%;
  > * {
    width: 100%;
    height: 100%;
    vertical-align: middle;
  }
  margin-top: 20px;
`;

const ItemsContainer = styled(Row)`
  margin-top: 20px;
`;

const StyledText = styled(Text)`
  display: block;
`;

export default LargestSales;
