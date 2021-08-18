import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import styled from 'styled-components';
import { Text } from 'ui/Typography';
import Box from 'ui/Box';
import Spaces from 'utils/spaces';
import { Link } from 'react-router-dom';
import request from 'utils/request';
import formatNumber from 'utils/format';
import { useSocket } from 'socketio-hooks';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import { ETH_USD_PRICE } from 'environment';

dayjs.extend(updateLocale);
dayjs.extend(relativeTime);
dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: '%d seconds ',
    m: 'A minute',
    mm: '%d minutes',
    h: 'An hour',
    hh: '%d hours',
    d: 'A day',
    dd: '%d days',
    M: 'A month',
    MM: '%d months',
    y: 'A year',
    yy: '%d years'
  }
});
const RecentTransactions: React.FC = () => {
  const [data, setData] = useState([] as any);

  useSocket('transactions', '', async (socketData) => {
    if (socketData) {
      setData([socketData, ...data.slice(0, 11)]);
    }
  });

  useEffect(() => {
    const getData = async () => {
      const result = await request.getData('/transactions/stats/overall', {});
      if (result && result.status === 200) setData(result.data.recentTransactions);
    };
    getData();
  }, []);

  const getBackground = (type: string) => {
    switch (type) {
      case 'Offered':
        return '#95554f';
      case 'Bid':
        return '#8e6fb6';
      case 'Sold':
        return '#638596';
      case 'Claimed':
      case 'Transfer':
        return '#add6b8';
      default:
        return '#dfdbe8';
    }
  };

  const mappedTransactions =
    data &&
    data.map((item: any) => {
      const spacesData: any = Spaces.find((space: any) => space.id === Number(item.spaceId));
      return { ...item, img: spacesData.img };
    });
  return (
    <Box w='1050px' m='auto'>
      <Row justify='center' gutter={[0, 24]}>
        <Box w='100%' mt='50px'>
          <Title>Recent Transactions</Title>
          {data && data.length > 0 && <UpdateTime>{dayjs(data[0].createdAt).fromNow()}</UpdateTime>}
        </Box>
      </Row>
      {mappedTransactions && mappedTransactions.length > 0 ? (
        <ItemsContainer justify='start' gutter={[0, 24]}>
          {mappedTransactions.map((transaction: any) => (
            <Col span={4} key={transaction.createdAt}>
              <ImageContainer style={{ backgroundColor: getBackground(transaction.type) }}>
                <ImageWrapper>
                  <Link to={`/detail/${transaction.spaceId}`}>
                    <img src={transaction.img} alt={`img${transaction.spaceId}`} />
                  </Link>
                </ImageWrapper>
              </ImageContainer>
              <StyledText $size='24px' strong $color='#0C264D'>
                #{transaction.spaceId}
              </StyledText>
              <StyledText $size='20px' $color='#8D8D8D'>
                {transaction.type}
              </StyledText>
              {transaction.amount && (
                <StyledText $size='20px' $color='#4B4B4B'>
                  {transaction.amount}Ξ ($
                  {formatNumber((transaction.amount * ETH_USD_PRICE).toString(), 2)})
                </StyledText>
              )}
            </Col>
          ))}
        </ItemsContainer>
      ) : (
        <Text $size='18px'>There is no transaction currently.</Text>
      )}{' '}
    </Box>
  );
};

const StyledText = styled(Text)`
  display: block;
`;

const Title = styled(Text)`
  font-size: 36px;
  font-weight: bold;
  display: block;
`;

const UpdateTime = styled(Text)`
  font-size: 18px;
  margin-bottom: 20px;
`;

const ImageContainer = styled.div`
  width: 90%;
  height: 160px;
  position: relative;
  margin-bottom: 20px;
`;

const ImageWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  margin-left: 0;
  margin-right: 0;
  width: 100%;
  text-align: center;
  bottom: 10px;
  img {
    width: 140px;
    height: 140px;
  }
`;

const ItemsContainer = styled(Row)`
  margin-top: 20px;
`;

export default RecentTransactions;
