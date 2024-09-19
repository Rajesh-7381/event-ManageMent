import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><a href="/dashboard2">Dashboard</a></li>
          <li><a href="/bookevent">Events</a></li>
          <li><a href="/status">Order Status</a></li>
          <li><a href="/userprofile">Profile</a></li>
          
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
