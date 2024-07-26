import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { AuthProvider } from '../contexts/AuthContext';
import apiClient from '../utils/apiClient';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { Web3Service } from '@unlock-protocol/unlock-js';

jest.mock('../utils/apiClient');
jest.mock('@coinbase/wallet-sdk');
jest.mock('@unlock-protocol/unlock-js');

const mockWalletAddress = '0x1234567890123456789012345678901234567890';

describe('Authentication Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Coinbase Wallet SDK
    CoinbaseWalletSDK.mockImplementation(() => ({
      makeWeb3Provider: jest.fn().mockReturnValue({
        request: jest.fn().mockResolvedValue([mockWalletAddress]),
      }),
    }));

    // Mock Web3Service
    Web3Service.mockImplementation(() => ({
      getHasValidKey: jest.fn().mockResolvedValue(true),
    }));

    // Mock API client
    apiClient.post.mockResolvedValue({ data: { token: 'test_token' } });
  });

  it('completes the full authentication flow', async () => {
    const { getByText, queryByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    // Initial state: user is not logged in
    expect(getByText('Connect Wallet')).toBeInTheDocument();

    // Connect wallet
    await act(async () => {
      fireEvent.click(getByText('Connect Wallet'));
    });

    // Wait for wallet connection success message
    await waitFor(() => {
      expect(getByText('Wallet connected and membership verified!')).toBeInTheDocument();
    });

    // Attempt login
    await act(async () => {
      fireEvent.click(getByText('Login'));
    });

    // Wait for login success message
    await waitFor(() => {
      expect(getByText('Login successful!')).toBeInTheDocument();
    });

    // Check that the user is redirected to the home page
    await waitFor(() => {
      expect(getByText('Welcome to SpiritDAO')).toBeInTheDocument();
    });

    // Verify that the login button is no longer visible
    expect(queryByText('Login')).not.toBeInTheDocument();

    // Check for logout button
    expect(getByText('Logout')).toBeInTheDocument();

    // Attempt logout
    await act(async () => {
      fireEvent.click(getByText('Logout'));
    });

    // Verify that the user is logged out and the connect wallet button is visible again
    await waitFor(() => {
      expect(getByText('Connect Wallet')).toBeInTheDocument();
    });
  });
});