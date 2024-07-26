const Web3 = require('web3');
const selfTokenABI = require('../contracts/SELFTokenABI.json');

// Replace with actual contract address
const SELF_TOKEN_ADDRESS = '0x1234567890123456789012345678901234567890';

class CryptoPayment {
  constructor(providerUrl) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
    this.selfToken = new this.web3.eth.Contract(selfTokenABI, SELF_TOKEN_ADDRESS);
  }

  async connectWallet(address) {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.web3.eth.defaultAccount = address;
        return true;
      } catch (error) {
        console.error('User denied account access', error);
        return false;
      }
    } else {
      console.log('Non-Ethereum browser detected. Consider installing MetaMask!');
      return false;
    }
  }

  async getBalance(address) {
    try {
      const balance = await this.selfToken.methods.balanceOf(address).call();
      return this.web3.utils.fromWei(balance, 'ether');
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  }

  async makePayment(fromAddress, toAddress, amount) {
    try {
      const amountWei = this.web3.utils.toWei(amount.toString(), 'ether');
      const gasPrice = await this.web3.eth.getGasPrice();
      const gasEstimate = await this.selfToken.methods.transfer(toAddress, amountWei).estimateGas({ from: fromAddress });

      const receipt = await this.selfToken.methods.transfer(toAddress, amountWei).send({
        from: fromAddress,
        gas: gasEstimate,
        gasPrice: gasPrice
      });

      return receipt;
    } catch (error) {
      console.error('Error making payment:', error);
      throw error;
    }
  }
}

module.exports = CryptoPayment;