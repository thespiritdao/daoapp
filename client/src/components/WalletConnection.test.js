import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import WalletConnection from './WalletConnection';
import { ethers } from 'ethers';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { Web3Service } from '@unlock-protocol/unlock-js';

// Mock the environment variables
process.env.REACT_APP_COINBASE_APP_ID = 'test_app_id';
process.env.REACT_APP_COINBASE_API_KEY = 'test_api_key';
process.env.REACT_APP_UNLOCK_NETWORK = 'test_network';
process.env.REACT_APP_UNLOCK_LOCK_ADDRESS = 'test_lock_address';
process.env.REACT_APP_CHAIN_ID = '1';
process.env.REACT_APP_RPC_URL = 'https://test.rpc.url';

// Mock the external dependencies
jest.mock('ethers');
jest.mock('@coinbase/wallet-sdk');
jest.mock('@unlock-protocol/unlock-js');

describe('WalletConnection', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('renders connect wallet button', () => {
    const { getByText } = render(<WalletConnection onConnect={() => {}} />);
    expect(getByText('Connect Wallet')).toBeInTheDocument();
  });

  it('shows error message when wallet connection fails', async () => {
    CoinbaseWalletSDK.mockImplementation(() => ({
      makeWeb3Provider: jest.fn().mockReturnValue({
        request: jest.fn().mockRejectedValue(new Error('Connection failed')),
      }),
    }));

    const { getByText } = render(<WalletConnection onConnect={() => {}} />);
    fireEvent.click(getByText('Connect Wallet'));

    await waitFor(() => {
      expect(getByText('Connection failed')).toBeInTheDocument();
    });
  });

  it('shows success message when wallet is connected and membership is verified', async () => {
    const mockAddress = '0x1234567890123456789012345678901234567890';
    const mockSigner = {
      getAddress: jest.fn().mockResolvedValue(mockAddress),
    };
    const mockProvider = {
      getSigner: jest.fn().mockReturnValue(mockSigner),
    };

    ethers.providers.Web3Provider.mockImplementation(() => mockProvider);

    CoinbaseWalletSDK.mockImplementation(() => ({
      makeWeb3Provider: jest.fn().mockReturnValue({
        request: jest.fn().mockResolvedValue([]),
      }),
    }));

    Web3Service.mockImplementation(() => ({
      getHasValidKey: jest.fn().mockResolvedValue(true),
    }));

    const mockOnConnect = jest.fn();
    const { getByText } = render(<WalletConnection onConnect={mockOnConnect} />);
    fireEvent.click(getByText('Connect Wallet'));

    await waitFor(() => {
      expect(getByText('Wallet connected and membership verified!')).toBeInTheDocument();
      expect(mockOnConnect).toHaveBeenCalledWith(mockAddress);
    });
  });

  it('shows error message when user is not a member', async () => {
    const mockAddress = '0x1234567890123456789012345678901234567890';
    const mockSigner = {
      getAddress: jest.fn().mockResolvedValue(mockAddress),
    };
    const mockProvider = {
      getSigner: jest.fn().mockReturnValue(mockSigner),
    };

    ethers.providers.Web3Provider.mockImplementation(() => mockProvider);

    CoinbaseWalletSDK.mockImplementation(() => ({
      makeWeb3Provider: jest.fn().mockReturnValue({
        request: jest.fn().mockResolvedValue([]),
      }),
    }));

    Web3Service.mockImplementation(() => ({
      getHasValidKey: jest.fn().mockResolvedValue(false),
    }));

    const { getByText } = render(<WalletConnection onConnect={() => {}} />);
    fireEvent.click(getByText('Connect Wallet'));

    await waitFor(() => {
      expect(getByText('You are not a member of this DAO. Please purchase a membership.')).toBeInTheDocument();
    });
  });
});