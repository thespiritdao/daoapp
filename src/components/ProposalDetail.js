import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NotificationBadge from './NotificationBadge';

const ProposalDetail = () => {
  const [proposal, setProposal] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const response = await axios.get(`/api/proposals/${id}`);
        setProposal(response.data);
      } catch (error) {
        console.error('Error fetching proposal:', error);
      }
    };

    fetchProposal();
  }, [id]);

  const handleVote = async (voteType) => {
    try {
      await axios.post(`/api/proposals/${id}/vote`, { vote: voteType });
      // Refresh proposal data after voting
      const response = await axios.get(`/api/proposals/${id}`);
      setProposal(response.data);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  if (!proposal) return <div>Loading...</div>;

  return (
    <div>
      <h2>{proposal.title}</h2>
      <p>Description: {proposal.description}</p>
      <p>Creator: {proposal.creator}</p>
      <p>Created: {new Date(proposal.creationDate).toLocaleString()}</p>
      <p>Voting Period: {new Date(proposal.votingPeriod).toLocaleString()}</p>
      <p>Status: {proposal.status}</p>
      <div>
        <h3>Votes</h3>
        <p>For: {proposal.votes.for}</p>
        <p>Against: {proposal.votes.against}</p>
      </div>
      {proposal.status === 'active' && (
        <div className="vote-button-container">
          <button onClick={() => handleVote('for')}>Vote For</button>
          <button onClick={() => handleVote('against')}>Vote Against</button>
          <NotificationBadge />
        </div>
      )}
    </div>
  );
};

export default ProposalDetail;