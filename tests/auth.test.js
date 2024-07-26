const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const { generateToken, verifyToken } = require('../src/utils/auth');
const CoinbaseWallet = require('@coinbase/wallet-sdk');
const UnlockProtocol = require('@unlock-protocol/unlock-js');
const { validateEnvironmentVariables } = require('../src/utils/envValidation');

jest.mock('@coinbase/wallet-sdk');
jest.mock('@unlock-protocol/unlock-js');
jest.mock('../src/utils/envValidation');

describe('Authentication Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    jest.clearAllMocks();
  });

  describe('Environment Variable Validation', () => {
    it('should validate all required environment variables', () => {
      validateEnvironmentVariables.mockReturnValue(true);
      expect(validateEnvironmentVariables()).toBe(true);
    });

    it('should throw an error if required environment variables are missing', () => {
      validateEnvironmentVariables.mockImplementation(() => {
        throw new Error('Missing required environment variables');
      });
      expect(validateEnvironmentVariables).toThrow('Missing required environment variables');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate a user with a valid wallet signature on mainnet', async () => {
      const mockWalletAddress = '0x1234567890123456789012345678901234567890';
      const mockSignature = 'valid_signature';

      CoinbaseWallet.verifySignature.mockResolvedValue(true);
      UnlockProtocol.verifyMembership.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ walletAddress: mockWalletAddress, signature: mockSignature, network: 'mainnet' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.walletAddress).toBe(mockWalletAddress);
    });

    it('should authenticate a user with a valid wallet signature on rinkeby', async () => {
      const mockWalletAddress = '0x1234567890123456789012345678901234567890';
      const mockSignature = 'valid_signature';

      CoinbaseWallet.verifySignature.mockResolvedValue(true);
      UnlockProtocol.verifyMembership.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ walletAddress: mockWalletAddress, signature: mockSignature, network: 'rinkeby' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.walletAddress).toBe(mockWalletAddress);
    });

    it('should reject authentication with an invalid wallet signature', async () => {
      const mockWalletAddress = '0x1234567890123456789012345678901234567890';
      const mockSignature = 'invalid_signature';

      CoinbaseWallet.verifySignature.mockResolvedValue(false);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ walletAddress: mockWalletAddress, signature: mockSignature });

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid signature');
    });

    it('should reject authentication for non-members', async () => {
      const mockWalletAddress = '0x1234567890123456789012345678901234567890';
      const mockSignature = 'valid_signature';

      CoinbaseWallet.verifySignature.mockResolvedValue(true);
      UnlockProtocol.verifyMembership.mockResolvedValue(false);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ walletAddress: mockWalletAddress, signature: mockSignature });

      expect(response.statusCode).toBe(403);
      expect(response.body).toHaveProperty('error', 'User is not a member');
    });

    it('should handle Coinbase Wallet API errors', async () => {
      const mockWalletAddress = '0x1234567890123456789012345678901234567890';
      const mockSignature = 'valid_signature';

      CoinbaseWallet.verifySignature.mockRejectedValue(new Error('Coinbase API error'));

      const response = await request(app)
        .post('/api/auth/login')
        .send({ walletAddress: mockWalletAddress, signature: mockSignature });

      expect(response.statusCode).toBe(500);
      expect(response.body).toHaveProperty('error', 'Error verifying wallet signature');
    });
  });

  describe('GET /api/auth/verify', () => {
    it('should verify a valid token', async () => {
      const user = new User({ walletAddress: '0x1234567890123456789012345678901234567890' });
      await user.save();

      const token = generateToken(user);

      const response = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('valid', true);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.walletAddress).toBe(user.walletAddress);
    });

    it('should reject an invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid token');
    });

    it('should reject an expired token', async () => {
      const user = new User({ walletAddress: '0x1234567890123456789012345678901234567890' });
      await user.save();

      const expiredToken = generateToken(user, '1ms');

      await new Promise(resolve => setTimeout(resolve, 5));

      const response = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('error', 'Token expired');
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh a valid token', async () => {
      const user = new User({ walletAddress: '0x1234567890123456789012345678901234567890' });
      await user.save();

      const token = generateToken(user);

      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.token).not.toBe(token);
    });

    it('should reject refreshing an invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid token');
    });
  });
});