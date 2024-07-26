import React, { useState } from 'react';
import { ethers } from 'ethers';
import ErrorMessage from './ErrorMessage';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { Web3Service } from '@unlock-protocol/unlock-js';

const COINBASE_APP_ID = process.env.REACT_APP_COINBASE_APP_ID;
const COINBASE_API_KEY = process.env.REACT_APP_COINBASE_API_KEY;
const UNLOCK_NETWORK = process.env.REACT_APP_UNLOCK_NETWORK;
const UNLOCK_LOCK_ADDRESS = process.env.REACT_APP_UNLOCK_LOCK_ADDRESS;
const CHAIN_ID = parseInt(process.env.REACT_APP_CHAIN_ID, 10);
const RPC_URL = process.env.REACT_APP_RPC_URL;

const WalletConnection = ({ onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (!COINBASE_APP_ID || !COINBASE_API_KEY || !UNLOCK_NETWORK || !UNLOCK_LOCK_ADDRESS || !CHAIN_ID || !RPC_URL) {
        throw new Error('Missing required environment variables for wallet connection');
      }

      const coinbaseWallet = new CoinbaseWalletSDK({
        appName: 'DAO App',
        appLogoUrl: 'https://example.com/logo.png',
        darkMode: false,
        overrideIsMetaMask: false
      });

      const ethereum = coinbaseWallet.makeWeb3Provider(RPC_URL, CHAIN_ID);
      await ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      // Check membership using Unlock Protocol
      const web3Service = new Web3Service([UNLOCK_NETWORK]);
      const isMember = await web3Service.getHasValidKey(UNLOCK_LOCK_ADDRESS, address);

      if (isMember) {
        setSuccessMessage('Wallet connected and membership verified!');
        onConnect(address);
      } else {
        setError('You are not a member of this DAO. Please purchase a membership.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div>
      <button onClick={connectWallet} disabled={isConnecting}>
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
      <ErrorMessage message={error} />
      {successMessage && (
        <div style={{
          backgroundColor: '#e8f5e9',
          color: '#2e7d32',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '10px'
        }}>
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default WalletConnection;