/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from 'react';
import MainContainer from 'ui/MainContainer';
import styled from 'styled-components';
import { Col, Row, notification } from 'antd';
import Spaces from 'utils/spaces';
import { Link } from 'react-router-dom';
import formatNumber from 'utils/format';
import { Text } from 'ui/Typography';
import Box from 'ui/Box';
import Button from 'ui/Button';
import { CreditCardOutlined } from '@ant-design/icons';
import BreadCrumb from 'ui/Breadcrumb';
import useWallet from 'hooks/useWallet';
import { getContract } from 'utils/getContract';
import request from 'utils/request';
import { ETH_USD_PRICE } from 'environment';

const Account: React.FC = (props: any) => {
  const { connector, library, account } = useWallet();
  const [bidData, setBidData] = useState([]);
  const [saleData, setSaleData] = useState([]);
  const [spacesOwned, setSpacesOwned] = useState([]);
  const [data, setData] = useState([] as any);
  const [allBids, setAllBids] = useState([]);
  const [withDraw, setWithDraw] = useState('0');

  const id = (props as any)?.match?.params?.id;
  useEffect(() => {
    const getData = async () => {
      const result = await request.getData(`/transactions/stats/account/${id}`, {});
      if (result && result.status === 200) setData(result.data);
    };
    getData();
  }, [id]);
  useEffect(() => {
    let mounted = true;
    const getBlockchainWithDrawData = async () => {
      if (connector) {
        try {
          const { marketContract } = await getContract(connector);
          const pendingWithDraw = await marketContract.methods.pendingWithdrawals(id).call();
          if (mounted) {
            setWithDraw(pendingWithDraw);
          }
        } catch (error) {
          // continue regardless of error
        }
      }
    };
    const getBlockchainBidData = async () => {
      if (connector) {
        try {
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
            setAllBids(spacesOfferedBids);
            setBidData(filteredBidData);
          }
        } catch (error) {
          // continue regardless of error
        }
      }
    };
    const getBlockchainSaleData = async () => {
      if (connector) {
        try {
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
        } catch (error) {
          // continue regardless of error
        }
      }
    };
    const getBlockchainOwnedData = async () => {
      if (connector) {
        try {
          const { marketContract } = await getContract(connector);
          const spaceIndexToAddress = await marketContract.methods.returnSpaceIndexToAddressArray().call();
          if (mounted) {
            let spacesOwnedArray = [] as any;
            spaceIndexToAddress.forEach((item: any, index: any) => {
              if (item === id) spacesOwnedArray = [...spacesOwnedArray, index];
            });
            setSpacesOwned(spacesOwnedArray);
          }
        } catch (error) {
          // continue regardless of error
        }
      }
    };

    getBlockchainOwnedData();
    getBlockchainWithDrawData();
    getBlockchainBidData();
    getBlockchainSaleData();

    return () => {
      mounted = false;
    };
  }, [connector, id]);

  const spacesBids = Spaces.filter((space: any) =>
    bidData.some((item: any) => item.index === space.id)
  );

  const spacesBidsWithPriceAndOwner = spacesBids.map((space: any) => {
    const blockchainBidData: any = bidData.find((item: any) => item.index === space.id);
    return { ...space, price: blockchainBidData.price, bidder: blockchainBidData.bidder };
  });

  const accountBids =
    spacesBidsWithPriceAndOwner && spacesBidsWithPriceAndOwner.filter((item) => item.bidder === id);

  const totalBidValue =
    (accountBids.length > 0 &&
      accountBids.reduce((prev: any, curr: any) => prev + Number(curr.price), 0)) ||
    0;

  const spacesForSales = Spaces.filter((space: any) =>
    saleData.some((item: any) => item.index === space.id)
  );

  const spacesForSalesWithPrice = spacesForSales.map((space: any) => {
    const blockchainData: any = saleData.find((item: any) => item.index === space.id);
    return { ...space, price: blockchainData.price, owner: blockchainData.owner };
  });

  const accountOffers = spacesForSalesWithPrice.filter((item: any) => item.owner === id);

  const spacesOwnedDetail = Spaces.filter((space: any) =>
    spacesOwned.some((item: any) => item === space.id)
  );

  const spacesBoughtDetail =
    data &&
    data.bought &&
    data.bought.map((item: any) => {
      const spacesData: any = Spaces.find((space: any) => space.id === Number(item.spaceId));
      return { ...item, img: spacesData.img };
    });

  const spacesSoldDetail =
    data &&
    data.sold &&
    data.sold.map((item: any) => {
      const spacesData: any = Spaces.find((space: any) => space.id === Number(item.spaceId));
      return { ...item, img: spacesData.img };
    });

  const bidsOnOwnedSpace =
    allBids &&
    allBids.filter((item: any) =>
      spacesOwned.some((space: any) => space === Number(item.spaceIndex) && item[0])
    );

  const totalBidOwnedSpaceValue =
    (bidsOnOwnedSpace.length > 0 &&
      bidsOnOwnedSpace.reduce((prev: any, curr: any) => prev + Number(curr.value), 0)) ||
    0;

  const spacesBidsOwnedSpaceDetail =
    bidsOnOwnedSpace &&
    bidsOnOwnedSpace.map((item: any) => {
      const spacesData: any = Spaces.find((space: any) => space.id === Number(item.spaceIndex));
      return { ...item, img: spacesData.img };
    });

  const handleError = (err: any) => {
    const ERROR_REGEX = /reason string \'(.+?)\'\",\"data/g;
    const results = ERROR_REGEX.exec(err.message);
    if (results && results.length >= 2) {
      const errorMessage = results[1];
      notification.error({
        message: 'Error',
        description: errorMessage
      });
    } else
      notification.error({
        message: 'Error',
        description: 'Transaction faileds'
      });
  };

  const handleWithdraw = async () => {
    const { marketContract } = await getContract(connector);
    try {
      await marketContract.methods
        .withdraw()
        .send({ from: account })
        .on('receipt', async () => {
          notification.success({
            message: 'Withdraw ',
            description: 'Withdraw Success'
          });
          setWithDraw('0');
        });
    } catch (e) {
      handleError(e);
    }
  };

  const spacesWithColor = Spaces.map((space: any) => {
    const isForSale =
      spacesForSales &&
      spacesForSales.length > 0 &&
      spacesForSales.some((item: any) => item.id === space.id);
    const isBid =
      spacesBids && spacesBids.length > 0 && spacesBids.some((item: any) => item.id === space.id);
    return { isForSale, isBid, id: space.id };
  });

  const getBackground = (spaceId: any) => {
    const spaceFound = spacesWithColor.find((space: any) => space.id === spaceId);
    if (spaceFound?.isBid) return '#8e6fb6';
    if (spaceFound?.isForSale) return '#95554f';
    return '#dfdbe8';
  };
  return (
    <MainContainer>
      <BreadCrumb crumbs={['Accounts', id.slice(0, 10)]} />
      <Box w='1050px' m='40px auto 0'>
        <BigTitle>Account Details</BigTitle>
        <SmallTitle>{id}</SmallTitle>
        {id === account && withDraw !== '0' && (
          <StyledButton
            $bgType='primary'
            onClick={() => {
              handleWithdraw();
            }}
          >
            <CreditCardOutlined /> Withdraw{' '}
            {library && library.utils.fromWei(withDraw.toString(), 'ether')} ETH
          </StyledButton>
        )}

        <Row justify='center' gutter={[0, 15]}>
          <Col span={8}>
            <Title>Etherscan</Title>
            <a href={`https://etherscan.io/address/${id}`} target='blank'>
              <LinkText>{id.slice(0, 20)}</LinkText>
            </a>
          </Col>
          <Col span={8}>
            <Title>Total Spaces Owned</Title>
            <Value>{spacesOwned.length}</Value>
          </Col>
          <Col span={8}>{' '}</Col>
          <Col span={8}>
            <Title>Total Amount Spent Buying Spaces</Title>
            <Value>
              {data.boughtETHTotal}Ξ ($
              {formatNumber((data.boughtETHTotal * ETH_USD_PRICE).toString(), 2)})
            </Value>
          </Col>
          <Col span={8}>
            <Title>Bids On Owned Spaces</Title>
            <Value>{bidsOnOwnedSpace && bidsOnOwnedSpace.length}</Value>
          </Col>
          <Col span={8}>
            <Title>Value of Bids On Owned Spaces</Title>
            <Value>
              {' '}
              {totalBidOwnedSpaceValue &&
                library &&
                library.utils.fromWei(totalBidOwnedSpaceValue.toString(), 'ether')}
              Ξ ($
              {formatNumber(
                totalBidOwnedSpaceValue &&
                  library &&
                  library.utils.fromWei(totalBidOwnedSpaceValue.toString(), 'ether') *
                    ETH_USD_PRICE,
                2
              )}
              )
            </Value>
          </Col>
          <Col span={8}>
            <Title>Total Amount Earned Selling Spaces</Title>
            <Value>
              {data.soldETHTotal}Ξ ($
              {formatNumber((data.soldETHTotal * ETH_USD_PRICE).toString(), 2)})
            </Value>
          </Col>
          <Col span={8}>
            <Title>Current Bids Placed By This Account</Title>
            <Value>{accountBids && accountBids.length}</Value>
          </Col>
          <Col span={8}>
            <Title>Value of Current Bids Placed</Title>
            <Value>
              {totalBidValue && library && library.utils.fromWei(totalBidValue.toString(), 'ether')}
              Ξ ($
              {formatNumber(
                totalBidValue &&
                  library &&
                  library.utils.fromWei(totalBidValue.toString(), 'ether') * ETH_USD_PRICE,
                2
              )}
              ).
            </Value>
          </Col>
        </Row>

        <StyledSpace style={{ marginTop: 60 }}>
          <SpaceTitle>{spacesOwned && spacesOwned.length} Spaces Owned</SpaceTitle>
          <Content>
            <ItemsContainer justify='start' gutter={[0, 10]}>
              {spacesOwnedDetail.map((space) => (
                <Col span={2} key={space.id}>
                  <ImageContainer style={{ backgroundColor: getBackground(space.id) }}>
                    <ImageWrapper>
                      <Link to={`/detail/${space.id}`}>
                        <img src={space.img} alt={`img${space.id}`} />
                      </Link>
                    </ImageWrapper>
                  </ImageContainer>
                </Col>
              ))}
            </ItemsContainer>
          </Content>
        </StyledSpace>

        <StyledSpace>
          <SpaceTitle>
            {accountOffers && accountOffers.length} Spaces for Sale by this Account
          </SpaceTitle>
          <Content>
            <ItemsContainer justify='start' gutter={[0, 10]}>
              {accountOffers.map((space) => (
                <Col span={2} key={space.id}>
                  <ImageContainer style={{ backgroundColor: '#95554f' }}>
                    <ImageWrapper>
                      <Link to={`/detail/${space.id}`}>
                        <img src={space.img} alt={`img${space.id}`} />
                      </Link>
                    </ImageWrapper>
                  </ImageContainer>
                  <StyledText $size='14px' $color='#4B4B4B'>
                    {space.price &&
                      library &&
                      library.utils.fromWei(space.price.toString(), 'ether')}{' '}
                    ETH
                  </StyledText>
                  <StyledText $size='14px' $color='#4B4B4B'>
                    $
                    {formatNumber(
                      space.price &&
                        library &&
                        library.utils.fromWei(space.price.toString(), 'ether') * ETH_USD_PRICE,
                      2
                    )}
                  </StyledText>
                </Col>
              ))}
            </ItemsContainer>
          </Content>
        </StyledSpace>

        <StyledSpace>
          <SpaceTitle>
            {totalBidOwnedSpaceValue && library
              ? `${library.utils.fromWei(totalBidOwnedSpaceValue.toString(), 'ether')} ETH
                ($${formatNumber(
                  (
                    library.utils.fromWei(totalBidOwnedSpaceValue.toString(), 'ether') *
                    ETH_USD_PRICE
                  ).toString(),
                  2
                )}) `
              : '0 '}
            in {spacesBidsOwnedSpaceDetail && spacesBidsOwnedSpaceDetail.length} Bids For Spaces
            Owned by this Account
          </SpaceTitle>
          <Content>
            <ItemsContainer justify='start' gutter={[0, 10]}>
              {spacesBidsOwnedSpaceDetail.map((space) => (
                <Col span={2} key={space.spaceIndex}>
                  <ImageContainer
                    style={{ backgroundColor: '#8e6fb6' }}
                  >
                    <ImageWrapper>
                      <Link to={`/detail/${space.spaceIndex}`}>
                        <img src={space.img} alt={`img${space.id}`} />
                      </Link>
                    </ImageWrapper>
                  </ImageContainer>
                  <StyledText $size='14px' $color='#4B4B4B'>
                    {space.value &&
                      library &&
                      library.utils.fromWei(space.value.toString(), 'ether')}{' '}
                    ETH
                  </StyledText>
                  <StyledText $size='14px' $color='#4B4B4B'>
                    $
                    {formatNumber(
                      space.value &&
                        library &&
                        library.utils.fromWei(space.value.toString(), 'ether') * ETH_USD_PRICE,
                      2
                    )}
                  </StyledText>
                </Col>
              ))}
            </ItemsContainer>
          </Content>
        </StyledSpace>

        <StyledSpace>
          <SpaceTitle>
            {totalBidValue && library
              ? `${library.utils.fromWei(totalBidValue.toString(), 'ether')} ETH
                ($${formatNumber(
                  (
                    library.utils.fromWei(totalBidValue.toString(), 'ether') * ETH_USD_PRICE
                  ).toString(),
                  2
                )}) `
              : '0 '}
            in {accountBids && accountBids.length} Bids Placed by This Account
          </SpaceTitle>
          <Content>
            <ItemsContainer justify='start' gutter={[0, 10]}>
              {accountBids.map((space) => (
                <Col span={2} key={space.id}>
                  <ImageContainer style={{ backgroundColor: '#8e6fb6' }}>
                    <ImageWrapper>
                      <Link to={`/detail/${space.id}`}>
                        <img src={space.img} alt={`img${space.id}`} />
                      </Link>
                    </ImageWrapper>
                  </ImageContainer>
                  <StyledText $size='14px' $color='#4B4B4B'>
                    {space.price &&
                      library &&
                      library.utils.fromWei(space.price.toString(), 'ether')}{' '}
                    ETH
                  </StyledText>
                  <StyledText $size='14px' $color='#4B4B4B'>
                    $
                    {formatNumber(
                      space.price &&
                        library &&
                        library.utils.fromWei(space.price.toString(), 'ether') * ETH_USD_PRICE,
                      2
                    )}
                  </StyledText>
                </Col>
              ))}
            </ItemsContainer>
          </Content>
        </StyledSpace>

        <StyledSpace>
          <SpaceTitle>
            {' '}
            {data.boughtETHTotal
              ? `${data.boughtETHTotal} ETH ($${formatNumber(
                  (data.boughtETHTotal * ETH_USD_PRICE).toString(),
                  2
                )}) `
              : `0 `}
            in {spacesBoughtDetail ? spacesBoughtDetail.length : 0} Spaces Bought by This Account
          </SpaceTitle>
          <Content>
            <ItemsContainer justify='start' gutter={[0, 10]}>
              {spacesBoughtDetail &&
                spacesBoughtDetail.map((space: any) => (
                  <Col span={2} key={space.createdAt}>
                    <ImageContainer
                      style={{ backgroundColor: getBackground(Number(space.spaceId)) }}
                    >
                      <ImageWrapper>
                        <Link to={`/detail/${space.spaceId}`}>
                          <img src={space.img} alt={`img${space.id}`} />
                        </Link>
                      </ImageWrapper>
                    </ImageContainer>
                    <StyledText $size='14px' $color='#4B4B4B'>
                      {space.amount} ETH
                    </StyledText>
                    <StyledText $size='14px' $color='#4B4B4B'>
                      ${space.amount * ETH_USD_PRICE}
                    </StyledText>
                  </Col>
                ))}
            </ItemsContainer>
          </Content>
        </StyledSpace>

        <StyledSpace>
          <SpaceTitle>
            {' '}
            {data.soldETHTotal
              ? `${data.soldETHTotal} ETH ($${formatNumber(
                  (data.soldETHTotal * ETH_USD_PRICE).toString(),
                  2
                )}) `
              : `0 `}
            in {spacesSoldDetail && spacesSoldDetail.length} Spaces Sold by This Account
          </SpaceTitle>
          <Content>
            <ItemsContainer justify='start' gutter={[0, 10]}>
              {spacesSoldDetail &&
                spacesSoldDetail.map((space: any) => (
                  <Col span={2} key={space.createdAt}>
                    <ImageContainer
                      style={{ backgroundColor: getBackground(Number(space.spaceId)) }}
                    >
                      <ImageWrapper>
                        <Link to={`/detail/${space.spaceId}`}>
                          <img src={space.img} alt={`img${space.id}`} />
                        </Link>
                      </ImageWrapper>
                    </ImageContainer>
                    <StyledText $size='14px' $color='#4B4B4B'>
                      {space.amount} ETH
                    </StyledText>
                    <StyledText $size='14px' $color='#4B4B4B'>
                      ${space.amount * ETH_USD_PRICE}
                    </StyledText>
                  </Col>
                ))}
            </ItemsContainer>
          </Content>
        </StyledSpace>
      </Box>
    </MainContainer>
  );
};

