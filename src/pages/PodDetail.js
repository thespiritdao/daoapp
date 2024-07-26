import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow';

const PodDetail = () => {
  const { podId } = useParams();
  const [pod, setPod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPodDetails();
  }, [podId]);

  const fetchPodDetails = async () => {
    try {
      const response = await fetch(`/api/pods/${podId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch pod details');
      }
      const data = await response.json();
      setPod(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading pod details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!pod) return <div>Pod not found</div>;

  return (
    <div className="pod-detail-page">
      <h1>{pod.name}</h1>
      <p>{pod.description}</p>
      <div className="pod-details">
        <h2>Pod Details</h2>
        <p>Creator: {pod.creatorId}</p>
        <p>Parent Pod: {pod.parentPodId || 'None'}</p>
        <p>Hat ID: {pod.hatId}</p>
      </div>
      <div className="pod-apps">
        <h2>Pod Apps</h2>
        <ul>
          {pod.apps.map(app => (
            <li key={app.id}>{app.name}</li>
          ))}
        </ul>
      </div>
      <div className="pod-chat">
        <h2>Pod Chat</h2>
        <ChatWindow podId={podId} />
      </div>
      <div className="pod-actions">
        <h2>Pod Actions</h2>
        <Link to={`/recognitions/${podId}`}>View Recognitions</Link>
        <Link to="/pods" className="back-button">Back to Pods</Link>
      </div>
    </div>
  );
};

export default PodDetail;