import { DeploymentUnitOutlined, OrderedListOutlined } from '@ant-design/icons';
import { Col, Row, Space } from 'antd';
import useWallet from 'hooks/useWallet';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Box from 'ui/Box';
import Button from 'ui/Button';
import { Text } from 'ui/Typography';
import { getContract } from 'utils/getContract';
import request from 'utils/request';
import Spaces from 'utils/spaces';
import formatNumber from 'utils/format';
import { ETH_USD_PRICE } from 'environment';

const OverallStats: React.FC = () => {
  const [data, setData] = useState([] as any);
  const { connector, library } = useWallet();
  const [saleData, setSaleData] = useState([] as any);
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
          setSaleData(filteredData);
        }
      }
    };
    getBlockchainData();
    return () => {
      mounted = false;
    };
  }, [connector]);

  const spacesForSales = Spaces.filter((space: any) =>
    saleData.some((item: any) => item.index === space.id)
  );

  const spacesForSalesWithPrice = spacesForSales.map((space: any) => {
    const blockchainData: any = saleData.find((item: any) => item.index === space.id);
    return { ...space, price: blockchainData?.price };
  });

  const lowestPrice =
    (spacesForSalesWithPrice.length > 0 &&
      spacesForSalesWithPrice.reduce((prev: any, curr: any) =>
        prev.price < curr.price ? prev : curr
      )) ||
    0;

  useEffect(() => {
    const getData = async () => {
      const result = await request.getData('/transactions/stats/overall', {});
      if (result && result.status === 200) setData(result.data);
    };
    getData();
  }, []);
  return (
    <Box w='1050px' m='auto'>
      <Row justify='center' gutter={[0, 24]}>
        <TitleContainer>
          <Title>Overall Stats</Title>
        </TitleContainer>
      </Row>
      <Row justify='center' gutter={[0, 24]}>
        <Col span={8}>
          <StatsNameText>Current Lowest Price Available</StatsNameText>
          <StatsValueText>
            {lowestPrice &&
              lowestPrice.price &&
              library &&
              library.utils.fromWei(lowestPrice?.price?.toString(), 'ether')}
            Ξ ($
            {formatNumber(
              lowestPrice &&
                lowestPrice.price &&
                library &&
                library.utils.fromWei(lowestPrice?.price?.toString(), 'ether') * ETH_USD_PRICE,
              2
            )}
            )
          </StatsValueText>
        </Col>
        <Col span={8}>
          <StatsNameText>Number of Sales (Last 12 Months)</StatsNameText>
          <StatsValueText>{data.numberOfSales || 0}</StatsValueText>
        </Col>
        <Col span={8}>
          <StatsNameText>Total Value of All Sales (Lifetime)</StatsNameText>
          <StatsValueText>
            {data.totalLifeTimeValueOfAllSales || 0}Ξ ($
            {formatNumber(((data.totalLifeTimeValueOfAllSales || 0) * ETH_USD_PRICE).toString(), 2)})
          </StatsValueText>
        </Col>
        <ButtonContainer>
          <StyledButton $bgType='primary' onClick={() => window.open('/topOwners', '_blank')}>
            <OrderedListOutlined />
            Top Owners
          </StyledButton>
          <StyledButton $bgType='primary' onClick={() => window.open("/attributes", "_blank")}>
            <DeploymentUnitOutlined />
            All Types
          </StyledButton>
        </ButtonContainer>
      </Row>
    </Box>
  );
};

const Title = styled(Text)`
  font-size: 36px;
  font-weight: bold;
`;

const StatsNameText = styled(Text)`
  font-size: 20px;
  display: block;
`;

const StatsValueText = styled(Text)`
  font-size: 20px;
  font-weight: bold;
`;

const StyledButton = styled(Button)`
  display: block;
  color: ${(p) => p.theme.surface};
  font-weight: bold;
  height: 48px;
  font-size: 18px;
  width: 100%;
  .anticon {
    margin-right: 10px;
    font-size: 19px;
    font-weight: bold;
  }
`;

const ButtonContainer = styled(Space)`
  width: 100%;
  > * {
    width: 100%;
    height: 100%;
    vertical-align: middle;
  }
  margin: 30px 0 50px 0;
`;

const TitleContainer = styled(Space)`
  width: 100%;
  > * {
    width: 100%;
    height: 100%;
    vertical-align: middle;
  }
  margin: 60px 0 15px 0;
`;
export default OverallStats;
