import React from 'react';
import { Link } from 'react-router-dom';
import ItemList from './ItemList';
import OrderTracker from './OrderTracker';
import PurchaseForm from './PurchaseForm';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>SpiritDAO Dashboard</h1>
      <nav>
        <ul>
          <li><Link to="/shop">Shop</Link></li>
          <li><Link to="/orders">My Orders</Link></li>
          <li><Link to="/purchase">Make a Purchase</Link></li>
        </ul>
      </nav>
      <div className="dashboard-content">
        <section>
          <h2>Latest Items</h2>
          <ItemList />
        </section>
        <section>
          <h2>Recent Orders</h2>
          <OrderTracker />
        </section>
        <section>
          <h2>Quick Purchase</h2>
          <PurchaseForm />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;