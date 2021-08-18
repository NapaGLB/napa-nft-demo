/* eslint-disable react/destructuring-assignment */
import useWallet from 'hooks/useWallet';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Box from 'ui/Box';
import BreadCrumb from 'ui/Breadcrumb';
import MainContainer from 'ui/MainContainer';
import StyledTable from 'ui/Table';
import { Text, Title } from 'ui/Typography';
import { getContract } from 'utils/getContract';

const TopOwners: React.FC = () => {
  const { connector } = useWallet();
  const [spacesOwned, setSpacesOwned] = useState([]);
  const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

  useEffect(() => {
    let mounted = true;

    const getBlockchainOwnedData = async () => {
      if (connector) {
        const { marketContract } = await getContract(connector);
        const spaceIndexToAddress = await marketContract.methods.returnSpaceIndexToAddressArray().call();
        const addressGroup = spaceIndexToAddress
          .filter((space: any) => space !== NULL_ADDRESS)
          .reduce(
            (acc: any, value: any) => ({
              ...acc,
              [value]: (acc[value] || 0) + 1
            }),
            []
          );
        const addressArray = [] as any;
        Object.keys(addressGroup).forEach((key) => {
          addressArray.push({ address: key, numberOwned: addressGroup[key] });
        });
        if (mounted) setSpacesOwned(addressArray);
      }
    };
    getBlockchainOwnedData();

    return () => {
      mounted = false;
    };
  }, [connector]);

  const columns = [
    {
      title: '#',
      dataIndex: 'number',
      key: 'name',
      render(last: string, record: any) {
        return <Text $size='18px'>{(spacesOwned as any).indexOf(record) + 1}</Text>;
      }
    },
    {
      title: 'Account',
      dataIndex: 'address',
      key: 'address',
      render(address: string) {
        return (
          <Text $color='#0080FF' $size='18px' strong>
            <Link to={`/account/${address}`}>{address && address.slice(0, 16)}</Link>
          </Text>
        );
      }
    },
    {
      title: 'Number Owned',
      dataIndex: 'numberOwned',
      key: 'numberOwned',
      render(numberOwner: string) {
        return <Text $size='18px'>{numberOwner}</Text>;
      }
    }
  ];

  return (
    <MainContainer mt='100px'>
      <BreadCrumb crumbs={['All Owners']} />
      <Box w='1050px' m='35px auto 0'>
        <Title $size='48px'>All CryptoSpace Owners</Title>
        <OwnersTable
          columns={columns}
          dataSource={spacesOwned}
          rowKey='address'
          pagination={false}
        />
      </Box>
    </MainContainer>
  );
};

const OwnersTable = styled(StyledTable)`
  margin-top: 40px;
`;

export default TopOwners;
