import axios from 'axios';
import { PINATA_KEY, PINATA_SECRET } from '../config';

export const pinJSONToIPFS = async (JSONbody) => {
  const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

  return axios
    .post(url, JSONbody, {
      headers: {
        pinata_api_key: PINATA_KEY,
        pinata_secret_api_key: PINATA_SECRET,
      },
    })
    .then((response) => ({
      success: true,
      pinataUrl: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
    }))
    .catch((error) => ({
      success: false,
      message: error.message,
    }));
};
