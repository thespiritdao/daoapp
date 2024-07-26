import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AppCreate = () => {
  const { podId } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState({
    name: '',
    description: '',
    // Add any other relevant fields for app creation
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setApp({ ...app, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`/api/pods/${podId}/apps`, app);
      navigate(`/pods/${podId}/apps`);
    } catch (error) {
      console.error('Error creating app:', error);
      setError('Failed to create app. Please try again.');
    }
  };

  return (
    <div className="app-create">
      <h2>Create New App</h2>
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
        {/* Add any other relevant fields for app creation */}
        <button type="submit">Create App</button>
      </form>
    </div>
  );
};

export default AppCreate;