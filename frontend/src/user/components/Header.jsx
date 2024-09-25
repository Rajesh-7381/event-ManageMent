import React, { useState } from 'react';
import './Header.css';

const Header = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <header className="header">
      <div className="logo">
        <h1>Event ManageMent</h1>
      </div>
      <div className="nav-links">
        <a href="/dashboard2">Dashboard</a>
        <a href="/userprofile">Profile</a>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Header;
