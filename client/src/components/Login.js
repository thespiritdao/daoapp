import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import WalletConnection from './WalletConnection';
import apiClient from '../utils/apiClient';
import ErrorMessage from './ErrorMessage';

const Login = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleWalletConnect = (address) => {
    setWalletAddress(address);
  };

  const handleLogin = async () => {
    if (!walletAddress) {
      setError('Please connect your wallet first.');
      return;
    }

    setIsLoggingIn(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await apiClient.post('/auth/login', { walletAddress });
      login(response.data.token);
      setSuccessMessage('Login successful!');
      setTimeout(() => {
        navigate('/');
      }, 1500); // Redirect after 1.5 seconds
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <WalletConnection onConnect={handleWalletConnect} />
      {walletAddress && (
        <div>
          <p>Wallet connected: {walletAddress}</p>
          <button onClick={handleLogin} disabled={isLoggingIn || !walletAddress}>
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </button>
        </div>
      )}
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

export default Login;