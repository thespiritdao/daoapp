const { SmartWallet } = require('@coinbase/smart-wallet');
const { ethers } = require('ethers');
const UnlockProtocol = require('@unlock-protocol/unlock-js');

class WalletAuthService {
  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    this.unlockProtocol = new UnlockProtocol.Web3Service({
      networkId: process.env.NETWORK_ID,
      provider: this.provider,
    });
    this.membershipLockAddress = process.env.MEMBERSHIP_LOCK_ADDRESS;
  }

  async createOrConnectWallet(userId) {
    try {
      const smartWallet = new SmartWallet({
        appId: process.env.COINBASE_APP_ID,
        network: process.env.NETWORK_ID,
        serverUrl: process.env.COINBASE_SERVER_URL,
      });

      await smartWallet.init(userId);
      const address = await smartWallet.getAddress();
      return { smartWallet, address };
    } catch (error) {
      console.error('Error creating/connecting wallet:', error);
      throw error;
    }
  }

  async verifyMembership(address) {
    try {
      const hasValidKey = await this.unlockProtocol.getKeyStatus(
        this.membershipLockAddress,
        address
      );
      return hasValidKey;
    } catch (error) {
      console.error('Error verifying membership:', error);
      throw error;
    }
  }

  async airdropMembershipToken(address) {
    try {
      // Implement the logic to airdrop the membership token
      // This will depend on your specific token and airdrop mechanism
      console.log(`Airdropping membership token to ${address}`);
      // For now, we'll just return true to simulate a successful airdrop
      return true;
    } catch (error) {
      console.error('Error airdropping membership token:', error);
      throw error;
    }
  }
}

module.exports = new WalletAuthService();