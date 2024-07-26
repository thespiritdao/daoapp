const express = require('express');
const router = express.Router();
const WalletAuthService = require('../services/walletAuth');
const jwt = require('jsonwebtoken');

// Login or register with wallet
router.post('/login', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Create or connect wallet
    const { smartWallet, address } = await WalletAuthService.createOrConnectWallet(userId);

    // Check if user has a membership
    let hasMembership = await WalletAuthService.verifyMembership(address);

    // If user doesn't have a membership, attempt to airdrop one
    if (!hasMembership) {
      const airdropSuccess = await WalletAuthService.airdropMembershipToken(address);
      if (airdropSuccess) {
        hasMembership = true;
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId, address, hasMembership },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Authentication successful',
      token,
      address,
      hasMembership
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login' });
  }
});

// Verify token and membership status
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const hasMembership = await WalletAuthService.verifyMembership(decoded.address);

    res.json({
      isValid: true,
      address: decoded.address,
      hasMembership
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ isValid: false, message: 'Invalid token' });
  }
});

module.exports = router;