import React, { useEffect, useState } from 'react';
import { CONNECT_TO_METAMASK, INSTALL_METAMASK, WRITE_MESSAGE } from './constants/statusMessages';
import {
  connectWallet,
  getCurrentWalletConnect,
  mintNFT,
  getNfts,
  getNftMetadata,
} from './utils/interact';

// eslint-disable-next-line react/prop-types
function Nft({ nft }) {
  const [metaData, setMetaData] = useState();

  useEffect(() => {
    const getNftMetadataEffect = async () => {
      const metaDataResponse = await getNftMetadata(nft);

      setMetaData(metaDataResponse);
    };

    getNftMetadataEffect();
  }, []);

  return (
    <p>{JSON.stringify(metaData)}</p>
  );
}

function Minter() {
  const [walletAddress, setWallet] = useState('');
  const [status, setStatus] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setURL] = useState('');
  const [nfts, setNfts] = useState({});

  useEffect(() => {
    const getCurrentWalletConnectEffect = async () => {
      const { address, status } = await getCurrentWalletConnect();
      setWallet(address);
      setStatus(status);
    };

    getCurrentWalletConnectEffect();

    // Add wallet listener
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus(WRITE_MESSAGE);
        } else {
          setWallet('');
          setStatus(CONNECT_TO_METAMASK);
        }
      });
    } else {
      setStatus(INSTALL_METAMASK);
    }
  }, []);

  useEffect(() => {
    if (!Object.keys(nfts).length && walletAddress) {
      const run = async () => {
        const nfts = await getNfts(walletAddress);

        setNfts(nfts);
      };

      run();
    }
  }, [walletAddress]);

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    const { status } = await mintNFT(url, name, description);
    setStatus(status);
  };

  return (
    <div className="Minter">
      <button type="button" className="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          `Connected: ${
            String(walletAddress).substring(0, 6)
          }...${
            String(walletAddress).substring(38)}`
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <h1 className="title">🔮 Alchemy NFT Minter</h1>
      <p>
        Simply add your asset&apos;s link, name, and description,
        then press &quot;Mint.&quot;
      </p>
      <form>
        <h2>🖼 Link to asset: </h2>
        <input
          type="text"
          placeholder="e.g. https://gateway.pinata.cloud/ipfs/<hash>"
          onChange={(event) => setURL(event.target.value)}
        />
        <h2>🤔 Name: </h2>
        <input
          type="text"
          placeholder="e.g. My first NFT!"
          onChange={(event) => setName(event.target.value)}
        />
        <h2>✍️ Description: </h2>
        <input
          type="text"
          placeholder="e.g. Even cooler than cryptokitties ;)"
          onChange={(event) => setDescription(event.target.value)}
        />
      </form>
      <button type="button" className="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
      <p className="status">
        {status}
      </p>
    </div>
  );
}

export default Minter;
