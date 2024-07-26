import React, { useState } from 'react';
import axios from 'axios';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import CryptoPaymentService from '../services/cryptoPayment';

const PurchaseForm = ({ item, onPurchaseComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState('fiat');
  const [address, setAddress] = useState('');
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    setError(null);

    if (!address) {
      setError('Please provide a delivery address.');
      setIsProcessing(false);
      return;
    }

    try {
      if (paymentMethod === 'fiat') {
        await handleFiatPayment();
      } else {
        await handleCryptoPayment();
      }

      // Create order
      const order = await axios.post('/api/orders', {
        itemId: item._id,
        address,
        paymentMethod
      });

      onPurchaseComplete(order.data);
    } catch (err) {
      setError(err.message);
    }

    setIsProcessing(false);
  };

  const handleFiatPayment = async () => {
    if (!stripe || !elements) {
      throw new Error('Stripe has not been initialized.');
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      throw new Error(error.message);
    }

    // Process payment with backend
    await axios.post('/api/payments/fiat', {
      paymentMethodId: paymentMethod.id,
      amount: item.price
    });
  };

  const handleCryptoPayment = async () => {
    const connected = await CryptoPaymentService.connectWallet();
    if (!connected) {
      throw new Error('Failed to connect to wallet.');
    }

    const balance = await CryptoPaymentService.getSELFBalance(window.ethereum.selectedAddress);
    if (balance < item.price) {
      throw new Error('Insufficient SELF token balance.');
    }

    await CryptoPaymentService.makePayment(
      window.ethereum.selectedAddress,
      process.env.REACT_APP_DAO_WALLET_ADDRESS,
      item.price
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Purchase {item.name}</h3>
      <p>Price: ${item.price}</p>

      <div>
        <label>
          <input
            type="radio"
            value="fiat"
            checked={paymentMethod === 'fiat'}
            onChange={() => setPaymentMethod('fiat')}
          />
          Pay with Credit Card
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="crypto"
            checked={paymentMethod === 'crypto'}
            onChange={() => setPaymentMethod('crypto')}
          />
          Pay with SELF Token
        </label>
      </div>

      {paymentMethod === 'fiat' && (
        <div>
          <label>
            Credit Card Details:
            <CardElement />
          </label>
        </div>
      )}

      <div>
        <label>
          Delivery Address:
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <button type="submit" disabled={isProcessing}>
        {isProcessing ? 'Processing...' : 'Complete Purchase'}
      </button>
    </form>
  );
};

export default PurchaseForm;