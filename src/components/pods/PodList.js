import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PodList = () => {
  const [pods, setPods] = useState([]);

  useEffect(() => {
    const fetchPods = async () => {
      try {
        const response = await axios.get('/api/pods');
        setPods(response.data);
      } catch (error) {
        console.error('Error fetching pods:', error);
      }
    };

    fetchPods();
  }, []);

  return (
    <div>
      <h2>Pods</h2>
      {pods.map((pod) => (
        <div key={pod._id}>
          <h3>{pod.name}</h3>
          <p>{pod.description}</p>
          <Link to={`/pods/${pod._id}`}>View Details</Link>
        </div>
      ))}
      <Link to="/pods/create">Create New Pod</Link>
    </div>
  );
};

export default PodList;