import React from 'react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div style={{
      backgroundColor: '#ffebee',
      color: '#c62828',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '10px'
    }}>
      {message}
    </div>
  );
};

export default ErrorMessage;