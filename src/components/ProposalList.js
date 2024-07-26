import React from 'react';
import { mockProposals } from '../mockData';

const ProposalList = ({ limit }) => {
  const proposals = limit ? mockProposals.slice(0, limit) : mockProposals;

  return (
    <div className="proposal-list">
      {proposals.map((proposal) => (
        <div key={proposal.id} className="proposal-item">
          <h3>{proposal.title}</h3>
          <p>Status: {proposal.status}</p>
          <p>Votes: {proposal.votes}</p>
        </div>
      ))}
    </div>
  );
};

export default ProposalList;