import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <header className="app-header">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/pods">Pods</Link></li>
          </ul>
        </nav>
      </header>
      <main className="app-main">
        {children}
      </main>
      <footer className="app-footer">
        <p>&copy; 2024 SpiritDAO. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;