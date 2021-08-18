import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import styled from 'styled-components';
import { Text } from 'ui/Typography';
import Box from 'ui/Box';
import Spaces from 'utils/spaces';
import { Link } from 'react-router-dom';
import useWallet from 'hooks/useWallet';
import { getContract } from 'utils/getContract';
import formatNumber from 'utils/format';
import { ETH_USD_PRICE } from 'environment';

const ForSales: React.FC = () => {
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

  const lowestPrice =
    (spacesForSalesWithPrice.length > 0 &&
      spacesForSalesWithPrice.reduce((prev: any, curr: any) =>
        prev.price < curr.price ? prev : curr
      )) ||
    0;

  const countSales = spacesForSales.length;

  return (
    <Box w='1050px' m='auto'>
      <Row justify='center' gutter={[0, 24]}>
        <Box w='100%' mt='50px'>
          <Title>For Sales</Title>
          {spacesForSalesWithPrice.length > 0 ? (
            <>
              <StyledText>
                The lowest price space currently for sale is
                <HightlightText>
                  {lowestPrice &&
                    library &&
                    library.utils.fromWei(lowestPrice?.price?.toString(), 'ether')}{' '}
                  ETH ($
                  {formatNumber(
                    lowestPrice &&
                      library &&
                      library.utils.fromWei(lowestPrice?.price?.toString(), 'ether') * ETH_USD_PRICE,
                    2
                  )}
                  ).
                </HightlightText>
              </StyledText>
              <StyledText>
                Showing most recent offers
                <LinkText>
                  <Link to='/forSale'>click here to see all {countSales}</Link>
                </LinkText>
              </StyledText>
            </>
          ) : null}
        </Box>
      </Row>
      {spacesForSalesWithPrice.length > 0 ? (
        <ItemsContainer>
          <ItemsRow gutter={[0, 10]}>
            {spacesForSales.map((space) => (
              <Col key={space.id}>
                <Link to={`/detail/${space.id}`}>
                  <img src={space.img} alt={space.name} width='60px' height='60px' />
                </Link>
              </Col>
            ))}
          </ItemsRow>
        </ItemsContainer>
      ) : (
        <Text $size='18px'>There is no spaces is for sale currently.</Text>
      )}
    </Box>
  );
};

const ItemsContainer = styled.div``;

const ItemsRow = styled(Row)`
  margin: 15px 0;
  text-align: center;

  .ant-col {
    width: 100px;
    background-color: #95554f;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      margin: 0 auto;
      cursor: pointer;
    }
  }
`;

const Title = styled(Text)`
  font-size: 36px;
  font-weight: bold;
  display: block;
`;

const StyledText = styled(Text)`
  font-size: 18px;
  display: block;
`;

const HightlightText = styled(Text)`
  font-size: 18px;
  margin-left: 10px;
  font-weight: bold;
`;

const LinkText = styled(Text)`
  font-size: 18px;
  margin-left: 10px;
  color: ${(p) => p.theme.primary};
  font-weight: bold;
`;

export default ForSales;
