import React, { useEffect, useState } from 'react';
import MainContainer from 'ui/MainContainer';
import styled from 'styled-components';
import { Col, Row } from 'antd';
import Spaces from 'utils/spaces';
import { Link } from 'react-router-dom';
import { Text } from 'ui/Typography';
import Box from 'ui/Box';
import BreadCrumb from 'ui/Breadcrumb';
import useWallet from 'hooks/useWallet';
import { getContract } from 'utils/getContract';
import { ETH_USD_PRICE } from 'environment';

const ForSale: React.FC = () => {
  const { connector, library } = useWallet();
  const [data, setData] = useState([]);
  useEffect(() => {
    let mounted = true;
    const getBlockchainData = async () => {
      if (connector) {
        const { marketContract } = await getContract(connector);
        const spacesOfferedForSale = await marketContract.methods
          .returnSpacesOfferedForSaleArray()
          .call();
        if (mounted) {
          let filteredData = [];
          if (spacesOfferedForSale && spacesOfferedForSale.length > 0) {
            filteredData = spacesOfferedForSale
              .filter((item: any) => item && item[0])
              .map((item: any) => ({
                index: Number(item.spaceIndex),
                price: item.minValue
              }));
          }
          setData(filteredData);
        }
      }
    };
    getBlockchainData();
    return () => {
      mounted = false;
    };
  }, [connector]);

  const spacesForSales = Spaces.filter((space: any) =>
    data.some((item: any) => item.index === space.id)
  );
  const spacesForSalesWithPrice = spacesForSales.map((space: any) => {
    const blockchainData: any = data.find((item: any) => item.index === space.id);
    return { ...space, price: blockchainData.price };
  });

  return (
    <MainContainer>
      <BreadCrumb crumbs={['Spaces for Sale']} />
      <Box w='1050px' m='40px auto 0'>
        <BigTitle>Spaces for Sale </BigTitle>
        <ItemsContainer justify='start' gutter={[0, 10]}>
          {spacesForSalesWithPrice.length > 0 ? (
            spacesForSalesWithPrice.map((space) => (
              <Col span={2} key={space.id}>
                <ImageContainer>
                  <ImageWrapper>
                    <Link to={`/detail/${space.id}`}>
                      <img src={space.img} alt={`img${space.id}`} />
                    </Link>
                  </ImageWrapper>
                </ImageContainer>
                <StyledText $size='14px' $color='#4B4B4B'>
                  {library && library.utils.fromWei(space.price.toString(), 'ether')}Ξ
                </StyledText>
                <StyledText $size='14px' $color='#4B4B4B'>
                  ${library && library.utils.fromWei(space.price.toString(), 'ether') * ETH_USD_PRICE}
                </StyledText>
              </Col>
            ))
          ) : (
            <Text $size='18px'>There is no spaces is for sale currently.</Text>
          )}
        </ItemsContainer>
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
  width: 100%;
  height: 90px;
  background-color: #95554f;
  position: relative;
  margin-bottom: 5px;
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
    width: 70px;
    height: 70px;
  }
`;

const StyledText = styled(Text)`
  display: block;
  text-align: center;
`;

export default ForSale;
