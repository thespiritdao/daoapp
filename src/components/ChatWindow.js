import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatWindow = ({ podId }) => {
  const [messages, setMessages] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    // Fetch initial messages for the pod
    fetchMessages();

    // Listen for new messages
    socket.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('newMessage');
    };
  }, [podId, socket]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/pods/${podId}/messages`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  return (
    <div className="chat-window">
      <MessageList messages={messages} />
      <MessageInput podId={podId} />
    </div>
  );
};

export default ChatWindow;