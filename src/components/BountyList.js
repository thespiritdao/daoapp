import React from 'react';
import { mockBounties } from '../mockData';

const BountyList = ({ limit }) => {
  const bounties = limit ? mockBounties.slice(0, limit) : mockBounties;

  return (
    <div className="bounty-list">
      {bounties.map((bounty) => (
        <div key={bounty.id} className="bounty-item">
          <h3>{bounty.title}</h3>
          <p>Reward: {bounty.reward}</p>
          <p>Status: {bounty.status}</p>
        </div>
      ))}
    </div>
  );
};

export default BountyList;