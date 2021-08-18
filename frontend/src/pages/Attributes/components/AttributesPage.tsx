/* eslint-disable no-unused-vars */
import { TypographyProps } from 'antd';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Box from 'ui/Box';
import MainContainer from 'ui/MainContainer';
import { Title } from 'ui/Typography';
import { getContract } from 'utils/getContract';
import useWallet from 'hooks/useWallet';
import Spaces from 'utils/spaces';
import BreadCrumb from 'ui/Breadcrumb';
import TableAttributes from './TableAttributes';

const AttributesPage: React.FC = () => {
  const { connector, library } = useWallet();
  const [data, setData] = useState([]);
  const [bidData, setBidData] = useState([]);
  const [saleData, setSaleData] = useState([]);
  const natureSpaces = Spaces.filter((space) => space.type === 'Nature');
  const deviceSpaces = Spaces.filter((space) => space.type === 'Device');
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
    const getBlockchainSaleData = async () => {
      if (connector) {
        const { marketContract } = await getContract(connector);
        const spacesOffereds = await marketContract.methods.returnSpacesOfferedForSaleArray().call();
        if (mounted) {
          let filteredData = [];
          if (spacesOffereds && spacesOffereds.length > 0) {
            filteredData = spacesOffereds
              .filter((item: any) => item && item[0])
              .map((item: any) => ({
                index: Number(item.spaceIndex),
                price: item.minValue,
                owner: item[2]
              }));
          }
          setSaleData(filteredData);
        }
      }
    };
    const getBlockchainBidData = async () => {
      if (connector) {
        const { marketContract } = await getContract(connector);
        const spacesOfferedBids = await marketContract.methods.returnSpacesBidsArray().call();
        if (mounted) {
          let filteredBidData = [];
          if (spacesOfferedBids && spacesOfferedBids.length > 0) {
            filteredBidData = spacesOfferedBids
              .filter((item: any) => item && item[0])
              .map((item: any) => ({
                index: Number(item.spaceIndex),
                price: item.value,
                bidder: item.bidder
              }));
          }
          setBidData(filteredBidData);
        }
      }
    };

    getBlockchainBidData();
    getBlockchainSaleData();
    getBlockchainData();
    return () => {
      mounted = false;
    };
  }, [connector]);
  const natureSales = natureSpaces.filter((space) => data.some((item: any) => item.index === space.id));
  const deviceSales = deviceSpaces.filter((space) => data.some((item: any) => item.index === space.id));
  const natureSalesMap = natureSales.map((space) => {
    const blockchainData: any = data.find((item: any) => item.index === space.id);
    return { ...space, price: blockchainData.price };
  });
  const deviceSalesMap = deviceSales.map((space) => {
    const blockchainData: any = data.find((item: any) => item.index === space.id);
    return { ...space, price: blockchainData.price };
  });
  const natureCount = natureSpaces.length;
  const deviceCount = deviceSpaces.length;
  const natureAvail = natureSales.length;
  const deviceAvail = deviceSales.length;
  const cheapestNature =
    (natureSalesMap.length > 0 &&
      natureSalesMap.reduce((prev: any, curr: any) => (Number(prev.price) < Number(curr.price) ? prev : curr))) ||
    0;
  const cheapestNatureEther =
    library &&
    library.utils &&
    cheapestNature &&
    library.utils.fromWei(cheapestNature.price.toString(), 'ether');
  const cheapestDevice =
    (deviceSalesMap.length > 0 &&
      deviceSalesMap.reduce((prev: any, curr: any) => (Number(prev.price) < Number(curr.price) ? prev : curr))) ||
    0;
  const cheapestDeviceEther =
    library &&
    library.utils &&
    cheapestDevice &&
    library.utils.fromWei(cheapestDevice.price.toString(), 'ether');
  const avgNature =
    natureSalesMap.reduce((prev, curr) => prev + Number(curr.price), 0) / natureSalesMap.length;
  const avgNatureEther =
    library && library.utils && avgNature && library.utils.fromWei(avgNature.toString(), 'ether');
  const avgDevice =
    deviceSalesMap.reduce((prev, curr) => prev + Number(curr.price), 0) / deviceSalesMap.length;
  const avgDeviceEther =
    library && library.utils && avgDevice && library.utils.fromWei(avgDevice.toString(), 'ether');

  return (
    <MainContainer mt='100px'>
      <BreadCrumb crumbs={['All Types']} />
      <Box w='1050px' m='35px auto 0'>
        <Title $color='#4B4B4B' $size='48px'>
          All Types
        </Title>
        <ContentContainer>
          <Title $color='#4B4B4B' $size='24px' >
            Space Types
          </Title>
          <TableAttributes
            data={{
              natureCount,
              deviceCount,
              cheapestNatureEther,
              cheapestDeviceEther,
              avgNatureEther,
              avgDeviceEther,
              cheapestDevice,
              cheapestNature,
              bidData,
              saleData,
              natureAvail,
              deviceAvail
            }}
          />
        </ContentContainer>
      </Box>
    </MainContainer>
  );
};

export type ModifiedContent = Partial<TypographyProps> & {
  mt?: string;
};

const ContentContainer = styled.div`
  margin-top: ${(p: any) => p.mt || '50px'};
`;

export default AttributesPage;
