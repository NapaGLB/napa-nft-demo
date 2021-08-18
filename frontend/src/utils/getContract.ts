/* eslint-disable import/prefer-default-export */
import Web3 from 'web3';

import { SC_MARKET_CONTRACT_ADDRESS, SC_TOKEN_CONTRACT_ADDRESS } from 'environment';

import contract from '../../../sc/artifacts/contracts/NapaCryptoSpaceMarket.sol/NapaCryptoSpaceMarket.json';
import Tokencontract from '../../../sc/artifacts/contracts/SpaceToken.sol/SpaceToken.json';

export const getContract = async (connector: any) => {
  if (!connector) throw Error('No connector found');
  const walletProvider = await connector.getProvider();
  const web3 = new Web3(walletProvider);

  const marketContractAbi: any = contract.abi;
  const tokenContractAbi: any = Tokencontract.abi;

  // TODO: Get network address whenever JSON file change
  const marketContractAddress = SC_MARKET_CONTRACT_ADDRESS;
  const tokenContractAddress = SC_TOKEN_CONTRACT_ADDRESS;

  return {
    marketContract: new web3.eth.Contract(marketContractAbi, marketContractAddress),
    tokenContract: new web3.eth.Contract(tokenContractAbi, tokenContractAddress)
  }
};
