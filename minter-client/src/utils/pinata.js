require('dotenv').config();

const key = process.env.REACT_APP_PINATA_KEY;
const secret = process.env.REACT_APP_PINATA_SECRET

const axios = require('axios');

export const pinJSONToIPFS = async(JSONbody) => {
  const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

  return axios
    .post(url, JSONbody, {
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      }
    })
    .then((response) => {
      return {
        success: true,
        pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
      }
    })
    .catch((error) => {
      console.log(error);

      return {
        success: false,
        message: error.message,
      }
    })
}