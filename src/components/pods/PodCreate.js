import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PodCreate = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [hatId, setHatId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/pods', { name, description, hatId });
      navigate('/pods');
    } catch (error) {
      console.error('Error creating pod:', error);
    }
  };

  return (
    <div>
      <h2>Create New Pod</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="hatId">Hat ID:</label>
          <input
            type="text"
            id="hatId"
            value={hatId}
            onChange={(e) => setHatId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Pod</button>
      </form>
    </div>
  );
};

export default PodCreate;