import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      <h1>Welcome to SpiritDAO</h1>
      <p>Connect, collaborate, and create with your decentralized community.</p>
      <div className="feature-list">
        <h2>Features:</h2>
        <ul>
          <li>
            <Link to="/pods">Pods</Link> - Join or create collaborative spaces
          </li>
          <li>Chat - Real-time communication within pods</li>
          <li>Recognition System - Acknowledge contributions using Hats Protocol</li>
          <li>Events Calendar - Stay updated on community activities</li>
          <li>Member Directory - Connect with other community members</li>
        </ul>
      </div>
      <div className="cta-section">
        <Link to="/pods" className="cta-button">
          Explore Pods
        </Link>
      </div>
    </div>
  );
};

export default Home;