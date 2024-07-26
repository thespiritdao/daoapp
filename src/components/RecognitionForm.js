import React, { useState } from 'react';
import { useSocket } from '../contexts/SocketContext';

const RecognitionForm = ({ podId }) => {
  const [recipient, setRecipient] = useState('');
  const [reason, setReason] = useState('');
  const [hatId, setHatId] = useState('');
  const socket = useSocket();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/recognition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          podId,
          recipient,
          reason,
          hatId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to give recognition');
      }

      const data = await response.json();
      socket.emit('newRecognition', data);
      
      // Reset form
      setRecipient('');
      setReason('');
      setHatId('');

      alert('Recognition given successfully!');
    } catch (error) {
      console.error('Error giving recognition:', error);
      alert('Failed to give recognition. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="recognition-form">
      <h3>Give Recognition</h3>
      <div>
        <label htmlFor="recipient">Recipient:</label>
        <input
          type="text"
          id="recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="reason">Reason:</label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="hatId">Hat ID:</label>
        <input
          type="text"
          id="hatId"
          value={hatId}
          onChange={(e) => setHatId(e.target.value)}
          required
        />
      </div>
      <button type="submit">Give Recognition</button>
    </form>
  );
};

export default RecognitionForm;