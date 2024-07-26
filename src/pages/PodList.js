import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PodList = () => {
  const [pods, setPods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPods();
  }, []);

  const fetchPods = async () => {
    try {
      const response = await fetch('/api/pods');
      if (!response.ok) {
        throw new Error('Failed to fetch pods');
      }
      const data = await response.json();
      setPods(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading pods...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="pod-list-page">
      <h1>Pods</h1>
      <div className="pod-grid">
        {pods.map(pod => (
          <div key={pod.id} className="pod-card">
            <h2>{pod.name}</h2>
            <p>{pod.description}</p>
            <Link to={`/pods/${pod.id}`} className="view-pod-button">
              View Pod
            </Link>
          </div>
        ))}
      </div>
      <Link to="/pods/create" className="create-pod-button">
        Create New Pod
      </Link>
    </div>
  );
};

export default PodList;