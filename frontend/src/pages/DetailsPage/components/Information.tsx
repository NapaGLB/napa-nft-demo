/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from 'react';
import Box from 'ui/Box';
import Button from 'ui/Button';
import { Text } from 'ui/Typography';
import styled from 'styled-components';
import {
  ShoppingCartOutlined,
  PlusSquareOutlined,
  RetweetOutlined,
  TagOutlined,
  EditOutlined,
  CreditCardOutlined
} from '@ant-design/icons';
import useWallet from 'hooks/useWallet';
import { ISpaceProps } from 'types/SpaceProps';
import { getContract } from 'utils/getContract';
import { notification } from 'antd';
import { Link } from 'react-router-dom';
import { ETH_USD_PRICE, SC_INIT_OWNER_ADDRESS } from 'environment';
import formatNumber from 'utils/format';
import SaleModal from '../SaleModal';
import BidModal from '../BidModal';
import AcceptBidModal from '../AcceptBidModal';
import TransferModal from '../TransferModal';

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

const Information: React.FC<ISpaceProps> = (props: any) => {
  const { active, connector, account, library } = useWallet();
  const { data } = props;
  const [spaceInfo, setSpaceInfo] = useState({
    owner: SC_INIT_OWNER_ADDRESS,
    isForSale: false,
    price: 0,
    onlySellTo: NULL_ADDRESS,
    hasBid: false,
    bidder: NULL_ADDRESS,
    bidValue: 0
  });
  const [isSale, setIsSale] = useState(false);
  const [isBid, setIsBid] = useState(false);
  const [isAcceptBid, setIsAcceptBid] = useState(false);
  const [isTransfer, setIsTransfer] = useState(false);
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

  useEffect(() => {
    let mounted = true;
    const getBlockchainData = async () => {
      if (connector) {
        const { marketContract, tokenContract } = await getContract(connector);
        const owner = await tokenContract.methods.ownerOf(data.id).call();

        const spacesOfferedForSale = await marketContract.methods.spacesOfferedForSale(data.id).call();
        const spaceBids = await marketContract.methods.spaceBids(data.id).call();
        const { isForSale, minValue, onlySellTo } = spacesOfferedForSale;
        const { hasBid, bidder, value } = spaceBids;
        if (mounted)
          setSpaceInfo({
            owner,
            isForSale,
            price: minValue,
            onlySellTo,
            hasBid,
            bidder,
            bidValue: value
          });
      }
    };
    getBlockchainData();
    return () => {
      mounted = false;
    };
  }, [data.id, connector, account]);

  const handleClaim = async () => {
    const { marketContract, tokenContract } = await getContract(connector);

    try {
      const isApprovedForAll = await tokenContract.methods.isApprovedForAll(
        account,
        marketContract.options.address
      ).call();

      if (!isApprovedForAll) {
        await tokenContract.methods
        .setApprovalForAll(
          marketContract.options.address,
          true
        ).send({ from: account });
      }

      await marketContract.methods
        .getSpace(data.id)
        .send({ from: account })
        .on('receipt', async () => {
          setSpaceInfo({
            ...spaceInfo,
            owner: account || SC_INIT_OWNER_ADDRESS
          });
          notification.success({
            message: 'Claim Space',
            description: 'Claim Space Success'
          });
        });
    } catch (e) {
      handleError(e);
    }
  };

  const handleOfferForSale = async (value: any) => {
    const { marketContract } = await getContract(connector);
    try {
      await marketContract.methods
        .offerSpaceForSale(data.id, library.utils.toWei(value, 'ether'))
        .send({ from: account })
        .on('receipt', async () => {
          setSpaceInfo({
            ...spaceInfo,
            price: library.utils.toWei(value, 'ether'),
            onlySellTo: NULL_ADDRESS
          });
          notification.success({
            message: 'Offer For Sale',
            description: 'Offer For Sale Success'
          });
        });
    } catch (e) {
      handleError(e);
    }
  };

  const handleOfferForSaleToAddress = async (value: string, toAddress: string) => {
    const { marketContract } = await getContract(connector);
    try {
      await marketContract.methods
        .offerSpaceForSaleToAddress(data.id, library.utils.toWei(value, 'ether'), toAddress)
        .send({ from: account })
        .on('receipt', async () => {
          setSpaceInfo({
            ...spaceInfo,
            price: library.utils.toWei(value, 'ether'),
            onlySellTo: toAddress
          });
          notification.success({
            message: 'Offer For Sale',
            description: 'Offer For Sale Success'
          });
        });
    } catch (e) {
      handleError(e);
    }
  };

  const handleBid = async (value: any) => {
    const { marketContract } = await getContract(connector);
    try {
      await marketContract.methods
        .enterBidForSpace(data.id)
        .send({ from: account, value: library.utils.toWei(value, 'ether') })
        .on('receipt', async () => {
          setSpaceInfo({
            ...spaceInfo,
            bidValue: library.utils.toWei(value, 'ether'),
            bidder: account || NULL_ADDRESS,
            hasBid: true
          });
          notification.success({
            message: 'Bid Space',
            description: 'Bid Space Success'
          });
        });
    } catch (e) {
      handleError(e);
    }
  };

  const handleAcceptBid = async (value: any) => {
    const { marketContract } = await getContract(connector);
    try {
      await marketContract.methods
        .acceptBidForSpace(data.id, library.utils.toWei(value, 'ether'))
        .send({ from: account })
        .on('receipt', async () => {
          setSpaceInfo({
            ...spaceInfo,
            hasBid: false,
            bidValue: 0,
            bidder: NULL_ADDRESS,
            owner: spaceInfo.bidder
          });
          notification.success({
            message: 'Accept Bid',
            description: 'Accept Bid Success'
          });
        });
    } catch (e) {
      handleError(e);
    }
  };

  const handleWithdrawBid = async () => {
    const { marketContract } = await getContract(connector);
    try {
      await marketContract.methods
        .withdrawBidForSpace(data.id)
        .send({ from: account })
        .on('receipt', async () => {
          setSpaceInfo({
            ...spaceInfo,
            hasBid: false,
            bidValue: 0,
            bidder: NULL_ADDRESS
          });
          notification.success({
            message: 'Withdraw Bid',
            description: 'Withdraw Bid Success'
          });
        });
    } catch (e) {
      handleError(e);
    }
  };

  const handleBuySpace = async () => {
    const { marketContract } = await getContract(connector);
    try {
      await marketContract.methods
        .buySpace(data.id)
        .send({ from: account, value: price })
        .on('receipt', async () => {
          setSpaceInfo({
            ...spaceInfo,
            owner: account || SC_INIT_OWNER_ADDRESS,
            isForSale: false,
            price: 0,
            onlySellTo: NULL_ADDRESS,
            hasBid: false,
            bidder: NULL_ADDRESS
          });
          notification.success({
            message: 'Buy Space',
            description: 'Buy Space Success'
          });
        });
    } catch (e) {
      handleError(e);
    }
  };

  const handleTransferSpace = async (to: string) => {
    const { marketContract } = await getContract(connector);
    try {
      await marketContract.methods
        .transferSpace(to, data.id)
        .send({ from: account })
        .on('receipt', async () => {
          setSpaceInfo({
            ...spaceInfo,
            owner: to || SC_INIT_OWNER_ADDRESS,
            isForSale: false,
            price: 0,
            onlySellTo: NULL_ADDRESS
          });
          notification.success({
            message: 'Transfer Space',
            description: 'Transfer Space Success'
          });
        });
    } catch (e) {
      handleError(e);
    }
  };

  const { owner, isForSale, price, hasBid, bidValue, bidder } = spaceInfo;

  return (
    <Box w='900px' m='40px auto 0'>
      <BigTitle>{data.name}</BigTitle>
      <Type>
        One of {data.type === 'Device' ? 5 : 7}
        <Link to='/'>
          <LinkText> {data.type} </LinkText>
        </Link>
        space.
      </Type>
      <SmallTitle>Current Market Status</SmallTitle>
      <StyledText>
        This space is currently owned by{' '}
        {owner !== SC_INIT_OWNER_ADDRESS ? (
          <>
            address{' '}
            <Link to={`/account/${owner}`}>
              <LinkText>{owner.slice(0, 8)}</LinkText>
            </Link>
          </>
        ) : (
          ' no one'
        )}
        .
      </StyledText>
      {isForSale ? (
        <StyledText>
          This space is currently for sale by owner for{' '}
          {library && library.utils.fromWei(price.toString(), 'ether')} ETH ($
          {formatNumber(library && library.utils.fromWei(price.toString(), 'ether') * ETH_USD_PRICE, 2)}).
        </StyledText>
      ) : (
        <StyledText>This space has not been listed for sale by its owner.</StyledText>
      )}
      {hasBid ? (
        <StyledText>
          There is a bid of {library && library.utils.fromWei(bidValue.toString(), 'ether')} ETH ($
          {formatNumber(library && library.utils.fromWei(bidValue.toString(), 'ether') * ETH_USD_PRICE, 2)})
          for this space from{' '}
          <Link to={`/account/${bidder}`}>
            <LinkText>{bidder && bidder.slice(0, 8)}</LinkText>
          </Link>
          .
        </StyledText>
      ) : (
        <StyledText>There are currently no bids on this space.</StyledText>
      )}

      {isSale && (
        <SaleModal
          setOpenModal={setIsSale}
          visible={isSale}
          handleOfferForSale={handleOfferForSale}
          handleOfferForSaleToAddress={handleOfferForSaleToAddress}
        />
      )}
      {isAcceptBid && (
        <AcceptBidModal
          setOpenModal={setIsAcceptBid}
          visible={isAcceptBid}
          handleAcceptBid={handleAcceptBid}
        />
      )}
      {isTransfer && (
        <TransferModal
          setOpenModal={setIsTransfer}
          visible={isTransfer}
          handleTransferSpace={handleTransferSpace}
        />
      )}
      {isBid && <BidModal setOpenModal={setIsBid} visible={isBid} handleBid={handleBid} />}

      {active && (
        <>
          {owner === SC_INIT_OWNER_ADDRESS && (
            <StyledButton $bgType='primary' onClick={handleClaim}>
              <PlusSquareOutlined /> Claim
            </StyledButton>
          )}

          {account === owner && (
            <StyledButton $bgType='primary' onClick={() => setIsTransfer(true)}>
              <RetweetOutlined /> Transfer
            </StyledButton>
          )}

          {account === owner && (
            <StyledButton
              $bgType='primary'
              onClick={() => {
                setIsSale(true);
              }}
            >
              <EditOutlined /> Offer for Sale
            </StyledButton>
          )}

          {account !== owner && isForSale && (
            <StyledButton $bgType='primary' onClick={handleBuySpace}>
              <ShoppingCartOutlined /> Buy
            </StyledButton>
          )}

          {account !== owner && owner !== SC_INIT_OWNER_ADDRESS && (
            <StyledButton $bgType='primary' onClick={() => setIsBid(true)}>
              <TagOutlined /> Bid
            </StyledButton>
          )}

          {account === owner && hasBid && (
            <StyledButton $bgType='primary' onClick={() => setIsAcceptBid(true)}>
              <TagOutlined /> Accept Bid
            </StyledButton>
          )}

          {account === bidder && (
            <StyledButton
              $bgType='primary'
              onClick={() => {
                handleWithdrawBid();
              }}
            >
              <CreditCardOutlined /> Withdraw Bid
            </StyledButton>
          )}
        </>
      )}
      <SmallTitle>Transaction History</SmallTitle>
    </Box>
  );
};

const StyledButton = styled(Button)`
  color: ${(p) => p.theme.surface};
  width: 500px;
  height: 40px;
  font-weight: bold;
  font-size: 16px;
  text-align: left;
  margin-top: 15px;
  .anticon {
    font-size: 18px;
    margin-right: 5px;
  }
`;

const StyledText = styled(Text)`
  font-size: 18px;
  display: block;
  margin: 5px 0;
`;

const BigTitle = styled(Text)`
  font-size: 45px;
  font-weight: bold;
  display: block;
`;

const SmallTitle = styled(Text)`
  font-size: 24px;
  font-weight: bold;
  display: block;
  margin: 30px 0 15px;
`;

const Type = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  display: block;
`;

const LinkText = styled(Text)`
  font-size: 18px;
  font-weight: bold;
  color: ${(p) => p.theme.primary};
`;

export default Information;
