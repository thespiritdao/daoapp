const Web3 = require('web3');
const selfTokenABI = require('../contracts/SELFTokenABI.json');

// Replace with the actual SELF token contract address
const SELF_TOKEN_ADDRESS = '0x1234567890123456789012345678901234567890';

class CryptoPaymentHandler {
  constructor() {
    this.web3 = null;
    this.selfTokenContract = null;
  }

  async connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.web3 = new Web3(window.ethereum);
        this.selfTokenContract = new this.web3.eth.Contract(selfTokenABI, SELF_TOKEN_ADDRESS);
        return true;
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        return false;
      }
    } else {
      console.error('Ethereum wallet not detected');
      return false;
    }
  }

  async getBalance(address) {
    try {
      const balance = await this.selfTokenContract.methods.balanceOf(address).call();
      return this.web3.utils.fromWei(balance, 'ether');
    } catch (error) {
      console.error('Failed to get balance:', error);
      return null;
    }
  }

  async makePayment(fromAddress, toAddress, amount) {
    try {
      const amountWei = this.web3.utils.toWei(amount.toString(), 'ether');
      const transaction = this.selfTokenContract.methods.transfer(toAddress, amountWei);
      const gas = await transaction.estimateGas({ from: fromAddress });
      const result = await transaction.send({ from: fromAddress, gas });
      return result.transactionHash;
    } catch (error) {
      console.error('Payment failed:', error);
      return null;
    }
  }
}

module.exports = new CryptoPaymentHandler();