import React, { useEffect, useState } from 'react';
import MainContainer from 'ui/MainContainer';
import styled from 'styled-components';
import { Col, Row } from 'antd';
import Spaces from 'utils/spaces';
import formatNumber from 'utils/format';
import { Link } from 'react-router-dom';
import { Text } from 'ui/Typography';
import Box from 'ui/Box';
import BreadCrumb from 'ui/Breadcrumb';
import request from 'utils/request';
import dayjs from 'dayjs';
import { ETH_USD_PRICE } from 'environment';

const TopSale: React.FC = () => {
  const [data, setData] = useState([] as any);

  useEffect(() => {
    const getData = async () => {
      const result = await request.getData('/transactions/topSales', {});
      if (result && result.status === 200) setData(result.data);
    };
    getData();
  }, []);

  const mappedSpaces =
    data &&
    data.map((item: any) => {
      const spacesData: any = Spaces.find((space: any) => space.id === Number(item.spaceId));
      return { ...item, img: spacesData.img };
    });

  return (
    <MainContainer>
      <BreadCrumb crumbs={['Top Sales by ETH']} />
      <Box w='1050px' m='35px auto 0'>
        <BigTitle>Top Sales by Ether Value</BigTitle>
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
    </MainContainer>
  );
};

const ItemsContainer = styled(Row)`
  margin-top: 30px;
  margin-bottom: 50px;
`;

const BigTitle = styled(Text)`
  font-size: 45px;
  font-weight: bold;
  display: block;
`;

const ImageContainer = styled.div`
  width: 85%;
  height: 150px;
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
    width: 105px;
    height: 105px;
  }
`;

const StyledText = styled(Text)`
  display: block;
`;

export default TopSale;
