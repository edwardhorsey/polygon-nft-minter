import React from 'react';

export const INSTALL_METAMASK = (
  <p>
    🦊
    {' '}
    <a target="_blank" rel="noreferrer" href="https://metamask.io/download.html">
      You must install Metamask, a virtual Ethereum wallet, in your
      browser.
    </a>
  </p>
);

export const CONNECT_TO_METAMASK = '🦊 Connect to Metamask using the top right button.';

export const WRITE_MESSAGE = '👆🏽 Write a message in the text-field above.';

export const EMPTY_FIELDS = '❗Please make sure all fields are completed before minting.';

export const checkOutPolygonTransaction = (txHash) => `✅ Check out your transaction on Polygonscan: https://mumbai.polygonscan.com/tx/${txHash}`;

export const showErrorMessage = (message) => `😥 ${message}`;
