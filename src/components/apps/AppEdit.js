import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AppEdit = () => {
  const { podId, appId } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState({
    name: '',
    description: '',
    // Add any other relevant fields for app editing
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const response = await axios.get(`/api/pods/${podId}/apps/${appId}`);
        setApp(response.data);
      } catch (error) {
        console.error('Error fetching app:', error);
        setError('Failed to fetch app details. Please try again.');
      }
    };
    fetchApp();
  }, [podId, appId]);

  const handleChange = (e) => {
    setApp({ ...app, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.put(`/api/pods/${podId}/apps/${appId}`, app);
      navigate(`/pods/${podId}/apps`);
    } catch (error) {
      console.error('Error updating app:', error);
      setError('Failed to update app. Please try again.');
    }
  };

  return (
    <div className="app-edit">
      <h2>Edit App</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">App Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={app.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={app.description}
            onChange={handleChange}
            required
          />
        </div>
        {/* Add any other relevant fields for app editing */}
        <button type="submit">Update App</button>
      </form>
    </div>
  );
};

export default AppEdit;