const StyledButton = styled(Button)`
  color: ${(p) => p.theme.surface};
  width: 500px;
  height: 40px;
  font-weight: bold;
  font-size: 16px;
  text-align: left;
  margin-bottom: 30px;
  .anticon {
    font-size: 18px;
    margin-right: 5px;
  }
`;

const Content = styled.div`
  min-height: 70px;
`;

const StyledSpace = styled.div`
  width: 100%;
`;

const SpaceTitle = styled(Text)`
  font-size: 22px;
  display: block;
  font-weight: bold;
  border-bottom: 1px solid #bbb;
  width: 100%;
`;

const ItemsContainer = styled(Row)`
  margin: 30px 0;
`;

const BigTitle = styled(Text)`
  font-size: 45px;
  font-weight: bold;
  display: block;
`;

const Title = styled(Text)`
  font-size: 18px;
  display: block;
`;

const Value = styled(Text)`
  font-size: 18px;
  display: block;
  font-weight: bold;
`;

const SmallTitle = styled(Text)`
  font-size: 22px;
  font-weight: bold;
  display: block;
  margin-bottom: 20px;
`;

const LinkText = styled(Text)`
  font-size: 18px;
  font-weight: bold;
  color: ${(p) => p.theme.primary};
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 90px;
  display: flex;
  align-items: center;
`;

const ImageWrapper = styled.div`
  width: 100%;
  text-align: center;
  img {
    width: 70px;
    height: 70px;
  }
`;

const StyledText = styled(Text)`
  display: block;
  text-align: center;
`;

export default Account;
