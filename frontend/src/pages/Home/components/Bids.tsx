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

const Bids: React.FC = () => {
  const { connector, library } = useWallet();
  const [data, setData] = useState([]);
  useEffect(() => {
    let mounted = true;
    const getBlockchainData = async () => {
      if (connector) {
        const { marketContract } = await getContract(connector);
        const spacesOfferedBids = await marketContract.methods.returnSpacesBidsArray().call();
        if (mounted) {
          let filteredData = [];
          if (spacesOfferedBids && spacesOfferedBids.length > 0) {
            filteredData = spacesOfferedBids
              .filter((item: any) => item && item[0])
              .map((item: any) => ({
                index: Number(item.spaceIndex),
                price: item.value
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
  const spacesBids = Spaces.filter((space: any) =>
    data.some((item: any) => item.index === space.id)
  );

  const spacesBidsWithPrice = spacesBids.map((space: any) => {
    const blockchainData: any = data.find((item: any) => item.index === space.id);
    return { ...space, price: blockchainData.price };
  });

  const totalBidValue =
    (spacesBidsWithPrice.length > 0 &&
      spacesBidsWithPrice.reduce((prev: any, curr: any) => prev + Number(curr.price), 0)) ||
    0;

  const averageBidValue = totalBidValue / spacesBidsWithPrice.length || 0;

  const countBids = spacesBids.length;

  return (
    <Box w='1050px' m='auto'>
      <Row justify='center' gutter={[0, 24]}>
        <Box w='100%' mt='50px'>
          <Title>Bids</Title>
          {spacesBidsWithPrice.length > 0 ? (
            <>
              <StyledText>
                The average bid over the last year was
                <HightlightText>
                  {formatNumber(
                    averageBidValue &&
                      library &&
                      library.utils.fromWei(averageBidValue.toString(), 'ether'),
                    2
                  )}{' '}
                  ETH ($
                  {formatNumber(
                    averageBidValue &&
                      library &&
                      library.utils.fromWei(averageBidValue.toString(), 'ether') * ETH_USD_PRICE,
                    2
                  )}
                  ).
                </HightlightText>
              </StyledText>
              <StyledText>
                The average currently open bid is
                <HightlightText>
                  {formatNumber(
                    averageBidValue &&
                      library &&
                      library.utils.fromWei(averageBidValue.toString(), 'ether'),
                    2
                  )}{' '}
                  ETH ($
                  {formatNumber(
                    averageBidValue &&
                      library &&
                      library.utils.fromWei(averageBidValue.toString(), 'ether') * ETH_USD_PRICE,
                    2
                  )}
                  ).
                </HightlightText>
              </StyledText>
              <StyledText>
                Total value of all current bids is
                <HightlightText>
                  {formatNumber(
                    totalBidValue &&
                      library &&
                      library.utils.fromWei(totalBidValue.toString(), 'ether'),
                    2
                  )}{' '}
                  ETH ($
                  {formatNumber(
                    totalBidValue &&
                      library &&
                      library.utils.fromWei(totalBidValue.toString(), 'ether') * ETH_USD_PRICE,
                    2
                  )}
                  ).
                </HightlightText>
              </StyledText>
              <StyledText>
                Showing most recent bids
                <LinkText>
                  <Link to='/bids'>click here to see all {countBids}</Link>
                </LinkText>
              </StyledText>
            </>
          ) : null}
        </Box>
      </Row>
      {spacesBidsWithPrice.length > 0 ? (
        <ItemsContainer>
          <ItemsRow gutter={[0, 10]}>
            {spacesBids.map((space) => (
              <Col key={space.id}>
                <Link to={`/detail/${space.id}`}>
                  <img src={space.img} alt={space.name} width='60px' height='60px' />
                </Link>
              </Col>
            ))}
          </ItemsRow>
        </ItemsContainer>
      ) : (
        <Text $size='18px'>There is no bid for spaces currently.</Text>
      )}
    </Box>
  );
};

const ItemsContainer = styled.div``;

const ItemsRow = styled(Row)`
  margin: 15px 0;
  text-align: center;

  .ant-col {
    background-color: #8e6fb6;
    padding: 20px;
    width: 100px;
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

export default Bids;
