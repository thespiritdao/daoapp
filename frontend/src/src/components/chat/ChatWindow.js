import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import io from 'socket.io-client';

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3000'); // Replace with your server URL
    setSocket(newSocket);

    // Listen for incoming messages
    newSocket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up on component unmount
    return () => newSocket.close();
  }, []);

  const sendMessage = (text) => {
    if (socket) {
      socket.emit('sendMessage', { text });
    }
  };

  return (
    <View style={styles.container}>
      <MessageList messages={messages} />
      <MessageInput onSendMessage={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default ChatWindow;