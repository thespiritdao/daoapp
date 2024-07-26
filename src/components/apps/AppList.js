import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const AppList = () => {
  const [apps, setApps] = useState([]);
  const { podId } = useParams();

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await axios.get(`/api/pods/${podId}/apps`);
        setApps(response.data);
      } catch (error) {
        console.error('Error fetching apps:', error);
      }
    };
    fetchApps();
  }, [podId]);

  return (
    <div className="app-list">
      <h2>Apps in this Pod</h2>
      {apps.length === 0 ? (
        <p>No apps found in this pod.</p>
      ) : (
        <ul>
          {apps.map((app) => (
            <li key={app._id}>
              <h3>{app.name}</h3>
              <p>{app.description}</p>
              <Link to={`/pods/${podId}/apps/${app._id}`}>View Details</Link>
            </li>
          ))}
        </ul>
      )}
      <Link to={`/pods/${podId}/apps/create`}>Create New App</Link>
    </div>
  );
};

export default AppList;