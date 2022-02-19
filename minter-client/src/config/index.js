import contractAbiJson from '../contract-abi.json';

export const ALCHEMY_KEY = process.env.REACT_APP_ALCHEMY_KEY;

export const CONTRACT_ABI = contractAbiJson;
export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS; // https://mumbai.polygonscan.com/address/0x8dB0faC09587829Dbc7Ae51698891c24f37142E0#code

export const PINATA_KEY = process.env.REACT_APP_PINATA_KEY;
export const PINATA_SECRET = process.env.REACT_APP_PINATA_SECRET;