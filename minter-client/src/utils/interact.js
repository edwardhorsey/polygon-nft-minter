import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import { ALCHEMY_KEY, CONTRACT_ABI, CONTRACT_ADDRESS } from '../config';
import { pinJSONToIPFS } from './pinata';
import {
  checkOutPolygonTransaction,
  CONNECT_TO_METAMASK,
  EMPTY_FIELDS,
  INSTALL_METAMASK,
  showErrorMessage,
  WRITE_MESSAGE,
} from '../constants/statusMessages';

const web3 = createAlchemyWeb3(ALCHEMY_KEY);

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const obj = {
        status: WRITE_MESSAGE,
        address: addressArray[0],
      };

      return obj;
    } catch (err) {
      return {
        address: '',
        status: showErrorMessage(err.message),
      };
    }
  } else {
    return {
      address: '',
      status: INSTALL_METAMASK,
    };
  }
};

export const getCurrentWalletConnect = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: 'eth_accounts',
      });

      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: WRITE_MESSAGE,
        };
      }
      return {
        address: '',
        status: CONNECT_TO_METAMASK,
      };
    } catch (err) {
      return {
        address: '',
        status: showErrorMessage(err.message),
      };
    }
  } else {
    return {
      address: '',
      status: INSTALL_METAMASK,
    };
  }
};

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
  };

  const pinataResponse = await pinJSONToIPFS(metadata);

  if (!pinataResponse.success) {
    return {
      success: false,
      status: showErrorMessage('Something went wrong while uploading your tokenURI.'),
    };
  }

  const tokenURI = pinataResponse.pinataUrl;

  window.contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

  const transactionParameters = {
    to: CONTRACT_ADDRESS,
    from: window.ethereum.selectedAddress,
    data: window.contract.methods
      .mintNFT(window.ethereum.selectedAddress, tokenURI)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

    return {
      success: true,
      status: checkOutPolygonTransaction(txHash),
    };
  } catch (error) {
    return {
      success: false,
      status: showErrorMessage(error.message),
    };
  }
};
