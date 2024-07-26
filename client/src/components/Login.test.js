import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { AuthProvider } from '../contexts/AuthContext';
import apiClient from '../utils/apiClient';

// Mock the apiClient
jest.mock('../utils/apiClient');

// Mock the useNavigate hook
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

const renderWithRouter = (ui, { route = '/' } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
};

describe('Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form', () => {
    const { getByText } = renderWithRouter(<Login />);
    expect(getByText('Login')).toBeInTheDocument();
  });

  it('shows error when wallet is not connected', async () => {
    const { getByText } = renderWithRouter(<Login />);
    fireEvent.click(getByText('Login'));

    await waitFor(() => {
      expect(getByText('Please connect your wallet first.')).toBeInTheDocument();
    });
  });

  it('handles successful login', async () => {
    apiClient.post.mockResolvedValue({ data: { token: 'test_token' } });

    const { getByText } = renderWithRouter(<Login />);
    
    // Simulate wallet connection
    fireEvent.click(getByText('Connect Wallet'));
    await waitFor(() => {
      expect(getByText('Wallet connected: 0x1234...5678')).toBeInTheDocument();
    });

    // Attempt login
    fireEvent.click(getByText('Login'));

    await waitFor(() => {
      expect(getByText('Login successful!')).toBeInTheDocument();
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('handles login failure', async () => {
    apiClient.post.mockRejectedValue({ response: { data: { message: 'Invalid credentials' } } });

    const { getByText } = renderWithRouter(<Login />);
    
    // Simulate wallet connection
    fireEvent.click(getByText('Connect Wallet'));
    await waitFor(() => {
      expect(getByText('Wallet connected: 0x1234...5678')).toBeInTheDocument();
    });

    // Attempt login
    fireEvent.click(getByText('Login'));

    await waitFor(() => {
      expect(getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});