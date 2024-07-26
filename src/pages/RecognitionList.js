import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import RecognitionForm from '../components/RecognitionForm';

const RecognitionList = ({ podId }) => {
  const [recognitions, setRecognitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socket = useSocket();

  useEffect(() => {
    fetchRecognitions();

    if (socket) {
      socket.on('newRecognition', (recognition) => {
        setRecognitions((prevRecognitions) => [...prevRecognitions, recognition]);
      });
    }

    return () => {
      if (socket) {
        socket.off('newRecognition');
      }
    };
  }, [socket, podId]);

  const fetchRecognitions = async () => {
    try {
      const response = await fetch(`/api/recognition/${podId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recognitions');
      }
      const data = await response.json();
      setRecognitions(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading recognitions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="recognition-list-page">
      <h1>Recognitions</h1>
      <RecognitionForm podId={podId} />
      <div className="recognition-list">
        {recognitions.map((recognition) => (
          <div key={recognition.id} className="recognition-item">
            <p><strong>Recipient:</strong> {recognition.recipient}</p>
            <p><strong>Reason:</strong> {recognition.reason}</p>
            <p><strong>Hat ID:</strong> {recognition.hatId}</p>
            <p><strong>Given by:</strong> {recognition.givenBy}</p>
            <p><strong>Date:</strong> {new Date(recognition.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecognitionList;