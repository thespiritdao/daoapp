import React, { useState } from 'react';
import axios from 'axios';

const WalletLogin = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Get the user's Ethereum address
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const address = accounts[0];

      // Call our backend to authenticate
      const response = await axios.post('/api/auth/login', { userId: address });
      
      // Handle successful login
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        onLogin(response.data);
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wallet-login">
      <h2>Connect Your Wallet</h2>
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Connecting...' : 'Connect Wallet'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default WalletLogin;