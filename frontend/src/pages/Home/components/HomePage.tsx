import React, { useEffect, useState } from 'react';
import MainContainer from 'ui/MainContainer';
import request from 'utils/request';
import Introduction from './Introduction';
import OverallStats from './OverallStats';
import LargestSales from './LargestSales';
import RecentTransactions from './RecentTransactions';
import ForSales from './ForSales';
import Bids from './Bids';

const HomePage: React.FC = () => {
  const [data, setData] = useState([] as any);

  useEffect(() => {
    const getData = async () => {
      const result = await request.getData('/transactions/stats/overall', {});
      if (result && result.status === 200) setData(result.data);
    };
    getData();
  }, []);
  return (
    <MainContainer mt='100px'>
      <Introduction />
      <OverallStats overall={data} />
      <LargestSales overall={data} />
      <RecentTransactions overall={data} />
      <ForSales />
      <Bids />
    </MainContainer>
  );
};

export default HomePage;
