import { checkOutPolygonTransaction, CONNECT_TO_METAMASK, EMPTY_FIELDS, INSTALL_METAMASK, showErrorMessage, WRITE_MESSAGE } from '../constants/statusMessages.js';
import { pinJSONToIPFS } from './pinata.js'

require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require('../contract-abi.json')
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS; // https://mumbai.polygonscan.com/address/0x8dB0faC09587829Dbc7Ae51698891c24f37142E0#code

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const obj = {
        status: WRITE_MESSAGE,
        address: addressArray[0],
      };

      return obj;
    } catch (err) {
      return {
        address: "",
        status: showErrorMessage(err.message),
      };
    }
  } else {
    return {
      address: "",
      status: INSTALL_METAMASK,
    };
  }
};

export const getCurrentWalletConnect = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: WRITE_MESSAGE,
        }
      } else {
        return {
          address: "",
          status: CONNECT_TO_METAMASK,
        };
      }
    } catch (err) {
      return {
        address: "",
        status: showErrorMessage(err.message),
      };
    }
  } else {
    return {
      address: "",
      status: INSTALL_METAMASK,
    };
  }
}

export const mintNFT = async (url, name, description) => {
  if (url.trim() === '' || name.trim() === '' || description.trim() === '') {
    return {
      success: false,
      status: EMPTY_FIELDS,
    };
  }

  const metadata = {
    name,
    image: url,
    description,
  }

  const pinataResponse = await pinJSONToIPFS(metadata);

  if (!pinataResponse.success) {
    return {
      success: false,
      status: showErrorMessage("Something went wrong while uploading your tokenURI."),
    }
  }

  const tokenURI = pinataResponse.pinataUrl;

  window.contract = await new web3.eth.Contract(contractABI, contractAddress);

  const transactionParameters = {
    to: contractAddress,
    from: window.ethereum.selectedAddress,
    data: window.contract.methods.mintNFT(window.ethereum.selectedAddress, tokenURI).encodeABI(),
  }

  try {
    const txHash = await window.ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

    return {
      success: true,
      status: checkOutPolygonTransaction(txHash),
    }
  } catch(error) {
    return {
      success: false,
      status: showErrorMessage(error.message),
    }
  }
}