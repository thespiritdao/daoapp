const WalletAuthService = require('../services/walletAuth');
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    // Check for the authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header provided' });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if the user has a valid membership
    const hasMembership = await WalletAuthService.verifyMembership(decoded.address);
    if (!hasMembership) {
      return res.status(403).json({ message: 'Valid membership required' });
    }

    // Attach the user information to the request object
    req.user = {
      id: decoded.userId,
      address: decoded.address
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Internal server error during authentication' });
  }
};

module.exports = authMiddleware;