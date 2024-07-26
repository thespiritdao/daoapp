import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatWindow = ({ podId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3000'); // Replace with your server URL
    setSocket(newSocket);

    // Join the pod's chat room
    newSocket.emit('join_pod', podId);

    // Listen for new messages
    newSocket.on('new_message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up on component unmount
    return () => newSocket.close();
  }, [podId]);

  const sendMessage = (content) => {
    if (socket) {
      const message = {
        content,
        senderId: userId,
        podId,
        timestamp: new Date().toISOString(),
      };
      socket.emit('send_message', message);
    }
  };

  return (
    <div className="chat-window">
      <h2>Pod Chat</h2>
      <MessageList messages={messages} currentUserId={userId} />
      <MessageInput sendMessage={sendMessage} />
    </div>
  );
};

export default ChatWindow;