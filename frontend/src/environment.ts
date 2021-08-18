// Socket URL
export const WS_END_POINT = process.env.REACT_APP_WS_END_POINT || 'http://localhost:3000';

// Limit space supply total
export const LIMIT_SPACE_SUPPLY_TOTAL = process.env.REACT_APP_LIMIT_SPACE_SUPPLY_TOTAL
                                    ? Number(process.env.REACT_APP_LIMIT_SPACE_SUPPLY_TOTAL)
                                    : 12;

// SC address
export const SC_MARKET_CONTRACT_ADDRESS = process.env.REACT_APP_SC_MARKET_CONTRACT_ADDRESS || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
export const SC_TOKEN_CONTRACT_ADDRESS = process.env.REACT_APP_SC_TOKEN_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3'
export const SC_INIT_OWNER_ADDRESS = process.env.REACT_APP_SC_INIT_OWNER_ADDRESS || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

// Common
export const ETH_USD_PRICE = process.env.ETH_USD_PRICE
                           ? Number(process.env.ETH_USD_PRICE)
                           : 3000;
