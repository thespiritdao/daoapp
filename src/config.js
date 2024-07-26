require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    SESSION_SECRET: process.env.SESSION_SECRET,
    SAFE_ADDRESS: process.env.SAFE_ADDRESS,
    RPC_URL: process.env.RPC_URL,
    COINBASE_WAAS_API_KEY: process.env.COINBASE_WAAS_API_KEY,
    UNLOCK_NETWORK: process.env.UNLOCK_NETWORK || 'mainnet',
    UNLOCK_PROVIDER_URL: process.env.UNLOCK_PROVIDER_URL,
};