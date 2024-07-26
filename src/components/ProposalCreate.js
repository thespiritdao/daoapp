import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProposalCreate = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [votingPeriod, setVotingPeriod] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/proposals', {
        title,
        description,
        votingPeriod: new Date(votingPeriod).toISOString(),
      });
      navigate(`/proposals/${response.data._id}`);
    } catch (error) {
      console.error('Error creating proposal:', error);
    }
  };

  return (
    <div>
      <h2>Create New Proposal</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
          <label htmlFor="votingPeriod">Voting Period End Date:</label>
          <input
            type="datetime-local"
            id="votingPeriod"
            value={votingPeriod}
            onChange={(e) => setVotingPeriod(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Proposal</button>
      </form>
    </div>
  );
};

export default ProposalCreate;