const Web3 = require('web3');
const selfTokenABI = require('../contracts/SELFTokenABI.json');

class CryptoPaymentService {
  constructor() {
    this.web3 = new Web3(Web3.givenProvider || process.env.WEB3_PROVIDER_URL);
    this.selfTokenAddress = process.env.SELF_TOKEN_ADDRESS;
    this.selfTokenContract = new this.web3.eth.Contract(selfTokenABI, this.selfTokenAddress);
  }

  async connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.web3 = new Web3(window.ethereum);
        return true;
      } catch (error) {
        console.error('User denied account access', error);
        return false;
      }
    } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      return false;
    }
  }

  async getBalance(address) {
    try {
      const balance = await this.selfTokenContract.methods.balanceOf(address).call();
      return this.web3.utils.fromWei(balance, 'ether');
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  async makePayment(fromAddress, toAddress, amount) {
    try {
      const amountInWei = this.web3.utils.toWei(amount.toString(), 'ether');
      const gasPrice = await this.web3.eth.getGasPrice();
      const gasEstimate = await this.selfTokenContract.methods.transfer(toAddress, amountInWei).estimateGas({ from: fromAddress });

      const tx = await this.selfTokenContract.methods.transfer(toAddress, amountInWei).send({
        from: fromAddress,
        gas: gasEstimate,
        gasPrice: gasPrice
      });

      return tx;
    } catch (error) {
      console.error('Error making payment:', error);
      throw error;
    }
  }
}

module.exports = new CryptoPaymentService();