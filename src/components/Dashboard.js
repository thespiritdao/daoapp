import React from 'react';
import { Link } from 'react-router-dom';
import ProposalList from './ProposalList';
import EventList from './EventList';
import NotificationBadge from './NotificationBadge';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>SpiritDAO Dashboard</h1>
      <nav>
        <ul>
          <li><Link to="/proposals">Proposals <NotificationBadge /></Link></li>
          <li><Link to="/events">Events</Link></li>
          <li><Link to="/resources">Resources</Link></li>
          <li><Link to="/forum">Forum</Link></li>
          <li><Link to="/bounties">Bounties</Link></li>
        </ul>
      </nav>
      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Active Proposals</h2>
          <ProposalList limit={5} />
        </div>
        <div className="dashboard-section">
          <h2>Upcoming Events</h2>
          <EventList limit={5} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;