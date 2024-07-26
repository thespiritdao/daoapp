import React, { useState } from 'react';
import { useSocket } from '../contexts/SocketContext';

const MessageInput = ({ podId }) => {
  const [message, setMessage] = useState('');
  const socket = useSocket();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('sendMessage', { podId, message });
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-input">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="message-input__field"
      />
      <button type="submit" className="message-input__submit">Send</button>
    </form>
  );
};

export default MessageInput;