import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthService } from '../services/auth';
import Login from '../components/Login';
import Shop from '../components/Shop';

// Mock the AuthService
jest.mock('../services/auth');

// Mock the axios library
jest.mock('axios');

describe('Authentication Flow', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('Login form submits correctly', async () => {
    AuthService.login.mockResolvedValue({ success: true, address: '0x123', hasMembership: true });

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/User ID/i), { target: { value: 'testuser' } });
    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalledWith('testuser');
    });
  });

  test('Login form shows error on failed login', async () => {
    AuthService.login.mockResolvedValue({ success: false, error: 'Invalid credentials' });

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/User ID/i), { target: { value: 'testuser' } });
    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  test('Protected route redirects to login when not authenticated', () => {
    AuthService.isAuthenticated.mockReturnValue(false);

    render(
      <Router>
        <Shop />
      </Router>
    );

    expect(screen.getByText(/Please log in to view this page/i)).toBeInTheDocument();
  });

  test('Protected route renders content when authenticated', () => {
    AuthService.isAuthenticated.mockReturnValue(true);
    AuthService.getToken.mockReturnValue('fake-token');

    render(
      <Router>
        <Shop />
      </Router>
    );

    expect(screen.getByText(/Shop/i)).toBeInTheDocument();
  });
});